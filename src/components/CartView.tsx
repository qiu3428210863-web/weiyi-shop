import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { ShoppingCart, AlertTriangle, ShieldCheck, CheckCircle, Wallet } from 'lucide-react';

interface CartViewProps {
  cartItems: CartItem[];
  products: Product[];
  onUpdateCartQty: (productId: string, qty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onToggleCartCheck: (productId: string) => void;
  onToggleAllCart: (checked: boolean) => void;
  onCheckout: (checkedItemIds: string[]) => void;
  userCreditLimit: number;
  onNavigateToTab: (tabId: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  products,
  onUpdateCartQty,
  onRemoveFromCart,
  onToggleCartCheck,
  onToggleAllCart,
  onCheckout,
  userCreditLimit,
  onNavigateToTab,
}) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper mapping values
  const productMap = React.useMemo(() => {
    return new Map<string, Product>(products.map((p) => [p.id, p]));
  }, [products]);

  // All selected cart items
  const checkedItems = React.useMemo(() => {
    return cartItems.filter((item) => item.checked);
  }, [cartItems]);

  const isAllChecked = React.useMemo(() => {
    return cartItems.length > 0 && cartItems.every((item) => item.checked);
  }, [cartItems]);

  // Validate MOQs on each item to show warning headers
  const moqValidityMap = React.useMemo(() => {
    const map: Record<string, { isValid: boolean; required: number; diff: number }> = {};
    cartItems.forEach((item) => {
      const p = productMap.get(item.productId);
      if (p) {
        const isValid = item.quantity >= p.moq;
        map[item.productId] = {
          isValid,
          required: p.moq,
          diff: p.moq - item.quantity,
        };
      }
    });
    return map;
  }, [cartItems, productMap]);

  // Checkout has error if any of SELECTED item quantities is below Moq!
  const hasSelectedMoqViolation = React.useMemo(() => {
    return checkedItems.some((item) => {
      const validity = moqValidityMap[item.productId];
      return validity ? !validity.isValid : false;
    });
  }, [checkedItems, moqValidityMap]);

