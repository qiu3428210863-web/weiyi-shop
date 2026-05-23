import React, { useState } from 'react';
import { Order, Product } from '../types';
import { ShoppingCart, ClipboardCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { WLogo } from './WLogo';

interface OrdersViewProps {
  orders: Order[];
  products: Product[];
  onBuyAgain: (orderId: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

type OrderStatusTabType = 'all' | 'pending' | 'shipping' | 'completed';

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  products,
  onBuyAgain,
  onNavigateToTab,
}) => {
  const [activeTab, setActiveTab] = useState<OrderStatusTabType>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const productMap = React.useMemo(() => {
    return new Map<string, Product>(products.map((p) => [p.id, p]));
  }, [products]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  const filteredOrders = React.useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const handleBuyAgainClick = (orderId: string) => {
    onBuyAgain(orderId);
    showToast('已将该订单内的所有大宗物资复制并配置入购物车');
    setTimeout(() => {
      onNavigateToTab('cart');
    }, 800);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-0.5 bg-brand-secondary/15 text-brand-secondary text-[10px] font-bold rounded tracking-wide">
            待处理
          </span>
        );
      case 'shipping':
        return (
          <span className="px-2 py-0.5 bg-surface-container text-text-muted text-[10px] font-bold rounded tracking-wide">
            发货中
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 bg-surface-low border border-surface-highest text-text-primary text-[10px] font-bold rounded tracking-wide">
            已完成
          </span>
        );
    }
  };

  return (
    <div className="bg-surface-bg min-h-screen text-text-primary pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest">
        <div className="flex items-center gap-2">
          <WLogo className="w-6 h-6 text-brand-secondary" />
          <h1 className="font-sans text-xs font-bold text-brand-primary">常州唯一产品订货平台</h1>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-18 px-4 max-w-lg mx-auto">
        {/* Toast Notification Container */}
        {toastMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-primary text-white text-xs px-4 py-2.5 rounded shadow-lg">
            {toastMsg}
          </div>
        )}

        <div className="mb-4 pt-1">
          <h1 className="font-hanken text-lg font-bold text-brand-primary">订单中心</h1>
        </div>

        {/* Filter Navigation Tabs */}
        <section className="flex gap-2.5 overflow-x-auto pb-2 border-b border-surface-high sticky top-14 bg-surface-bg/95 backdrop-blur-md z-30 pt-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap px-4 py-2 text-xs font-sans font-bold border-b-2 transition-all ${
              activeTab === 'all' 
                ? 'text-brand-primary border-brand-primary' 
                : 'text-text-muted border-transparent'
            }`}
          >
            全部
          </button>
          
          <button
            onClick={() => setActiveTab('pending')}
            className={`whitespace-nowrap px-4 py-2 text-xs font-sans font-bold border-b-2 transition-all ${
              activeTab === 'pending' 
                ? 'text-brand-primary border-brand-primary' 
                : 'text-text-muted border-transparent'
            }`}
          >
            待处理
          </button>
          
          <button
            onClick={() => setActiveTab('shipping')}
            className={`whitespace-nowrap px-4 py-2 text-xs font-sans font-bold border-b-2 transition-all ${
              activeTab === 'shipping' 
                ? 'text-brand-primary border-brand-primary' 
                : 'text-text-muted border-transparent'
            }`}
          >
            发货中
          </button>
          
          <button
            onClick={() => setActiveTab('completed')}
            className={`whitespace-nowrap px-4 py-2 text-xs font-sans font-bold border-b-2 transition-all ${
              activeTab === 'completed' 
                ? 'text-brand-primary border-brand-primary' 
                : 'text-text-muted border-transparent'
            }`}
          >
            已完成
          </button>
        </section>

        {/* Order Card Lists mapped straight from structural state */}
        <section className="mt-4 flex flex-col gap-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((ord) => {
              // Calculate total item boxes
              const totalBoxesOrdered = ord.items.reduce((accum, item) => accum + item.quantity, 0);
              
              return (
                <div 
                  key={ord.id}
                  className="bg-surface-lowest border border-surface-highest rounded-xl overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.03)] hover:border-brand-primary/80 transition-all p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                        订单编号 {ord.code}
                      </span>
                      <span className="text-[10px] text-text-muted/80 mt-0.5">
                        {ord.date}
                      </span>
                    </div>
                    {getStatusBadge(ord.status)}
                  </div>

                  {/* Horizontal Lists of thumbnails purchased in this order sheet */}
                  <div className="flex gap-2.5 mb-4 overflow-x-auto py-1 hide-scrollbar">
                    {ord.items.map((item, idx) => {
                      const p = productMap.get(item.productId);
                      if (!p) return null;
                      return (
                        <div 
                          key={idx}
                          className="w-14 h-14 rounded-lg bg-surface-low border border-surface-highest flex items-center justify-center p-1 relative flex-shrink-0"
                          title={`${p.name} (${item.quantity}箱)`}
                        >
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-full h-full object-contain mix-blend-multiply" 
                          />
                          <span className="absolute bottom-0 right-0 bg-brand-primary/80 text-white font-mono text-[8px] font-bold px-1 rounded-tl">
                            x{item.quantity}
                          </span>
                        </div>
                      );
                    })}

                    {/* Extras thumbnail indicator matching layout exactly */}
                    {ord.items.length > 2 && (
                      <div className="w-14 h-14 flex items-center justify-center bg-surface-low rounded-lg border border-surface-highest font-mono text-xs font-bold text-text-muted select-none">
                        +{ord.items.length - 2}
                      </div>
                    )}
                  </div>

                  {/* Bottom details with responsive Buy Again callback triggers */}
                  <div className="flex justify-between items-center pt-3.5 border-t border-surface-low">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted">{totalBoxesOrdered} 件商品合同总计</span>
                      <span className="font-mono text-sm font-bold text-brand-primary">
                        ¥{ord.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleBuyAgainClick(ord.id)}
                      className="px-4 py-1.5 border border-brand-secondary text-brand-secondary font-sans text-xs font-bold rounded-lg hover:bg-brand-secondary/5 transition-colors flex items-center gap-1 active:scale-[0.98]"
                    >
                      <span>再次购买</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center space-y-2">
              <ClipboardCheck className="w-8 h-8 text-text-muted mx-auto" />
              <p className="text-xs text-text-muted font-mono">您的 {activeTab !== 'all' ? `"${activeTab}"` : ''} 专属保税单历史为空</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
