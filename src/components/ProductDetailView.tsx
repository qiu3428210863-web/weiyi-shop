import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { ArrowLeft, Share2, Bell, ShieldCheck, HelpCircle, ShoppingCart } from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (productId: string, quantity: number) => void;
  onBuyNow: (productId: string, quantity: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(product.moq);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  const incrementQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQty = () => {
    setQuantity((prev) => {
      if (prev <= product.moq) {
        showToast(`注意：该商品的最小起订量为 ${product.moq} 箱`);
        return product.moq;
      }
      return prev - 1;
    });
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    if (val < product.moq) {
      showToast(`注意：采购量已重置为最小起订量 ${product.moq} 箱`);
      setQuantity(product.moq);
    } else {
      setQuantity(val);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
    showToast(`已成功加入 ${quantity} 箱 ${product.name} 到购物车`);
  };

  const handleBuyNow = () => {
    onBuyNow(product.id, quantity);
  };

  const handleShare = () => {
    showToast('链接已复制到剪贴板，可在大分销群内分享！');
  };

  const handleAlert = () => {
    showToast('该产品的大宗降价通知已开启订阅');
  };

  return (
    <div className="bg-surface-bg min-h-screen text-text-primary pb-32">
      {/* Top Banner Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 hover:bg-surface-low rounded-full transition-colors"
          title="返回"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-sans text-md font-bold">商品详情</h1>
        <div className="flex gap-1">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center w-10 h-10 hover:bg-surface-low rounded-full transition-colors"
            title="分享"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleAlert}
            className="flex items-center justify-center w-10 h-10 hover:bg-surface-low rounded-full transition-colors"
            title="通知"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-14 max-w-lg mx-auto">
        {/* Toast Notifier */}
        {toastMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-primary text-white text-xs px-4 py-3 rounded-md shadow-lg font-sans text-center transition-all animate-bounce">
            {toastMsg}
          </div>
        )}

        {/* Gallery Section */}
        <section className="relative bg-surface-lowest overflow-hidden border-b border-surface-highest">
          <div className="flex relative aspect-square overflow-hidden bg-[#fafafa]">
            <img 
              className="w-full h-full object-contain transition-all duration-300" 
              src={product.galleryImages[activeImageIdx] || product.image} 
              alt={product.name}
            />
            
            {/* Gallery Image Selector Controls */}
            {product.galleryImages.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
                {product.galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImageIdx === idx ? 'bg-brand-primary w-4' : 'bg-surface-highest'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="absolute bottom-4 right-4 bg-black/85 text-white text-xs px-2.5 py-0.5 rounded-full font-mono">
            {activeImageIdx + 1} / {product.galleryImages.length || 1}
          </div>
        </section>

        {/* Product Identity */}
        <section className="p-4 bg-surface-lowest">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="bg-surface-container text-text-muted px-2.5 py-0.5 rounded text-xs font-mono">
                SKU: {product.sku}
              </span>
              <span className="text-brand-secondary font-bold text-xs flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 fill-brand-secondary text-white" />
                现货
              </span>
            </div>
            
            <h2 className="font-hanken text-lg font-bold text-brand-primary leading-snug mt-1">
              {product.name}
            </h2>

            <div className="mt-2 pt-2 border-t border-surface-low flex items-baseline gap-2">
              <span className="font-hanken text-brand-secondary text-2xl font-extrabold">
                ¥{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              {product.originalPrice && (
                <span className="text-text-muted text-xs line-through">
                  ¥{product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              )}
              <span className="text-brand-secondary font-bold text-xs ml-auto bg-brand-secondary/10 px-2 py-0.5 rounded leading-none">
                协议折扣价
              </span>
            </div>
          </div>
        </section>

        {/* Wholesale specs cards */}
        <section className="mt-2 p-4 bg-surface-lowest border-y border-surface-highest">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col p-3 bg-surface-low rounded border border-surface-highest">
              <span className="font-mono text-[10px] text-text-muted uppercase mb-1">最小起订量</span>
              <span className="font-hanken text-md font-bold text-brand-primary">{product.moq} 箱</span>
              <span className="text-xs text-text-muted">({product.moq * product.quantityPerBox} 瓶)</span>
            </div>
            
            <div className="flex flex-col p-3 bg-surface-low rounded border border-surface-highest justify-between">
              <div>
                <span className="font-mono text-[10px] text-text-muted uppercase mb-1">可用库存</span>
                <span className="font-hanken text-md font-bold text-brand-primary flex items-baseline gap-1">
                  {product.stock} 件
                </span>
              </div>
              <div className="w-full bg-surface-highest h-1 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-brand-secondary h-full rounded-full transition-all" 
                  style={{ width: `${Math.min(100, (product.stock / 2500) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs Accordion Grid */}
        <section className="mt-2 p-4 bg-surface-lowest">
          <h3 className="font-mono text-xs text-text-muted mb-4 uppercase flex items-center gap-1.5 tracking-wider font-semibold">
            <span className="w-1.5 h-3 bg-brand-primary rounded" />
            技术参数
          </h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-surface-container pt-4">
            <div>
              <p className="text-xs text-text-muted">酒精度</p>
              <p className="text-sm font-bold text-brand-primary">{product.abv || '52% vol'}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">原产地</p>
              <p className="text-sm font-bold text-brand-primary">{product.origin || '四川, 中国'}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">橡木桶 / 容器</p>
              <p className="text-sm font-bold text-brand-primary">{product.barrelType || '陶坛'}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">包装整装重量</p>
              <p className="text-sm font-bold text-brand-primary">{product.boxWeight || '12.0 kg'}</p>
            </div>
          </div>
        </section>

        {/* Detailed Description with lists */}
        <section className="mt-2 p-4 bg-surface-lowest mb-12">
          <h3 className="font-mono text-xs text-text-muted mb-3 uppercase tracking-wider font-semibold">产品概览</h3>
          <div className="text-sm text-text-muted leading-relaxed space-y-4">
            <p>{product.description}</p>
            
            {product.overviewNotes && (
              <div className="bg-surface-low p-4 rounded-lg border-l-4 border-brand-primary italic text-xs text-text-primary leading-normal">
                {product.overviewNotes}
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <ul className="list-disc pl-5 space-y-2 text-xs">
                {product.specs.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Order Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-surface-lowest border-t border-surface-highest shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] px-3 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          {/* Stepper qty */}
          <div className="flex items-center border border-brand-primary h-11 rounded overflow-hidden flex-shrink-0">
            <button 
              onClick={decrementQty}
              className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-surface-low transition-colors font-bold text-md"
              title="减少"
            >
              -
            </button>
            <input 
              className="w-10 sm:w-12 text-center font-bold text-xs sm:text-sm bg-transparent border-none outline-none focus:ring-0 p-0" 
              type="number" 
              value={quantity}
              onChange={handleQtyChange}
            />
            <button 
              onClick={incrementQty}
              className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-surface-low transition-colors font-bold text-md"
              title="增加"
            >
              +
            </button>
          </div>
          
          {/* Actions */}
          <button 
            onClick={handleAddToCart}
            className="flex-1 h-11 border border-brand-primary text-brand-primary font-bold text-xs sm:text-sm rounded hover:bg-surface-low active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap px-1.5 sm:px-3"
          >
            <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
            <span>加入购物车</span>
          </button>
          
          <button 
            onClick={handleBuyNow}
            className="flex-1 h-11 bg-brand-secondary text-white font-bold text-xs sm:text-sm rounded hover:brightness-110 active:scale-[0.98] transition-all whitespace-nowrap px-1.5 sm:px-3"
          >
            立即购买
          </button>
        </div>
      </footer>
    </div>
  );
};
