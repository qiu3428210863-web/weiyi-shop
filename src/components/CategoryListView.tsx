import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Search, ChevronDown, RefreshCw, ShoppingCart, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CategoryListViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (productId: string, quantity: number) => void;
  onNavigateToTab: (tabId: string) => void;
  activePreSelectedCategory: string | null;
  onClearPreSelectedCategory: () => void;
  cartCount: number;
  cartTotalPrice: number;
}

export const CategoryListView: React.FC<CategoryListViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onNavigateToTab,
  activePreSelectedCategory,
  onClearPreSelectedCategory,
  cartCount,
  cartTotalPrice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(activePreSelectedCategory || 'all');
  const [priceSortOrder, setPriceSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [stockOnlyFilter, setStockOnlyFilter] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Synchronize category state when redirected from quick-link icons
  React.useEffect(() => {
    if (activePreSelectedCategory) {
      setActiveCategory(activePreSelectedCategory);
      onClearPreSelectedCategory();
    }
  }, [activePreSelectedCategory, onClearPreSelectedCategory]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
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
    showToast(!stockOnlyFilter ? '已过滤显示有现货的优势商品' : '已显示全部大宗目录');
  };

  // Memoized filtered product lists
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search term matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }

    // Category mapping
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Stock constraint
    if (stockOnlyFilter) {
      result = result.filter((p) => p.tags?.includes('现货') || p.tags?.includes('有库存'));
    }

    // Sort mappings
    if (priceSortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, activeCategory, stockOnlyFilter, priceSortOrder]);

  return (
    <div className="bg-surface-bg min-h-screen text-text-primary pb-36">
      {/* Search Sticky Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-surface-lowest border-b border-surface-highest px-4 py-2.5">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-brand-secondary rounded-full" />
            <h1 className="font-hanken text-md font-bold text-brand-primary">商品大宗目录</h1>
          </div>
          
          {/* Real-time search query inputs mapping */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              className="w-full bg-surface-low border border-surface-highest rounded-lg pl-9 pr-8 py-2 font-sans text-xs outline-none focus:border-brand-primary transition-all"
              type="text"
              placeholder="搜索产品名称、优势品类或商品编码(SKU)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-28 px-4 max-w-lg mx-auto">
        {/* Toast Notification Container */}
        {toastMsg && (
          <div className="fixed top-36 left-1/2 -translate-x-1/2 z-50 bg-brand-primary text-white text-xs px-4 py-2 rounded shadow-lg">
            {toastMsg}
          </div>
        )}

        {/* Filter Tab pills horizontal sliders */}
        <section className="sticky top-24 bg-surface-bg/95 backdrop-blur-md z-30 py-2.5 -mx-4 px-4 border-b border-surface-highest/50">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === 'all' 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-surface-lowest border border-surface-highest text-text-muted hover:bg-surface-low'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveCategory('baijiu')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === 'baijiu' 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-surface-lowest border border-surface-highest text-text-muted hover:bg-surface-low'
              }`}
            >
              白酒
            </button>
            <button
              onClick={() => setActiveCategory('wine')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === 'wine' 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-surface-lowest border border-surface-highest text-text-muted hover:bg-surface-low'
              }`}
            >
              红洋酒
            </button>
            <button
              onClick={() => setActiveCategory('beer')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === 'beer' 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-surface-lowest border border-surface-highest text-text-muted hover:bg-surface-low'
              }`}
            >
              精酿啤酒
            </button>
            <button
              onClick={() => setActiveCategory('accessories')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === 'accessories' 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-surface-lowest border border-surface-highest text-text-muted hover:bg-surface-low'
              }`}
            >
              酒具配件
            </button>
          </div>

          {/* Sub parameters filter bars */}
          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-surface-highest/40 text-[11px]">
            <button 
              onClick={togglePriceSort}
              className={`flex items-center gap-1 py-1 px-2.5 rounded border transition-colors select-none ${
                priceSortOrder !== 'none'
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold'
                  : 'border-surface-highest text-text-muted bg-surface-lowest'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>价格排序{priceSortOrder === 'asc' ? ' (低到高)' : priceSortOrder === 'desc' ? ' (高到低)' : ''}</span>
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
              <span>仅看现货货源</span>
            </button>
          </div>
        </section>

        {/* Product Cards Lists in 1-column layouts to preserve mobile visual priority */}
        <section className="mt-4 space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => {
              const hasInStock = p.tags?.includes('现货') || p.tags?.includes('有库存');
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="bg-surface-lowest border border-surface-highest rounded-xl overflow-hidden flex flex-col hover:border-brand-primary transition-colors group cursor-pointer"
                >
                  {/* Photo Section */}
                  <div className="aspect-[16/10] bg-white relative overflow-hidden flex items-center justify-center p-2">
                    <img
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      src={p.image}
                      alt={p.name}
                    />
                    <div className="absolute top-3 left-3 flex gap-1">
                      {p.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wider ${
                            hasInStock
                              ? 'bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/25'
                              : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info Details Section */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-hanken text-sm font-bold text-brand-primary leading-tight line-clamp-1">
                        {p.name}
                      </h3>
                      <span className="font-mono text-[10px] text-text-muted flex-shrink-0">
                        {p.sku}
                      </span>
                    </div>
                    
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-1">
                      {p.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-surface-low flex justify-between items-end">
                      <div>
                        <div className="text-[10px] text-text-muted">
                          极速起订量：{p.moq} 箱起订 ({p.moq * p.quantityPerBox}瓶)
                        </div>
                        <div className="font-hanken text-brand-primary text-sm font-bold mt-0.5">
                          ¥{p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                          <span className="text-[10px] text-text-muted font-normal">/箱</span>
                        </div>
                      </div>

                      {/* Stepper click directly adds MOQ into carts */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(p.id, p.moq);
                          showToast(`已加购起订量 ${p.moq} 箱 ${p.name}`);
                        }}
                        className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-secondary active:scale-95 transition-all shadow-md shadow-brand-primary/10"
                        title="加购起订量"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center space-y-2">
              <RefreshCw className="w-8 h-8 text-text-muted animate-spin mx-auto mb-2" />
              <p className="text-xs text-text-muted font-mono">未找到匹配筛选条件的 B2B 大宗单品</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
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

      {/* Floating Bottom Cart Contextual Banner */}
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
              onClick={() => onNavigateToTab('cart')}
              className="bg-brand-secondary text-white font-sans text-xs font-bold px-6 py-2.5 rounded-lg active:scale-95 transition-all shadow-sm shadow-brand-secondary/40"
            >
              去结算
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