  // Calculations
  const calculations = React.useMemo(() => {
    let subtotal = 0;
    let totalItemsCount = 0;

    checkedItems.forEach((item) => {
      const p = productMap.get(item.productId);
      if (p) {
        subtotal += p.price * item.quantity;
        totalItemsCount += item.quantity;
      }
    });

    const wholesaleDiscount = subtotal * 0.05; // 5% bulk wholesale generic rate off
    const finalAmount = subtotal - wholesaleDiscount;

    return {
      subtotal,
      totalItemsCount,
      wholesaleDiscount,
      finalAmount,
    };
  }, [checkedItems, productMap]);

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
    if (hasSelectedMoqViolation) {
      setErrorMessage('已选商品中存在起订量不足的红框警告项，请补充箱数以符保大宗协议价。');
      return;
    }
    setErrorMessage(null);
    setCheckoutOpen(true);
    setPaymentDone(false);
  };

  const handleConfirmPayment = () => {
    if (calculations.finalAmount > userCreditLimit) {
      setErrorMessage(`支付失败：本次采购需要 ¥${calculations.finalAmount.toFixed(2)}，但您的授信可用额度为 ¥${userCreditLimit.toFixed(2)}，额度不足，请拨打常州厂财务部充值。`);
      return;
    }
    setErrorMessage(null);
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setPaymentDone(true);
      setTimeout(() => {
        // Complete checkout hooks back to main App container
        const processedIds = checkedItems.map((item) => item.productId);
        onCheckout(processedIds);
        setCheckoutOpen(false);
        setPaymentDone(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="bg-surface-bg min-h-screen text-text-primary pb-36">
      {/* Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-5 h-5 text-brand-secondary" />
          <h1 className="font-hanken text-md font-bold text-brand-primary">购物车</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-text-muted bg-surface-low border px-2 py-0.5 rounded font-mono">
            客户额度：¥{userCreditLimit.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-18 px-4 max-w-lg mx-auto space-y-4">
        {/* Error notification banner above container */}
        {errorMessage && (
          <div className="bg-brand-error-container text-brand-error border border-brand-error/20 p-3 rounded-lg flex items-center gap-2 text-xs font-medium font-sans">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <p className="flex-grow">{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="font-bold underline text-[10px] ml-1">
              忽略
            </button>
          </div>
        )}

        {/* Checkout Simulation Payment Modal Dialog */}
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-surface-lowest w-full max-w-sm rounded-xl p-5 border border-surface-highest space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-surface-low pb-2.5">
                <h3 className="font-sans text-sm font-bold text-brand-primary">LuxeSpirit 极速大宗结算</h3>
                <button 
                  onClick={() => setCheckoutOpen(false)} 
                  className="text-xs text-text-muted hover:text-brand-primary font-bold px-1"
                >
                  关闭
                </button>
              </div>

              {paymentDone ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mx-auto animate-pulse">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h4 className="font-sans text-sm font-bold text-brand-primary">授信支付处理成功</h4>
                  <p className="text-xs text-text-muted font-mono leading-relaxed">
                    已扣除协议授信余额 ¥{calculations.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}，订单已进入常州4号仓库待处理发货流水中。
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

                  {/* Summary lists */}
                  <div className="bg-surface-low p-3 rounded border text-xs text-text-muted space-y-2">
                    <div className="flex justify-between">
                      <span>已选大宗件数</span>
                      <span className="text-brand-primary font-bold">{calculations.totalItemsCount} 箱</span>
                    </div>
                    <div className="flex justify-between">
                      <span>大宗小计金额</span>
                      <span className="text-brand-primary font-bold">
                        ¥{calculations.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-surface-highest pt-1.5 text-brand-secondary">
                      <span>合同协议折扣 (5% OFF)</span>
                      <span>- ¥{calculations.wholesaleDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between border-t border-surface-highest pt-1.5 text-brand-primary font-bold">
                      <span className="font-sans">应付结算总额</span>
                      <span className="font-hanken text- brand-secondary">
                        ¥{calculations.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-text-muted leading-relaxed">
                    * 确认即表示您代表企业授权以此账号下的授信额度支付本次合同。系统将自动生成提货单。
                  </p>

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

        {/* Cart Item Cards list container */}
        <section className="space-y-3">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const p = productMap.get(item.productId);
              if (!p) return null;

              const validity = moqValidityMap[item.productId];
              const tooLow = validity ? !validity.isValid : false;

              return (
                <div 
                  key={item.id}
                  className={`border rounded-lg p-4 flex flex-col gap-3 transition-all ${
                    tooLow 
                      ? 'bg-brand-error-container/20 border-brand-error/30' 
                      : 'bg-surface-lowest border-surface-highest'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Checkbox */}
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => onToggleCartCheck(item.productId)}
                        className="w-4 h-4 rounded border-surface-highest text-brand-primary focus:ring-brand-primary cursor-pointer"
                      />
                    </div>

                    {/* Image */}
                    <div className="w-16 h-16 bg-surface-low rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className={`w-full h-full object-contain bg-white ${tooLow ? 'grayscale opacity-75' : ''}`}
                      />
                    </div>

                    {/* Metadata summary */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-brand-primary line-clamp-1 leading-snug">{p.name}</h3>
                        <p className="font-mono text-[9px] text-text-muted">SKU: {p.sku}</p>
                      </div>

                      <div className="flex justify-between items-end pt-1">
                        <span className="font-mono text-xs font-bold text-brand-primary">
                          ¥{p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        
                        {/* Incrementor/Decrementor Stepper controls */}
                        <div className="flex items-center border border-surface-highest rounded overflow-hidden h-7">
                          <button 
                            onClick={() => handleQtyStep(item.productId, -1)}
                            className="w-7 h-full flex items-center justify-center bg-surface-lowest hover:bg-surface-low text-text-primary text-xs font-bold"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={0}
                            className="w-8 h-full text-center font-mono text-xs font-bold leading-none border-none p-0 outline-none focus:ring-0 bg-transparent"
                            value={item.quantity}
                            onChange={(e) => {
                              const raw = parseInt(e.target.value);
                              const val = isNaN(raw) || raw < 0 ? 0 : raw;
                              onUpdateCartQty(item.productId, val);
                            }}
                          />
                          <button 
                            onClick={() => handleQtyStep(item.productId, 1)}
                            className="w-7 h-full flex items-center justify-center bg-surface-lowest hover:bg-surface-low text-text-primary text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning MOQ banner matching Second template screenshot exactly */}
                  {tooLow && validity && (
                    <div className="bg-brand-error-container text-brand-error px-3 py-1.5 rounded flex items-center gap-1.5 text-[10px] select-none">
                      <AlertTriangle className="w-3.5 h-3.5 text-brand-error" />
                      <span className="font-sans leading-none">
                        起订量不足: 需满 {validity.required} 箱 (差 {validity.diff} 箱)
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-24 text-center space-y-3">
              <ShoppingCart className="w-10 h-10 text-text-muted mx-auto" />
              <p className="text-xs text-text-muted font-sans">企业分销购物车空空如也，请前往目录配属</p>
              <button 
                onClick={() => onNavigateToTab('category')}
                className="bg-brand-primary text-white text-xs font-bold px-5 py-2 rounded"
              >
                浏览商品大宗目录
              </button>
            </div>
          )}
        </section>

        {/* Pricing Summary calculations Card */}
        {cartItems.length > 0 && (
          <section className="bg-surface-low p-4 rounded-lg space-y-2.5 border border-surface-highest">
            <div className="flex justify-between items-center text-xs text-text-muted">
              <span>商品小计 ({calculations.totalItemsCount} 箱)</span>
              <span className="font-mono font-medium">
                ¥{calculations.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs text-text-muted">
              <span>大宗采购协议折扣</span>
              <span className="font-mono text-brand-secondary font-bold">
                - ¥{calculations.wholesaleDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="pt-2 border-t border-surface-highest flex justify-between items-center text-brand-primary">
              <span className="font-sans text-xs font-bold">应付金额 (批价折让后)</span>
              <span className="font-hanken text-sm font-extrabold text-brand-secondary">
                ¥{calculations.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </section>
        )}
      </main>

      {/* Sticky Bottom Settlement Footer checkout control bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-14 left-0 w-full z-40 bg-surface-lowest shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] border-t border-surface-highest px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input 
              id="select-all"
              type="checkbox"
              checked={isAllChecked}
              onChange={(e) => onToggleAllCart(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-surface-highest text-brand-primary focus:ring-brand-primary cursor-pointer"
            />
            <label htmlFor="select-all" className="text-xs text-text-muted font-bold font-mono tracking-wider cursor-pointer">
              全选
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px] text-text-muted leading-none uppercase tracking-widest mb-0.5">合计金额</p>
              <p className="font-hanken text-brand-secondary text-sm font-extrabold leading-none">
                ¥{calculations.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <button
              onClick={attemptCheckoutFlow}
              className={`px-6 h-11 rounded-lg text-white font-sans text-xs font-bold active:opacity-90 transition-all shadow-sm flex items-center justify-center ${
                hasSelectedMoqViolation 
                  ? 'bg-text-muted hover:brightness-95 cursor-not-allowed opacity-60' 
                  : 'bg-brand-secondary hover:brightness-110 shadow-brand-secondary/20'
              }`}
            >
              结算 ({checkedItems.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
