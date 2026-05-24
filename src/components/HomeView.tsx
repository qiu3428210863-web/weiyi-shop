import React, { useState, useMemo } from 'react';
import { Product, CartItem } from '../types';
import { Search, ShoppingCart, SlidersHorizontal, ArrowUpDown, RefreshCw, AlertTriangle, ShieldCheck, Wallet, X } from 'lucide-react';
import { WLogo } from './WLogo';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (productId: string, quantity: number) => void;
  onNavigateToTab: (tabId: string) => void;
  cartCount: number;
  cartTotalPrice: number;
  cartItems: CartItem[];
  onUpdateCartQty: (productId: string, qty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onToggleCartCheck: (productId: string) => void;
  onToggleAllCart: (checked: boolean) => void;
  onCheckout: (checkedItemIds: string[]) => void;
  userCreditLimit: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onNavigateToTab,
  cartCount,
  cartTotalPrice,
  cartItems,
  onUpdateCartQty,
  onRemoveFromCart,
  onToggleCartCheck,
  onToggleAllCart,
  onCheckout,
  userCreditLimit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSortOrder, setPriceSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [stockOnlyFilter, setStockOnlyFilter] = useState(false);
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showCartSheet, setShowCartSheet] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const togglePriceSort = () => {
    setPriceSortOrder((prev) => {
      if (prev === 'none') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'none';
    });
    showToast(
      priceSortOrder === 'none'
        ? '已按价格从低到高排列'
        : priceSortOrder === 'asc'
          ? '已按价格从高到低排列'
          : '已重置价格排序'
    );
  };

  const toggleStockFilter = () => {
    setStockOnlyFilter((prev) => !prev);
    showToast(!stockOnlyFilter ? '已过滤显示有现货的商品' : '已显示全部目录');
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }

    if (stockOnlyFilter) {
      result = result.filter((p) => p.tags?.includes('现货') || p.tags?.includes('有库存'));
    }

    if (priceSortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, stockOnlyFilter, priceSortOrder]);

  const updateQty = (id: string, delta: number, moq: number) => {
    setQtys((prev) => {
      const cur = prev[id] || 0;
      let next = cur + delta;
      if (next < 0) next = 0;
      if (cur === 0 && delta > 0) {
        next = moq;
        showToast(`已自适应最小起订量 ${moq} 箱`);
      } else if (next > 0 && next < moq && delta < 0) {
        next = 0;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleAddCart = (p: Product) => {
    const qty = qtys[p.id] || 0;
    if (qty < p.moq) {
      showToast(`最小起订量为 ${p.moq} 箱`);
      setQtys((prev) => ({ ...prev, [p.id]: p.moq }));
      return;
    }
    onAddToCart(p.id, qty);
    showToast(`已加 ${qty} 箱 ${p.name}`);
    setQtys((prev) => ({ ...prev, [p.id]: 0 }));
  };

  // Cart sheet computations
  const cartProductMap = useMemo(() => {
    return new Map<string, Product>(products.map((p) => [p.id, p]));
  }, [products]);

  const checkedItems = useMemo(() => {
    return cartItems.filter((item) => item.checked);
  }, [cartItems]);

  const isAllChecked = useMemo(() => {
    return cartItems.length > 0 && cartItems.every((item) => item.checked);
  }, [cartItems]);

  const sheetCalculations = useMemo(() => {
    let subtotal = 0;
    let totalItemsCount = 0;
    checkedItems.forEach((item) => {
      const p = cartProductMap.get(item.productId);
      if (p) {
        subtotal += p.price * item.quantity;
        totalItemsCount += item.quantity;
      }
    });
    const wholesaleDiscount = subtotal * 0.05;
    const finalAmount = subtotal - wholesaleDiscount;
    return { subtotal, totalItemsCount, wholesaleDiscount, finalAmount };
  }, [checkedItems, cartProductMap]);

  const handleQtyStep = (productId: string, delta: number) => {
    const item = cartItems.find((ci) => ci.productId === productId);
    if (item) {
      const nextTarget = Math.max(0, item.quantity + delta);
      if (nextTarget === 0) {
        onRemoveFromCart(productId);
      } else {
        onUpdateCartQty(productId, nextTarget);
      }
    }
  };

  const attemptCheckoutFlow = () => {
    if (checkedItems.length === 0) {
      setErrorMessage('请至少勾选一个想要结算的大宗分销商品');
      return;
    }
    setErrorMessage(null);
    setCheckoutOpen(true);
    setPaymentDone(false);
  };

  const handleConfirmPayment = () => {
    if (sheetCalculations.finalAmount > userCreditLimit) {
      setErrorMessage(`支付失败：本次采购需要 ¥${sheetCalculations.finalAmount.toFixed(2)}，但您的授信可用额度为 ¥${userCreditLimit.toFixed(2)}，额度不足，请拨打常州厂财务部充值。`);
      return;
    }
    setErrorMessage(null);
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setPaymentDone(true);
      setTimeout(() => {
        const processedIds = checkedItems.map((item) => item.productId);
        onCheckout(processedIds);
        setCheckoutOpen(false);
        setPaymentDone(false);
        setShowCartSheet(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="bg-surface-bg min-h-screen text-text-primary pb-36">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-surface-lowest border-b border-surface-highest px-4 py-2.5">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WLogo className="w-6 h-6 text-brand-secondary" />
              <h1 className="font-sans text-xs font-extrabold text-brand-primary">
                常州唯一产品订货平台
              </h1>
            </div>
            <button
              onClick={() => setShowCartSheet(true)}
              className="relative p-2 rounded-full hover:bg-surface-low"
            >
              <ShoppingCart className="w-5 h-5 text-brand-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              className="w-full bg-surface-low border border-surface-highest rounded-lg pl-9 pr-8 py-2 font-sans text-xs outline-none focus:border-brand-primary transition-all"
              type="text"
              placeholder="搜索产品名称或商品编码(SKU)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="pt-28 px-4 max-w-lg mx-auto">
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-36 left-1/2 -translate-x-1/2 z-50 bg-brand-primary text-white text-xs px-4 py-2 rounded shadow-lg">
            {toastMsg}
          </div>
        )}

        {/* Filter Bar */}
        <section className="sticky top-28 bg-surface-bg/95 backdrop-blur-md z-30 py-2.5 -mx-4 px-4 border-b border-surface-highest/50">
          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={togglePriceSort}
              className={`flex items-center gap-1 py-1 px-2.5 rounded border transition-colors select-none ${
                priceSortOrder !== 'none'
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold'
                  : 'border-surface-highest text-text-muted bg-surface-lowest'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>价格{priceSortOrder === 'asc' ? ' ↑' : priceSortOrder === 'desc' ? ' ↓' : ''}</span>
            </button>

            <button
              onClick={toggleStockFilter}
              className={`flex items-center gap-1 py-1 px-2.5 rounded border transition-colors select-none ${
                stockOnlyFilter
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold'
                  : 'border-surface-highest text-text-muted bg-surface-lowest'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>仅看现货</span>
            </button>

            {(priceSortOrder !== 'none' || stockOnlyFilter || searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceSortOrder('none');
                  setStockOnlyFilter(false);
                }}
                className="ml-auto text-[10px] text-brand-secondary underline font-bold shrink-0"
              >
                重置筛选
              </button>
            )}
          </div>
        </section>

        {/* Product Grid */}
        <section className="mt-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {filteredProducts.map((product, index) => {
                const qty = qtys[product.id] || 0;
                const isRight = index % 2 === 1;
                return (
                  <div
                    key={product.id}
                    className={`bg-surface-lowest border border-surface-highest rounded-xl overflow-hidden flex flex-col hover:border-brand-primary transition-colors group cursor-pointer ${
                      isRight ? 'mt-6' : ''
                    }`}
                    onClick={() => onSelectProduct(product)}
                  >
                    <div className="aspect-[4/3] bg-surface-low overflow-hidden flex items-center justify-center p-3">
                      <img
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>

                    <div className="p-3 flex flex-col flex-1 gap-2">
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs font-bold text-brand-primary leading-snug line-clamp-2">
                          {product.name}
                        </p>
                        <p className="font-mono text-[9px] text-text-muted">SKU: {product.sku}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-mono text-xs font-bold text-brand-secondary">
                          ¥{product.price.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-text-muted font-mono">
                          MOQ {product.moq}箱
                        </span>
                      </div>

                      <div
                        className="flex items-center justify-between gap-1 pt-1 border-t border-surface-low"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {qty > 0 ? (
                          <>
                            <div className="flex items-center border border-surface-highest rounded overflow-hidden h-7 bg-surface-low">
                              <button
                                onClick={() => updateQty(product.id, -product.moq, product.moq)}
                                className="w-7 h-full flex items-center justify-center hover:bg-surface-highest text-brand-primary font-bold"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-mono text-xs font-bold text-brand-primary">
                                {qty}
                              </span>
                              <button
                                onClick={() => updateQty(product.id, product.moq, product.moq)}
                                className="w-7 h-full flex items-center justify-center hover:bg-surface-highest text-brand-primary font-bold"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => handleAddCart(product)}
                              className="h-7 bg-brand-secondary text-white text-[10px] font-bold px-2.5 rounded transition-colors shrink-0"
                            >
                              加购
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setQtys((prev) => ({ ...prev, [product.id]: product.moq }));
                              showToast(`最小起订量 ${product.moq} 箱`);
                            }}
                            className="w-full h-7 bg-brand-primary text-white text-[10px] font-bold rounded hover:bg-brand-secondary transition-colors"
                          >
                            配置订货量
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center space-y-2">
              <RefreshCw className="w-8 h-8 text-text-muted animate-spin mx-auto mb-2" />
              <p className="text-xs text-text-muted font-mono">未找到匹配筛选条件的产品</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceSortOrder('none');
                  setStockOnlyFilter(false);
                }}
                className="text-xs text-brand-secondary underline font-bold mt-2"
              >
                重置所有筛选器
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Cart Bottom Sheet */}
      {showCartSheet && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCartSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-surface-lowest rounded-t-2xl flex flex-col max-h-[70vh] shadow-xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-surface-highest rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-surface-highest">
              <h2 className="text-sm font-bold text-brand-primary">购物车清单</h2>
              <button onClick={() => setShowCartSheet(false)} className="p-1 rounded-full hover:bg-surface-low">
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mx-4 mt-2 bg-brand-error-container text-brand-error border border-brand-error/20 p-2.5 rounded-lg flex items-center gap-2 text-[10px] font-medium">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <p className="flex-grow">{errorMessage}</p>
                <button onClick={() => setErrorMessage(null)} className="font-bold underline shrink-0">忽略</button>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {cartItems.length > 0 ? (
                cartItems.map((item) => {
                  const p = cartProductMap.get(item.productId);
                  if (!p) return null;
                  return (
                    <div key={item.id} className="flex items-center gap-3 bg-surface-low rounded-lg p-2.5">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => onToggleCartCheck(item.productId)}
                        className="w-4 h-4 rounded border-surface-highest text-brand-primary focus:ring-brand-primary cursor-pointer shrink-0"
                      />
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-contain mix-blend-multiply bg-white rounded flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-brand-primary truncate">{p.name}</p>
                        <p className="text-[10px] text-text-muted font-mono">¥{p.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center border border-surface-highest rounded overflow-hidden h-7 shrink-0">
                        <button onClick={() => handleQtyStep(item.productId, -1)} className="w-7 h-full flex items-center justify-center hover:bg-surface-highest text-xs font-bold text-brand-primary">-</button>
                        <span className="w-8 text-center font-mono text-xs font-bold text-brand-primary">{item.quantity}</span>
                        <button onClick={() => handleQtyStep(item.productId, 1)} className="w-7 h-full flex items-center justify-center hover:bg-surface-highest text-xs font-bold text-brand-primary">+</button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center">
                  <ShoppingCart className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-xs text-text-muted">购物车空空如也</p>
                </div>
              )}
            </div>

            {/* Bottom Checkout Bar */}
            {cartItems.length > 0 && (
              <div className="border-t border-surface-highest px-4 py-3 flex items-center justify-between bg-surface-lowest rounded-b-2xl">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={(e) => onToggleAllCart(e.target.checked)}
                    className="w-4 h-4 rounded border-surface-highest text-brand-primary focus:ring-brand-primary cursor-pointer"
                  />
                  <span className="text-[11px] text-text-muted font-bold">全选</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[9px] text-text-muted leading-none">合计</p>
                    <p className="font-hanken text-sm font-extrabold text-brand-secondary leading-none">
                      ¥{sheetCalculations.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button
                    onClick={attemptCheckoutFlow}
                    className="bg-brand-secondary text-white text-xs font-bold px-5 py-2.5 rounded-lg active:scale-95 transition-all"
                  >
                    结算 ({checkedItems.length})
                  </button>
                </div>
              </div>
            )}

            {/* Checkout Modal */}
            {checkoutOpen && (
              <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-surface-lowest w-full max-w-sm rounded-xl p-5 border border-surface-highest space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b border-surface-low pb-2.5">
                    <h3 className="font-sans text-sm font-bold text-brand-primary">LuxeSpirit 极速大宗结算</h3>
                    <button onClick={() => setCheckoutOpen(false)} className="text-xs text-text-muted hover:text-brand-primary font-bold px-1">关闭</button>
                  </div>

                  {paymentDone ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mx-auto animate-pulse">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <h4 className="font-sans text-sm font-bold text-brand-primary">授信支付处理成功</h4>
                      <p className="text-xs text-text-muted font-mono leading-relaxed">
                        已扣除协议授信余额 ¥{sheetCalculations.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}，订单已进入常州4号保税仓待处理发货流水中。
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-brand-primary text-white p-4 rounded-lg flex flex-col justify-between h-24">
                        <div className="flex justify-between items-center opacity-85">
                          <span className="text-[10px] font-mono tracking-wider">MARCUS CHEN (LX-88204-BC)</span>
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] block text-white/70 font-mono">AVAILABLE REBATE CREDIT</span>
                          <span className="font-sans text-md font-extrabold tracking-tight">
                            ¥{userCreditLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <div className="bg-surface-low p-3 rounded border text-xs text-text-muted space-y-2">
                        <div className="flex justify-between">
                          <span>已选大宗件数</span>
                          <span className="text-brand-primary font-bold">{sheetCalculations.totalItemsCount} 箱</span>
                        </div>
                        <div className="flex justify-between">
                          <span>大宗小计金额</span>
                          <span className="text-brand-primary font-bold">¥{sheetCalculations.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between border-t border-surface-highest pt-1.5 text-brand-secondary">
                          <span>合同协议折扣 (5% OFF)</span>
                          <span>- ¥{sheetCalculations.wholesaleDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between border-t border-surface-highest pt-1.5 text-brand-primary font-bold">
                          <span className="font-sans">应付结算总额</span>
                          <span className="font-hanken text-brand-secondary">¥{sheetCalculations.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-text-muted leading-relaxed">* 确认即表示您代表企业授权以此账号下的授信额度支付本次合同。系统将自动生成保税提单。</p>

                      <button
                        onClick={handleConfirmPayment}
                        disabled={checkoutLoading}
                        className="w-full h-11 bg-brand-secondary text-white font-bold text-xs rounded-lg flex items-center justify-center hover:brightness-110 active:scale-95 transition-all"
                      >
                        {checkoutLoading ? '支付配额处理中...' : '确认，安全授信扣款'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-16 left-0 w-full z-40 px-3 pb-3 pointer-events-none">
          <div className="max-w-md mx-auto bg-brand-primary text-white shadow-xl rounded-xl p-3.5 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="relative bg-white/10 p-2.5 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-white/70 leading-none mb-1">大宗配属合并小计</p>
                <p className="font-hanken text-sm font-extrabold leading-none">
                  ¥{cartTotalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCartSheet(true)}
              className="bg-brand-secondary text-white font-sans text-xs font-bold px-6 py-2.5 rounded-lg active:scale-95 transition-all shadow-sm"
            >
              查看清单
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
