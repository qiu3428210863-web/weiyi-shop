import { useState, useMemo } from 'react';
import { Product, CartItem, Order, ShippingAddress, SupportMessage } from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_ADDRESSES, 
  MOCK_CHATS_WELCOME 
} from './data';
import { HomeView } from './components/HomeView';
import { CategoryListView } from './components/CategoryListView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { OrdersView } from './components/OrdersView';
import { ProfileView } from './components/ProfileView';
import { SplashView } from './components/SplashView';
import { LoginView } from './components/LoginView';
import { SupplierView } from './components/SupplierView';

// Standard Lucide icons imports
import { Home, Grid, ShoppingCart, ClipboardCheck, User as UserIcon } from 'lucide-react';

export default function App() {
  // B2B Dynamic Portals & Authentication States
  const [appState, setAppState] = useState<'splash' | 'login' | 'authenticated'>('splash');
  const [userRole, setUserRole] = useState<'wholesaler' | 'sales' | 'warehouse' | 'admin'>('wholesaler');
  const [loggedInName, setLoggedInName] = useState<string>('');

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>('home');
  const [preSelectedCategory, setPreSelectedCategory] = useState<string | null>(null);
  
  // Single detail screen focus
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Global Core React State (Synchronized automatically across wholesaler & supplier screens)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [addresses, setAddresses] = useState<ShippingAddress[]>(INITIAL_ADDRESSES);
  const [supportChats, setSupportChats] = useState<SupportMessage[]>(MOCK_CHATS_WELCOME);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [userCreditLimit, setUserCreditLimit] = useState<number>(45280.00);

  // Initialize Shopping Cart exactly matching layout 2 of the design templates:
  // - Highland Reserve 12Y -> qty 12 (Moq 12 met)
  // - Botanist Dry Gin Bulk -> qty 2 (Moq 6 NOT met, triggers warning)
  // - Imperial Crystal Vodka -> qty 24 (Moq 24 met)
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'cart-1', productId: 'highland-reserve-12y', quantity: 12, checked: true },
    { id: 'cart-2', productId: 'botanist-dry-gin', quantity: 2, checked: false },
    { id: 'cart-3', productId: 'imperial-crystal-vodka', quantity: 24, checked: true }
  ]);

  // Product helper mapping
  const productMap = useMemo(() => {
    return new Map<string, Product>(products.map((p) => [p.id, p]));
  }, [products]);

  // Cart total items computation
  const cartStatistics = useMemo(() => {
    let totalCheckedBoxes = 0;
    let totalPrice = 0;
    let checkedItemsCount = 0;

    cart.forEach((item) => {
      if (item.checked) {
        const p = productMap.get(item.productId);
        if (p) {
          totalCheckedBoxes += item.quantity;
          totalPrice += p.price * item.quantity;
          checkedItemsCount += 1;
        }
      }
    });

    // Subtotal subtraction with 5% wholesale bulk volume discounts
    const wholesaleDiscount = totalPrice * 0.05;
    const finalCalculatedPrice = totalPrice - wholesaleDiscount;

    return {
      totalCheckedBoxes,
      totalPrice: finalCalculatedPrice,
      checkedItemsCount,
      totalUncheckedItemsCount: cart.length // for notifications badges
    };
  }, [cart, productMap]);

  // Handler functions
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: `cart-${Date.now()}`,
            productId,
            quantity,
            checked: true,
          },
        ];
      }
    });
  };

  const handleBuyNow = (productId: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      // Ensure current is checked and updated
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity, checked: true }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: `cart-${Date.now()}`,
            productId,
            quantity,
            checked: true,
          },
        ];
      }
    });
    // Deselect selected detail focus
    setSelectedProduct(null);
    // Route to Shopping Cart page
    setActiveTab('cart');
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleToggleCartCheck = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleToggleAllCart = (checked: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, checked })));
  };

  const handleCheckout = (checkedItemIds: string[]) => {
    // Collect purchased items specifics
    const itemsToPay = cart.filter((item) => checkedItemIds.includes(item.productId) && item.checked);
    if (itemsToPay.length === 0) return;

    let orderPrice = 0;
    const checkoutItemsPayload = itemsToPay.map((item) => {
      const p = productMap.get(item.productId)!;
      orderPrice += p.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: p.price,
      };
    });

    const wholesaleDiscount = orderPrice * 0.05;
    const finalPrice = orderPrice - wholesaleDiscount;

    // Deduct user's corporate credit limits state
    setUserCreditLimit((prev) => Math.max(0, prev - finalPrice));

    // Compile new completed Order sheet and push to top of list
    const newOrder: Order = {
      id: `order-net-${Date.now()}`,
      code: `#LX-${Math.floor(10000 + Math.random() * 90000)}`,
      date: '2026年5月23日 • 现在交付',
      status: 'pending',
      items: checkoutItemsPayload,
      totalPrice: finalPrice,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Fast wipe paid items from current active cart state
    setCart((prev) => prev.filter((item) => !checkedItemIds.includes(item.productId)));

    // Route successfully to orders history view page
    setActiveTab('orders');
  };

  const handleBuyAgain = (orderId: string) => {
    const historicalOrder = orders.find((o) => o.id === orderId);
    if (historicalOrder) {
      setCart((prev) => {
        let updated = [...prev];
        historicalOrder.items.forEach((item) => {
          const alreadyInCart = updated.find((ci) => ci.productId === item.productId);
          if (alreadyInCart) {
            updated = updated.map((ci) =>
              ci.productId === item.productId
                ? { ...ci, quantity: ci.quantity + item.quantity, checked: true }
                : ci
            );
          } else {
            updated.push({
              id: `cart-bulk-${Date.now()}-${item.productId}`,
              productId: item.productId,
              quantity: item.quantity,
              checked: true,
            });
          }
        });
        return updated;
      });
    }
  };

  // Addresses additions hooks
  const handleAddAddress = (newAddr: ShippingAddress) => {
    setAddresses((prev) => {
      if (newAddr.isDefault) {
        return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [...prev, newAddr];
    });
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false }))
    );
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  // Messaging center push alerts
  const handleAddSupportMessage = (text: string) => {
    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: '下午 15:05',
    };
    setSupportChats((prev) => [...prev, newMsg]);
  };

  const handleAddSupportAutoReply = (text: string) => {
    const autoMsg: SupportMessage = {
      id: `msg-auto-${Date.now()}`,
      sender: 'support',
      text,
      timestamp: '下午 15:06',
    };
    setSupportChats((prev) => [...prev, autoMsg]);
  };

  // 1. Dynamic Login Authentication Handlers
  const handleLoginSuccess = (role: 'wholesaler' | 'sales' | 'warehouse' | 'admin', name: string) => {
    setUserRole(role);
    setLoggedInName(name);
    setAppState('authenticated');
  };

  const handleLogout = () => {
    setAppState('login');
    setLoggedInName('');
  };

  // 2. Supplier - Order statuses, waybill carriers, and abnormal controls updates
  const handleUpdateOrderStatus = (
    orderId: string, 
    status: Order['status'], 
    extra?: { carrier?: string; trackingNo?: string; isAbnormal?: boolean; abnormalReason?: string; resolveAbnormal?: boolean }
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status };
          if (extra) {
            if (extra.isAbnormal) {
              (updated as any).isAbnormal = true;
              (updated as any).abnormalReason = extra.abnormalReason;
            } else if (extra.resolveAbnormal) {
              const cleaned = { ...updated };
              delete (cleaned as any).isAbnormal;
              delete (cleaned as any).abnormalReason;
              return cleaned;
            }
            if (extra.carrier) (updated as any).carrier = extra.carrier;
            if (extra.trackingNo) (updated as any).trackingNo = extra.trackingNo;
          }
          return updated;
        }
        return ord;
      })
    );
  };

  // 3. Supplier - Product configuration updates (Prices, Stocks, Moqs, etc.)
  const handleUpdateProductStockOrPrice = (
    productId: string, 
    price?: number, 
    stock?: number, 
    moq?: number, 
    name?: string
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            price: price !== undefined ? price : p.price,
            stock: stock !== undefined ? stock : p.stock,
            moq: moq !== undefined ? moq : p.moq,
            name: name !== undefined ? name : p.name,
          };
        }
        return p;
      })
    );
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleNavigateToTabWithCategory = (tabId: string, categoryId?: string) => {
    if (categoryId) {
      setPreSelectedCategory(categoryId);
    }
    setActiveTab(tabId);
  };

  // Render logic under focused state
  const renderActiveView = () => {
    // 1. Splash Page Layer
    if (appState === 'splash') {
      return <SplashView onEnter={() => setAppState('login')} />;
    }

    // 2. Login Page Layer
    if (appState === 'login') {
      return <LoginView onLoginSuccess={handleLoginSuccess} />;
    }

    // 3. Authenticated - Supplier View (Sales / Warehouse / Admin)
    if (userRole !== 'wholesaler') {
      return (
        <SupplierView
          orders={orders}
          products={products}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateProductStockOrPrice={handleUpdateProductStockOrPrice}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onLogout={handleLogout}
          loggedInName={loggedInName}
          initialRole={userRole}
        />
      );
    }

    // 4. Authenticated - Wholesaler standard layers
    if (selectedProduct) {
      return (
        <ProductDetailView
          product={selectedProduct}
          onBack={handleBackToCatalog}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigateToTab={handleNavigateToTabWithCategory}
            cartCount={cart.length}
          />
        );
      case 'category':
        return (
          <CategoryListView
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigateToTab={setActiveTab}
            activePreSelectedCategory={preSelectedCategory}
            onClearPreSelectedCategory={() => setPreSelectedCategory(null)}
            cartCount={cartStatistics.checkedItemsCount}
            cartTotalPrice={cartStatistics.totalPrice}
          />
        );
      case 'cart':
        return (
          <CartView
            cartItems={cart}
            products={products}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onToggleCartCheck={handleToggleCartCheck}
            onToggleAllCart={handleToggleAllCart}
            onCheckout={handleCheckout}
            userCreditLimit={userCreditLimit}
            onNavigateToTab={setActiveTab}
          />
        );
      case 'orders':
        return (
          <OrdersView
            orders={orders}
            products={products}
            onBuyAgain={handleBuyAgain}
            onNavigateToTab={setActiveTab}
          />
        );
      case 'profile':
        return (
          <ProfileView
            addresses={addresses}
            onAddAddress={handleAddAddress}
            onSetDefaultAddress={handleSetDefaultAddress}
            onDeleteAddress={handleDeleteAddress}
            supportChats={supportChats}
            onAddSupportMessage={(txt) => {
              handleAddSupportMessage(txt);
              // Hook dynamic matching questions
              setTimeout(() => {
                if (txt.includes('保税') || txt.includes('出库') || txt.includes('发货')) {
                  handleAddSupportAutoReply('【物流专项答复】陈总，系统查询到您的保税1号库（DOCK-19）出货车次已经配属。提货单已分发车队，常发车预计在2小时内离口岸，感谢您对常州厂的支持！');
                } else if (txt.includes('额度') || txt.includes('汇款') || txt.includes('扣款')) {
                  handleAddSupportAutoReply('【财务部自动答复】收到您的授信扣款账款核验。如大宗协议汇款在24小时内到账常州厂，系统配额信用额度将实时清算并返回您的大额授信额度。');
                }
              }, 1000);
            }}
            userCreditLimit={userCreditLimit}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-bg min-h-screen font-sans selection:bg-brand-secondary/25 selection:text-brand-secondary">
      {/* Target Content Dynamic Layer */}
      {renderActiveView()}

      {/* Global Navigation Bottom Bar (hidden inside separate detail focus or supplier/splash/login states) */}
      {!selectedProduct && appState === 'authenticated' && userRole === 'wholesaler' && (
        <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-2 bg-surface-lowest border-t border-surface-highest rounded-t-xl shadow-[0px_-4px_12px_rgba(0,0,0,0.05)]">
          
          {/* Tab 1: Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer ${
              activeTab === 'home' 
                ? 'text-brand-secondary font-bold scale-100' 
                : 'text-text-muted hover:text-brand-primary scale-90'
            }`}
            title="首页"
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="font-sans text-[10px] tracking-wider">首页</span>
          </button>

          {/* Tab 2: Category Catalog */}
          <button
            onClick={() => setActiveTab('category')}
            className={`flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer ${
              activeTab === 'category' 
                ? 'text-brand-secondary font-bold scale-100' 
                : 'text-text-muted hover:text-brand-primary scale-90'
            }`}
            title="分类"
          >
            <Grid className="w-5 h-5 mb-0.5" />
            <span className="font-sans text-[10px] tracking-wider">分类</span>
          </button>

          {/* Tab 3: Cart with dynamic notifications badges */}
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer relative ${
              activeTab === 'cart' 
                ? 'text-brand-secondary font-bold scale-100' 
                : 'text-text-muted hover:text-brand-primary scale-90'
            }`}
            title="购物车"
          >
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            <span className="font-sans text-[10px] tracking-wider">购物车</span>
            {cart.length > 0 && (
              <span className="absolute top-1 right-2.5 bg-brand-secondary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cart.length}
              </span>
            )}
          </button>

          {/* Tab 4: Orders records history */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer ${
              activeTab === 'orders' 
                ? 'text-brand-secondary font-bold scale-100' 
                : 'text-text-muted hover:text-brand-primary scale-90'
            }`}
            title="订单"
          >
            <ClipboardCheck className="w-5 h-5 mb-0.5" />
            <span className="font-sans text-[10px] tracking-wider">订单</span>
          </button>

          {/* Tab 5: Profile personal workspace */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer ${
              activeTab === 'profile' 
                ? 'text-brand-secondary font-bold scale-100' 
                : 'text-text-muted hover:text-brand-primary scale-90'
            }`}
            title="我的"
          >
            <UserIcon className="w-5 h-5 mb-0.5" />
            <span className="font-sans text-[10px] tracking-wider">我的</span>
          </button>
        </nav>
      )}
    </div>
  );
}
