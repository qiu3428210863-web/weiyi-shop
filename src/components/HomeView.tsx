import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Volume2, Plus, Minus, ChevronRight, PlayCircle, QrCode } from 'lucide-react';
import { WLogo } from './WLogo';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (productId: string, quantity: number) => void;
  onNavigateToTab: (tabId: string, categoryId?: string) => void;
  cartCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onNavigateToTab,
  cartCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLeaderboardQtys, setActiveLeaderboardQtys] = useState<Record<string, number>>({
    'stout-beer-can-24': 0,
    'classic-light-aroma-baijiu': 0,
  });
  const [scannerOpen, setScannerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filter leaders
  const leaderboardItems = products.filter(
    (p) => p.id === 'stout-beer-can-24' || p.id === 'classic-light-aroma-baijiu'
  );

  // Frequently purchased items
  const freqItems = products.filter(
    (p) => p.id === 'changzhou-premium-baijiu' || p.id === 'cabernet-selection-red'
  );

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  const handleLeaderboardStepper = (productId: string, delta: number, minMoq: number) => {
    setActiveLeaderboardQtys((prev) => {
      const current = prev[productId] || 0;
      let next = current + delta;
      if (next < 0) next = 0;
      // If we increase from 0, snap directly to MOQ
      if (current === 0 && delta > 0) {
        next = minMoq;
        showToast(`已为您自适应重置至最小起订量 ${minMoq} 箱`);
      } else if (next > 0 && next < minMoq && delta < 0) {
        // Decreasing below moq resets to 0
        next = 0;
      }
      return { ...prev, [productId]: next };
    });
  };

  const handleAddLeaderboardToCart = (p: Product) => {
    const qty = activeLeaderboardQtys[p.id] || 0;
    if (qty < p.moq) {
      showToast(`注意：该商品的最小起订量为 ${p.moq} 箱`);
      // Snap to MOQ
      setActiveLeaderboardQtys((prev) => ({ ...prev, [p.id]: p.moq }));
      return;
    }
    onAddToCart(p.id, qty);
    showToast(`成功将 ${qty} 箱 ${p.name} 放入购物车`);
    // Reset stepper
    setActiveLeaderboardQtys((prev) => ({ ...prev, [p.id]: 0 }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToTab('category');
    // We could pass search state optionally but redirecting is fine for a prototype search bar
  };

  const handleScanMock = () => {
    setScannerOpen(true);
  };

  const handleConfirmScan = (productId: string) => {
    setScannerOpen(false);
    const targetProduct = products.find((p) => p.id === productId);
    if (targetProduct) {
      onSelectProduct(targetProduct);
    }
  };

  return (
    <div className="bg-surface-bg min-h-screen text-text-primary pb-32">
      {/* Search Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest">
        <div className="flex items-center gap-2">
          <WLogo className="w-6 h-6 text-brand-secondary" />
          <h1 className="font-sans text-xs font-extrabold text-brand-primary tracking-tight">
            常州唯一产品订货平台
          </h1>
        </div>
        <div className="relative">
          <button 
            onClick={() => onNavigateToTab('cart')}
            className="flex items-center justify-center p-2 rounded-full hover:bg-surface-low relative"
            title="购物车"
          >
            <div className="w-5 h-5 border border-brand-primary rounded flex items-center justify-center font-mono text-[9px] font-bold">
              C
            </div>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-16 px-4 max-w-lg mx-auto space-y-6">
        {/* Toast Notifier */}
        {toastMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-primary text-white text-xs px-4 py-3 rounded-md shadow-lg transition-all text-center">
            {toastMsg}
          </div>
        )}

        {/* Floating Scanner Simulation Modal */}
        {scannerOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-surface-lowest w-full max-w-sm rounded-xl p-6 text-center space-y-4 shadow-xl border border-surface-highest">
              <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary mx-auto">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="font-sans text-md font-bold text-brand-primary">扫描商品条形码</h3>
              <p className="text-xs text-text-muted">
                在仓库现场扫描条码可迅速核验保税库存、Moq 规格并支持极速下单。请选择一瓶商品扫码：
              </p>
              
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pt-2">
                <button 
                  onClick={() => handleConfirmScan('heritage-reserve-12y')}
                  className="w-full text-xs text-left p-3 rounded-lg border border-surface-highest hover:bg-surface-low transition-colors font-medium flex justify-between"
                >
                  <span>Heritage Reserve 12年威士忌</span>
                  <span className="font-mono text-[10px] text-text-muted">LS-8842-SPR</span>
                </button>
                <button 
                  onClick={() => handleConfirmScan('changzhou-premium-baijiu')}
                  className="w-full text-xs text-left p-3 rounded-lg border border-surface-highest hover:bg-surface-low transition-colors font-medium flex justify-between"
                >
                  <span>常州窖藏52度白酒</span>
                  <span className="font-mono text-[10px] text-text-muted">CZ-B-5201</span>
                </button>
              </div>
              
              <button 
                onClick={() => setScannerOpen(false)}
                className="w-full h-11 bg-brand-primary text-white font-bold text-xs rounded-lg mt-2"
              >
                取消扫码
              </button>
            </div>
          </div>
        )}

        {/* Integrated Search Input Container */}
        <section className="relative">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="flex-grow flex items-center bg-surface-low border border-surface-highest rounded-lg px-3.5 h-12">
              <Search className="w-5 h-5 text-text-muted mr-2" />
              <input 
                onClick={() => onNavigateToTab('category')}
                className="bg-transparent border-none outline-none w-full font-sans text-sm text-brand-primary placeholder-text-muted/65" 
                placeholder="搜索常州本土白酒、洋酒 SKU..." 
                type="text"
                readOnly
              />
            </div>
            <button 
              type="button"
              onClick={handleScanMock}
              className="px-4 bg-brand-primary text-white rounded-lg flex items-center gap-1.5 h-12 font-sans text-xs font-bold hover:bg-brand-primary/95 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>扫码</span>
            </button>
          </form>
        </section>

        {/* Horizontal Announcements Scrolling Cards */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-hanken text-xs font-bold text-text-muted uppercase tracking-wider">工厂公告与专题</h2>
            <span className="text-xs text-text-muted flex items-center hover:text-brand-secondary cursor-pointer">
              全部公告
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory -mx-4 px-4">
            {/* Banner 1 */}
            <div className="relative flex-shrink-0 w-[85%] aspect-[21/10] rounded-xl overflow-hidden bg-[#241318] shadow-sm snap-center">
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-75" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEpZoBAnVF8EmoVrSn5oplCy5ufTFM8qSCrA8wxkMs2lfQbG0zVfgyzKBjvPqdNq-eSXcpUN7w5zJJ7rz6KLlIjebb7gR0DqJ0WGod8PP2uHR9ZKYKpzH4p5bbs_xuisUQrEnJtGXjHbUEUP0AeWN6ezrJsRvCtUf-7lUxsD9Xk-0PTjDaHakA87eYuVql8gFIo8mcSMlXeoTxLIpfi0WbmybLQ3uCAobjvexLOy_9unZqQCzmfbX6b2hH8sjcguTImjZfdZOAmY9M" 
                alt="2024夏季窖藏"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-white/80 font-mono text-[9px] uppercase tracking-wider mb-1">大宗专题订货会</span>
                <p className="text-white font-sans text-sm font-bold leading-snug">
                  2024夏季常州窖深藏原酒系列 线上订购配额开放
                </p>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="relative flex-shrink-0 w-[85%] aspect-[21/10] rounded-xl overflow-hidden bg-[#131d24] shadow-sm snap-center">
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-75" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB37avxPcxQ7hQWeimBbHrAM9sOObZ14VLcdPxCxhlwtzDD2Kv_2vUZU2Fi581d23eVYw5Pzgs0jU_qZFArcWDKakSFd1yZKLkhgFeceBNJUKKaiVrD_SQIijDGVvPjGo0fBSfseS5ei4kDLh0Eo5BvNdi1YWSXeQ6DLqXv_tqcPtgOSXSqYXb0lV9zUmrioCUeWsPJs-N7JqrrSqSB224NbUJW39NpcSoFqw8k_vXtRt2CLncV086Yrb02l848vVH1P2EPRrr39Ipk" 
                alt="物流全面升级"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-white/80 font-mono text-[9px] uppercase tracking-wider mb-1">物流通告</span>
                <p className="text-white font-sans text-sm font-bold leading-snug">
                  华东地区物流保税港调拨中心 承兑发车流程全面升级
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Circle quick links category grid */}
        <section className="bg-surface-lowest rounded-xl p-4 border border-surface-highest grid grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigateToTab('category', 'baijiu')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-12 h-12 rounded-full bg-surface-low border border-surface-highest flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
              <span className="font-hanken text-[18px] font-bold">白</span>
            </div>
            <span className="text-xs text-text-primary font-medium">白酒专区</span>
          </button>
          
          <button 
            onClick={() => onNavigateToTab('category', 'wine')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-12 h-12 rounded-full bg-surface-low border border-surface-highest flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
              <span className="font-hanken text-[18px] font-bold">红</span>
            </div>
            <span className="text-xs text-text-primary font-medium">红洋酒区</span>
          </button>
          
          <button 
            onClick={() => onNavigateToTab('category', 'beer')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-12 h-12 rounded-full bg-surface-low border border-surface-highest flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
              <span className="font-hanken text-[18px] font-bold">啤</span>
            </div>
            <span className="text-xs text-text-primary font-medium">精酿啤酒</span>
          </button>
          
          <button 
            onClick={() => onNavigateToTab('category', 'accessories')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-12 h-12 rounded-full bg-surface-low border border-surface-highest flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
              <span className="font-hanken text-[18px] font-bold">配</span>
            </div>
            <span className="text-xs text-text-primary font-medium">酒具配件</span>
          </button>
        </section>

        {/* Favorite purchase list (Horizontal cards with instant add to cart) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-sm font-bold text-brand-primary">常用采购清单</h2>
            <span 
              onClick={() => onNavigateToTab('category')}
              className="text-xs text-brand-secondary font-bold flex items-center cursor-pointer hover:underline"
            >
              再次订购产品
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4">
            {freqItems.map((item) => (
              <div 
                key={item.id}
                className="flex-shrink-0 w-44 bg-surface-lowest border border-surface-highest p-3 rounded-lg flex flex-col gap-2 group hover:border-brand-primary transition-colors cursor-pointer"
                onClick={() => onSelectProduct(item)}
              >
                <div className="aspect-square bg-surface-low rounded overflow-hidden">
                  <img 
                    className="w-full h-full object-contain p-1 mix-blend-multiply group-hover:scale-105 transition-transform" 
                    src={item.image} 
                    alt={item.name} 
                  />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-brand-primary truncate">{item.name}</p>
                  <p className="font-mono text-[9px] text-text-muted">SKU: {item.sku}</p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="font-mono text-xs font-bold text-brand-primary">
                    ¥{item.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </span>
                  
                  {/* Quick Cart injection */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item.id, item.moq);
                      showToast(`已将起订量 ${item.moq} 箱 ${item.name} 加入购物车`);
                    }}
                    className="bg-brand-primary hover:bg-brand-secondary text-white w-7 h-7 rounded-full flex items-center justify-center transition-all shadow active:scale-90"
                    title="加购起订量"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Sales Rank (Vertical lists with step interactive adjustments) */}
        <section className="space-y-3 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-sm font-bold text-brand-primary">月度订货排行</h2>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span>按订货量排序</span>
            </div>
          </div>

          <div className="space-y-3">
            {leaderboardItems.map((item, idx) => {
              const currentQty = activeLeaderboardQtys[item.id] || 0;
              return (
                <div 
                  key={item.id}
                  className="flex gap-4 p-3 bg-surface-lowest border border-surface-highest rounded-lg relative overflow-hidden hover:border-brand-primary transition-colors group cursor-pointer"
                  onClick={() => onSelectProduct(item)}
                >
                  {/* Leader Tag badge */}
                  <div className="absolute top-0 left-0 bg-brand-primary text-white font-mono font-bold px-2 py-0.5 rounded-br-lg text-[9px]">
                    0{idx + 1}
                  </div>

                  <div className="w-16 h-16 flex-shrink-0 bg-surface-low rounded overflow-hidden">
                    <img 
                      className="w-full h-full object-contain p-1 mix-blend-multiply group-hover:scale-105 transition-transform" 
                      src={item.image} 
                      alt={item.name} 
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-brand-primary leading-snug line-clamp-1">{item.name}</p>
                      <p className="font-mono text-[9px] text-text-muted mt-0.5">月销量 5,000+ 箱</p>
                    </div>

                    <div className="flex items-end justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                      <span className="font-mono text-xs font-bold text-brand-secondary">
                        ¥{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      
                      {/* Integrated Stepper with instant Add action */}
                      <div className="flex items-center gap-2">
                        {currentQty > 0 ? (
                          <div className="flex items-center border border-surface-highest rounded overflow-hidden h-7 bg-surface-low">
                            <button 
                              onClick={() => handleLeaderboardStepper(item.id, -1 * item.moq, item.moq)}
                              className="w-7 h-full flex items-center justify-center hover:bg-surface-highest text-brand-primary font-bold transition-all"
                              title="减MOQ"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-mono text-xs font-bold text-brand-primary bg-transparent text-center bg-transparent">
                              {currentQty}
                            </span>
                            <button 
                              onClick={() => handleLeaderboardStepper(item.id, item.moq, item.moq)}
                              className="w-7 h-full flex items-center justify-center hover:bg-surface-highest text-brand-primary font-bold transition-all"
                              title="加MOQ"
                            >
                              +
                            </button>
                          </div>
                        ) : null}

                        {currentQty > 0 ? (
                          <button 
                            onClick={() => handleAddLeaderboardToCart(item)}
                            className="h-7 bg-brand-secondary text-white text-[10px] font-bold px-2.5 rounded transition-colors"
                          >
                            加购
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setActiveLeaderboardQtys((prev) => ({ ...prev, [item.id]: item.moq }));
                              showToast(`已开始配置货量。该商品支持最小起订：${item.moq} 箱`);
                            }}
                            className="h-7 bg-brand-primary text-white text-[10px] font-bold px-2.5 rounded hover:bg-brand-secondary transition-colors"
                          >
                            配置量
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
