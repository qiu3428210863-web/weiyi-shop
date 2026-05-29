import React, { useState, useMemo } from 'react';
import { Product, Order, CartItem, ShippingAddress } from '../types';
import { WLogo } from './WLogo';
import { 
  Building, ClipboardCheck, Eye, CheckCircle, PackageOpen, AlertTriangle,
  Users, BarChart3, Truck, Edit3, Database, Sliders, Play,
  Camera, Barcode, HelpCircle, Check, LogOut, RefreshCw, Plus, Trash2,
  Search, ShieldAlert, BadgeHelp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupplierViewProps {
  orders: Order[];
  products: Product[];
  onUpdateOrderStatus: (
    orderId: string,
    status: Order['status'],
    extra?: { carrier?: string; trackingNo?: string; isAbnormal?: boolean; abnormalReason?: string; resolveAbnormal?: boolean }
  ) => void;
  onUpdateProductStockOrPrice: (
    productId: string,
    price?: number,
    stock?: number,
    moq?: number,
    name?: string
  ) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onLogout: () => void;
  loggedInName: string;
  initialRole: 'sales' | 'warehouse' | 'admin';
  wholesalerCreditPeriods: Record<string, number>;
  onSetWholesalerCreditPeriod: (name: string, days: number) => void;
  onAddWholesaler: (name: string, days: number) => void;
  onDeleteWholesaler: (name: string) => void;
}

export const SupplierView: React.FC<SupplierViewProps> = ({
  orders,
  products,
  onUpdateOrderStatus,
  onUpdateProductStockOrPrice,
  onAddProduct,
  onDeleteProduct,
  onLogout,
  loggedInName,
  initialRole,
  wholesalerCreditPeriods,
  onSetWholesalerCreditPeriod,
  onAddWholesaler,
  onDeleteWholesaler,
}) => {
  // Allow user to switch role on the fly inside the sandbox environment for rapid prototyping
  const [currentRole, setCurrentRole] = useState<'sales' | 'warehouse' | 'admin'>(initialRole);

  // States
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Sales Tab Selector
  const [salesSubTab, setSalesSubTab] = useState<'orders' | 'exceptions' | 'customers'>('orders');
  const [carrier, setCarrier] = useState('顺丰速运 (B2B大宗专列)');
  const [trackingNo, setTrackingNo] = useState('SF55289947219');
  
  // Abnormality modal trigger
  const [abnormalModalOrder, setAbnormalModalOrder] = useState<Order | null>(null);
  const [abnormalReasonInput, setAbnormalReasonInput] = useState('常州分拨中心雨雪天气，一号仓库货运驳运车辆通行受限，预计延迟12小时发货。');

  // Warehouse Tab Selector / States
  const [warehouseSubTab, setWarehouseSubTab] = useState<'pending' | 'scanning'>('pending');
  const [activeBarcodeScannerOrder, setActiveBarcodeScannerOrder] = useState<Order | null>(null);
  const [scanStep, setScanStep] = useState<'ready' | 'progress' | 'verified'>('ready');
  const [scannedItemsCheck, setScannedItemsCheck] = useState<Record<string, boolean>>({});

  // Admin Configuration States
  const [adminSubTab, setAdminSubTab] = useState<'catalog' | 'rules' | 'metrics'>('catalog');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<string>('');
  const [editStockVal, setEditStockVal] = useState<string>('');
  const [editMoqVal, setEditMoqVal] = useState<string>('');

  // New product editor state (Admin Tab)
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('fruitwine');
  const [newProdSku, setNewProdSku] = useState('CZ-B-99');
  const [newProdPrice, setNewProdPrice] = useState('580');
  const [newProdStock, setNewProdStock] = useState('1000');
  const [newProdMoq, setNewProdMoq] = useState('10');

  // Base B2B rules states
  const [b2bMoqMultiplier, setB2bMoqMultiplier] = useState(1);
  const [creditLimitDefault, setCreditLimitDefault] = useState(50000); // 50,000 credit allocation

  // Add wholesaler form state
  const [newWholesalerName, setNewWholesalerName] = useState('');
  const [newWholesalerDays, setNewWholesalerDays] = useState(30);

  // Derive display name from current role (so role switcher updates the name)
  const roleDisplayName = useMemo(() => {
    const map: Record<string, string> = {
      sales: '王晓东 (业务经理)',
      warehouse: '刘铁柱 (仓储主管)',
      admin: '系统管理员 (最高权限)',
    };
    return map[currentRole] ?? loggedInName;
  }, [currentRole, loggedInName]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2250);
  };

  const handleApplyOrderStatus = (orderId: string, status: Order['status'], logisticsCarrier?: string, code?: string) => {
    onUpdateOrderStatus(orderId, status, { carrier: logisticsCarrier, trackingNo: code });
    showToast(`订单 #${orderId.replace('order-net-', '')} 状态已更新为 ${status === 'shipping' ? '配载发货中' : '已妥投收单'}`);
  };

  // Trigger Abnormal State flag
  const handleSubmitAbnormalReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!abnormalModalOrder) return;
    onUpdateOrderStatus(abnormalModalOrder.id, abnormalModalOrder.status, {
      isAbnormal: true,
      abnormalReason: abnormalReasonInput
    });
    showToast(`订单已列为【异常协控单】，原因：${abnormalReasonInput.substring(0, 12)}...`);
    setAbnormalModalOrder(null);
  };

  // Solve Abnormal Status
  const handleResolveAbnormalStatus = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'pending', { resolveAbnormal: true });
    showToast('异常状态已解除，订单重新滑入标准发货流水线');
  };

  // Warehouse Scanning Simulator Toggles
  const handleStartScanning = (order: Order) => {
    setActiveBarcodeScannerOrder(order);
    setScanStep('ready');
    // Set all items in scan checklist to unchecked
    const list: Record<string, boolean> = {};
    order.items.forEach(itm => {
      list[itm.productId] = false;
    });
    setScannedItemsCheck(list);
  };

  const handleTickScanItem = (productId: string) => {
    setScannedItemsCheck(prev => ({ ...prev, [productId]: true }));
    showToast(`条码校验成功: SKU ${products.find(p => p.id === productId)?.sku || 'OK'}`);
  };

  const handleFinishScanWorkflow = () => {
    if (!activeBarcodeScannerOrder) return;
    setScanStep('verified');
    showToast('1号仓库：所有SKU托盘配载全部对齐，核单无误！');
  };

  const handleDispatchScannedOrder = () => {
    if (!activeBarcodeScannerOrder) return;
    onUpdateOrderStatus(activeBarcodeScannerOrder.id, 'shipping', {
      carrier: '常州本土专配车队',
      trackingNo: `SU-D-${Math.floor(10000 + Math.random() * 90000)}P`
    });
    showToast(`订单已更新为已出库，配运车牌已打标：${activeBarcodeScannerOrder.code}`);
    setActiveBarcodeScannerOrder(null);
    setWarehouseSubTab('pending');
  };

  // Admin product edit action
  const handleSaveProductEdit = () => {
    if (!editingProduct) return;
    const finalPrice = parseFloat(editPriceVal) || editingProduct.price;
    const finalStock = parseInt(editStockVal, 10) || editingProduct.stock;
    const finalMoq = parseInt(editMoqVal, 10) || editingProduct.moq;
    
    onUpdateProductStockOrPrice(editingProduct.id, finalPrice, finalStock, finalMoq, editingProduct.name);
    showToast(`商品 [${editingProduct.name.substring(0, 10)}...] 参数校准更新完毕！`);
    setEditingProduct(null);
  };

  // Admin add products action
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      sku: newProdSku || `CZ-B-${Math.floor(1000 + Math.random() * 9000)}`,
      price: parseFloat(newProdPrice) || 300,
      originalPrice: (parseFloat(newProdPrice) || 300) * 1.25,
      description: '常州果酒厂自营大宗供应链，鲜果发酵，配货极速调配送达。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMYocSAFiusZNcEeN6njaZEWesblQ5V_SDsdLS5Bwyr8tvLhBOgqH79UhWHqs4eTPO6OXfTJJuIj17rvyXzPY2KwKr59MZWe521HbA0M97ZSKuvWrIciTVctHxqwsWcFWquaoJRLjtFoC7K9zFut7pIZI4AgMjXjoClON-R08dWwGl8AOuaNj2hp5Z9uMQ5TZkta4FNgrLApb5ZAw0xSOKNIhEg63cQT-1uhFhGz5qvFXO5Lb6J99qAVQsjLEqH-nTU1vmdxLeHRCt',
      galleryImages: [],
      moq: parseInt(newProdMoq, 10) || 12,
      quantityPerBox: parseInt(newProdMoq, 10) || 12,
      stock: parseInt(newProdStock, 10) || 500,
      abv: '52% vol',
      origin: 'Changzhou, CHN',
      barrelType: 'Underground Cellar',
      boxWeight: '12 kg',
      category: newProdCategory as any,
      tags: ['特供', '新上架']
    };

    onAddProduct(newProd);
    showToast(`新上架 B2B 商品：${newProdName}，已经向全体批发采购商可见！`);
    setShowAddProductModal(false);
    setNewProdName('');
  };

  const handleDeleteProductConfirm = (id: string, name: string) => {
    onDeleteProduct(id);
    showToast(`已成功下架封存商品: ${name}`);
  };

  // Interactive statistics logic
  const statistics = useMemo(() => {
    const totalGmv = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const completedGmv = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingShipmentCount = orders.filter(o => o.status === 'pending').length;
    const totalProductCount = products.length;
    
    // Category counters
    return {
      totalGmv,
      completedGmv,
      pendingShipmentCount,
      totalProductCount,
    };
  }, [orders, products]);

  return (
    <div className="bg-surface-bg min-h-screen text-text-primary pb-32">
      {/* Supplier Executive Sticky Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-surface-lowest border-b border-surface-highest h-14 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center p-1.5 shadow">
            <WLogo className="w-6 h-6 text-white" color="white" />
          </div>
          <div>
            <h1 className="font-sans text-xs font-bold text-brand-primary leading-tight">果酒厂专属供货平台</h1>
            <p className="text-[9px] text-text-muted font-mono">ROLE: {currentRole === 'sales' ? '业务主管' : currentRole === 'warehouse' ? '仓储核单' : '系统管理'}</p>
          </div>
        </div>

        {/* Global Sandbox Role Select Toggle Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-surface-low border rounded-lg px-2 py-1 flex items-center gap-1">
            <span className="text-[10px] text-text-muted font-bold">切角色:</span>
            <select 
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as any)}
              className="bg-transparent font-sans text-[10px] font-bold text-brand-primary outline-none cursor-pointer"
            >
              <option value="sales">果酒厂业务员</option>
              <option value="warehouse">仓库核单员</option>
              <option value="admin">系统管理员</option>
            </select>
          </div>

          <button 
            onClick={onLogout}
            className="w-8 h-8 rounded-lg bg-surface-low hover:bg-red-50 hover:text-red-500 border border-surface-highest flex items-center justify-center transition-all cursor-pointer"
            title="退出登录"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="pt-18 px-4 max-w-lg mx-auto space-y-5">
        
        {/* Toast Notifier */}
        {toastMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-primary text-white text-xs px-4 py-3 rounded-md shadow-lg transition-all text-center">
            {toastMsg}
          </div>
        )}

        {/* Sub-Header Welcome panel */}
        <div className="bg-surface-lowest border border-surface-highest rounded-xl p-4 flex justify-between items-center relative overflow-hidden shadow-sm">
          <div className="space-y-1.5 z-10">
            <span className="text-[9px] bg-brand-primary/10 text-brand-primary font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
              协议企业内网
            </span>
            <h2 className="font-sans text-sm font-extrabold text-brand-primary">
              您好，{roleDisplayName}
            </h2>
            <p className="text-[10.5px] text-text-muted leading-relaxed">
              常州果酒厂出库状态良好，当前有 <span className="text-brand-secondary font-bold">{statistics.pendingShipmentCount} </span>笔待核配采购单。
            </p>
          </div>
          <Building className="w-16 h-16 text-brand-primary/5 absolute right-4 bottom-2" />
        </div>

        {/* ======================= ROLE 1: WINERY SALES PERSONNEL ======================= */}
        {currentRole === 'sales' && (
          <div className="space-y-4">
            {/* Sales Dashboard Sub Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-surface-low border p-1 rounded-xl">
              <button
                onClick={() => setSalesSubTab('orders')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  salesSubTab === 'orders' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>合同订单簿</span>
              </button>
              <button
                onClick={() => setSalesSubTab('exceptions')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  salesSubTab === 'exceptions' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>异常协控单</span>
              </button>
              <button
                onClick={() => setSalesSubTab('customers')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  salesSubTab === 'customers' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>大宗采购商</span>
              </button>
            </div>

            {/* Sales SubTab Content 1: B2B Order List */}
            {salesSubTab === 'orders' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">大客户即时采购单</h3>
                  <span className="text-[10px] text-text-muted font-mono">共 {orders.length} 笔记录</span>
                </div>

                <div className="space-y-3">
                  {orders.map((ord) => {
                    const isOrderAbnormal = 'isAbnormal' in ord && ord.isAbnormal;
                    return (
                      <div 
                        key={ord.id} 
                        className={`bg-surface-lowest border p-4 rounded-xl space-y-3 relative hover:border-brand-primary transition-all shadow-sm ${
                          isOrderAbnormal ? 'border-red-200 bg-red-50/10' : 'border-surface-highest'
                        }`}
                      >
                        {/* Order Code and Status badge */}
                        <div className="flex justify-between items-center border-b border-surface-low pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-extrabold text-brand-primary">{ord.code}</span>
                            {isOrderAbnormal && (
                              <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                <ShieldAlert className="w-3 h-3" /> 异常挂起
                              </span>
                            )}
                          </div>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                            ord.status === 'approved' ? 'bg-blue-50 text-blue-600' :
                            ord.status === 'shipping' ? 'bg-blue-50 text-blue-600' :
                            'bg-green-50 text-green-600'
                          }`}>
                            {ord.status === 'pending' ? '待审核' :
                             ord.status === 'approved' ? '待仓库核单' :
                             ord.status === 'shipping' ? '在途配送' :
                             '妥投签收'}
                          </span>
                        </div>

                        {/* Order Items list */}
                        <div className="space-y-1.5">
                          {ord.items.map((itm, index) => {
                            const p = products.find(x => x.id === itm.productId);
                            return (
                              <div key={index} className="flex justify-between text-xs font-sans">
                                <span className="text-text-primary font-medium line-clamp-1 flex-grow pr-4">
                                  {p ? p.name : '未知商品'}
                                </span>
                                <div className="text-right flex-shrink-0 font-mono text-text-muted space-x-2">
                                  <span>¥{itm.priceAtPurchase}</span>
                                  <span className="font-bold text-brand-primary">×{itm.quantity}箱</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex justify-between items-center bg-surface-low p-2 rounded-lg text-xs">
                          <span className="text-[10px] text-text-muted font-mono">{ord.date}</span>
                          <span className="font-bold text-brand-secondary">
                            全款结算: ¥{ord.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                          </span>
                        </div>

                        {/* Order abnormal description block */}
                        {isOrderAbnormal && (
                          <div className="bg-red-50/50 border border-red-100 rounded-lg p-2.5 space-y-1">
                            <span className="text-[10px] text-red-700 font-extrabold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> 业务异常反馈报告:
                            </span>
                            <p className="text-[10px] text-red-600 leading-relaxed font-sans font-medium">
                              {(ord as any).abnormalReason}
                            </p>
                          </div>
                        )}

                        {/* Action buttons mapping */}
                        <div className="flex gap-2 pt-1 border-t border-surface-low justify-end">
                          {ord.status === 'pending' && !isOrderAbnormal && (
                            <>
                              <button
                                onClick={() => setAbnormalModalOrder(ord)}
                                className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                申控异常
                              </button>
                              <button
                                onClick={() => {
                                  onUpdateOrderStatus(ord.id, 'approved');
                                  showToast(`订单 ${ord.code} 已审核通过，已发往仓库等待核单出库`);
                                }}
                                className="px-4.5 py-1.5 bg-brand-primary text-white hover:bg-brand-secondary text-[10.5px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>审核通过，发往仓库</span>
                              </button>
                            </>
                          )}

                          {ord.status === 'approved' && !isOrderAbnormal && (
                            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                              <PackageOpen className="w-3.5 h-3.5" />
                              <span>已发往仓库，待核单出库</span>
                            </span>
                          )}

                          {isOrderAbnormal && (
                            <button
                              onClick={() => handleResolveAbnormalStatus(ord.id)}
                              className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              解除锁定并重排
                            </button>
                          )}

                          {ord.status === 'shipping' && (
                            <button
                              onClick={() => handleApplyOrderStatus(ord.id, 'completed')}
                              className="px-4 py-1.5 bg-[#409eff] hover:bg-blue-600 text-white text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              调阅物流并妥投
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sales SubTab Content 2: Abnormal Orders Control */}
            {salesSubTab === 'exceptions' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">异常挂载订单看板</h3>
                  <span className="text-[9.5px] bg-red-100 text-red-600 font-mono font-bold px-2 py-0.5 rounded-full">
                    当前: {orders.filter(o => 'isAbnormal' in o && (o as any).isAbnormal).length} 笔异常
                  </span>
                </div>

                <div className="space-y-3">
                  {orders.filter(o => 'isAbnormal' in o && (o as any).isAbnormal).length === 0 ? (
                    <div className="bg-surface-lowest p-8 rounded-xl border border-surface-highest text-center space-y-2">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                      <p className="text-xs font-bold text-brand-primary">赞！当前无受阻或异常合同订单</p>
                      <p className="text-[10px] text-text-muted">仓库区提货、配送状态全线绿灯正常</p>
                    </div>
                  ) : (
                    orders.filter(o => 'isAbnormal' in o && (o as any).isAbnormal).map(o => (
                      <div key={o.id} className="bg-surface-lowest border border-red-200 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <span className="font-mono text-xs font-extrabold text-brand-primary">{o.code}</span>
                          <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold">
                            大宗结算扣留
                          </span>
                        </div>
                        <p className="text-xs text-text-muted font-sans font-semibold">
                          异常说明：{(o as any).abnormalReason}
                        </p>
                        <div className="flex gap-2 justify-end pt-2 border-t">
                          <button
                            onClick={() => handleResolveAbnormalStatus(o.id)}
                            className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10.5px] font-bold rounded-lg transition-all cursor-pointer"
                          >
                            释放挂检并一键重发
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sales SubTab Content 3: Customer History Book */}
            {salesSubTab === 'customers' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">常州大宗交易授信契约商（{Object.keys(wholesalerCreditPeriods).length} 家）</h3>

                <div className="bg-surface-lowest p-4 rounded-xl border border-surface-highest space-y-3">
                  {Object.keys(wholesalerCreditPeriods).length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-4">暂无批发采购商，请先在「规则配置」中新增。</p>
                  ) : (
                    Object.entries(wholesalerCreditPeriods).map(([name, days], idx) => {
                      const initials = name.replace(/[有限公司（()）\s]/g, '').slice(0, 2).toUpperCase();
                      const colors = ['bg-brand-primary/10', 'bg-neutral-100', 'bg-amber-100', 'bg-blue-100', 'bg-green-100'];
                      const colorClass = colors[idx % colors.length];
                      const textColors = ['text-brand-primary', 'text-neutral-600', 'text-amber-600', 'text-blue-600', 'text-green-600'];
                      const textColor = textColors[idx % textColors.length];
                      return (
                        <div key={name} className={`flex items-center gap-3 ${idx < Object.keys(wholesalerCreditPeriods).length - 1 ? 'border-b pb-3' : ''}`}>
                          <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center font-bold font-mono ${textColor} text-xs`}>
                            {initials}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between w-full">
                              <p className="text-xs font-bold text-brand-primary">{name}</p>
                              <span className="text-[9px] font-mono text-brand-secondary font-bold px-1.5">
                                {days} 天账期
                              </span>
                            </div>
                            <p className="text-[10px] text-text-muted mt-0.5">信用账期 {days} 天 · 协议授信契约商</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}


        {/* ======================= ROLE 2: WAREHOUSE STAFF WORKSPACE ======================= */}
        {currentRole === 'warehouse' && (
          <div className="space-y-4">
            
            {/* Warehouse sub navigation */}
            <div className="grid grid-cols-2 gap-1 bg-surface-low border p-1 rounded-xl">
              <button
                onClick={() => setWarehouseSubTab('pending')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  warehouseSubTab === 'pending' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                <PackageOpen className="w-4 h-4" />
                <span>备货出库清单 ({orders.filter(o => o.status === 'approved').length})</span>
              </button>
              <button
                onClick={() => {
                  if (orders.filter(o => o.status === 'approved').length > 0) {
                    handleStartScanning(orders.filter(o => o.status === 'approved')[0]);
                  } else {
                    showToast('当前仓库暂无待核配出库的订单！');
                  }
                  setWarehouseSubTab('scanning');
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  warehouseSubTab === 'scanning' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>红外核单扫码枪</span>
              </button>
            </div>

            {/* Warehouse Tab Content 1: Pending Shipment */}
            {warehouseSubTab === 'pending' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">待备货配送订单 (仓库拣货流程)</h3>
                  <span className="text-[9.5px] font-mono font-bold bg-[#5c62b5]/10 text-brand-primary px-2 py-0.5 rounded-full">
                    DOCK-19 DOCKING STATION
                  </span>
                </div>

                <div className="space-y-3">
                  {orders.filter(o => o.status === 'approved').length === 0 ? (
                    <div className="bg-surface-lowest p-8 rounded-xl border border-surface-highest text-center space-y-2">
                      <Check className="w-8 h-8 text-green-500 mx-auto bg-green-50 p-1 rounded-full" />
                      <p className="text-xs font-bold text-brand-primary">暂无待核单出库的订单</p>
                      <p className="text-[10px] text-text-muted font-medium">业务员审核通过后的订单将出现在这里</p>
                    </div>
                  ) : (
                    orders.filter(o => o.status === 'approved').map((ord) => (
                      <div key={ord.id} className="bg-surface-lowest border border-surface-highest p-4 rounded-xl space-y-3">
                        <div className="flex justify-between border-b pb-2">
                          <div>
                            <span className="font-mono text-xs font-extrabold text-brand-primary block">{ord.code}</span>
                            <span className="text-[9px] text-text-muted font-mono">{ord.date}</span>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] bg-yellow-50 text-yellow-600 font-extrabold px-1.5 py-0.5 rounded-full">
                              待物理打箱核库
                            </span>
                          </div>
                        </div>

                        {/* Order Item List with MOQ and Weights specification */}
                        <div className="space-y-2">
                          {ord.items.map((itm, idx) => {
                            const p = products.find(x => x.id === itm.productId);
                            return (
                              <div key={idx} className="flex justify-between text-xs bg-surface-low/50 p-2 rounded border border-dashed border-surface-low">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-brand-primary">{p ? p.name : '大容量基酒'}</p>
                                  <p className="font-mono text-[9px] text-text-muted">SKU: {p?.sku} | 调拨整箱毛重: {p?.boxWeight || '15kg'}</p>
                                </div>
                                <div className="text-right font-mono font-bold text-[#5c62b5] flex flex-col justify-center">
                                  <span>{itm.quantity} 箱</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 justify-end pt-2 border-t border-surface-low">
                          <button
                            onClick={() => {
                              handleStartScanning(ord);
                              setWarehouseSubTab('scanning');
                            }}
                            className="w-full py-2.5 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow active:scale-98 transition-all cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            <span>红外激光扫码核单</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Warehouse Tab Content 2: Barcode Scanning Simulator */}
            {warehouseSubTab === 'scanning' && activeBarcodeScannerOrder && (
              <div className="space-y-4">
                <div className="bg-surface-lowest border border-surface-highest rounded-xl p-4 space-y-3 shadow-md">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="text-[9px] text-brand-secondary font-mono uppercase tracking-widest font-extrabold block">托盘扫描仪状态：激光枪待命</span>
                      <h4 className="text-xs font-extrabold text-brand-primary flex items-center gap-1">
                        正在扫描配单：{activeBarcodeScannerOrder.code}
                      </h4>
                    </div>
                    <BadgeHelp className="w-4 h-4 text-text-muted hover:text-brand-primary cursor-pointer" />
                  </div>

                  {/* Optical Scanner graphic display area */}
                  <div className="bg-black/95 text-green-400 aspect-[16/8] rounded-xl flex flex-col justify-center items-center p-4 font-mono select-none relative overflow-hidden border border-green-500/20">
                    {/* Animated laser horizontal line overlay */}
                    <div className="absolute left-0 w-full h-0.5 bg-red-500 animate-[bounce_2s_infinite] shadow-[0_0_10px_rgba(239,68,68,0.8)] z-10" />

                    <div className="z-10 text-center space-y-1.5">
                      <div className="flex gap-1 items-center justify-center">
                        <Barcode className="w-12 h-12 text-green-400" />
                      </div>
                      
                      {scanStep === 'ready' && (
                        <div>
                          <p className="text-xs animate-pulse text-green-400">► 激光已聚焦。请在下方点击各SKU完成校验</p>
                          <p className="text-[9.5px] text-green-300 opacity-60 mt-1">DOCK-19 LASER ENGINE READY</p>
                        </div>
                      )}

                      {scanStep === 'progress' && (
                        <div>
                          <p className="text-xs text-yellow-400 font-bold">● 已识别部分拼装托盘 ...</p>
                          <p className="text-[9px] text-[#fafafa] mt-0.5">继续点击下方未确认的商品</p>
                        </div>
                      )}

                      {scanStep === 'verified' && (
                        <div className="space-y-1 text-green-400 animate-[pulse_1.5s_infinite]">
                          <p className="text-xs font-extrabold text-green-400 flex items-center gap-1 justify-center">
                            ✓ OK: 订单全数配装条码校对成功
                          </p>
                          <p className="text-[9.5px]">可以进行车牌录入并一键封库发出</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manual checklist items */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] text-text-muted font-bold font-sans">点击下方按钮模拟红外扫描枪核单：</p>
                    
                    <div className="space-y-2">
                      {activeBarcodeScannerOrder.items.map((itm) => {
                        const p = products.find(x => x.id === itm.productId);
                        const isScanned = scannedItemsCheck[itm.productId];
                        return (
                          <button
                            key={itm.productId}
                            onClick={() => {
                              handleTickScanItem(itm.productId);
                              setScanStep('progress');
                              
                              // Check if overall scan finalized
                              const updatedChecks = { ...scannedItemsCheck, [itm.productId]: true };
                              const allDone = activeBarcodeScannerOrder.items.every(item => updatedChecks[item.productId]);
                              if (allDone) {
                                setScanStep('verified');
                              }
                            }}
                            className={`w-full p-3 rounded-lg border text-left flex justify-between items-center transition-all cursor-pointer ${
                              isScanned 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-surface-low border-surface-highest hover:bg-surface-lowest text-text-primary'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold leading-normal block">{p ? p.name : '洋酒'}</span>
                              <span className="font-mono text-[9.5px] text-text-muted block">条码：{p?.sku}</span>
                            </div>
                            
                            <div className="flex-shrink-0">
                              {isScanned ? (
                                <span className="text-[10px] bg-green-200 font-bold px-2 py-1 rounded text-green-800 flex items-center gap-1">
                                  ✓ 已校验 {itm.quantity}箱
                                </span>
                              ) : (
                                <span className="text-[10px] bg-brand-primary text-white font-bold px-2 py-1 rounded flex items-center gap-1">
                                  <Camera className="w-3 h-3" />
                                  扫此条码
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Outbound update action */}
                  {scanStep === 'verified' && (
                    <div className="border-t pt-4 space-y-3.5 bg-green-50/20 p-3 rounded-xl">
                      <h4 className="text-xs font-bold text-green-800">录入调拔车辆物流信息（完成离库发货）：</h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-bold text-text-muted block">配送主管车队</label>
                          <input 
                            type="text" 
                            className="w-full text-xs font-sans p-2 border border-surface-highest bg-white rounded font-bold"
                            value={carrier}
                            onChange={(e) => setCarrier(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-bold text-text-muted block">运单号 / 车牌号 *</label>
                          <input 
                            type="text" 
                            className="w-full text-xs font-sans p-2 border border-surface-highest bg-white rounded font-mono font-bold"
                            value={trackingNo}
                            onChange={(e) => setTrackingNo(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleDispatchScannedOrder}
                        className="w-full py-3 bg-brand-secondary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 hover:bg-brand-primary transition-all cursor-pointer shadow-md"
                      >
                        <Truck className="w-4 h-4" />
                        <span>批准配载并一键出库</span>
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setWarehouseSubTab('pending')}
                  className="w-full h-11 bg-surface-lowest text-text-muted hover:text-brand-primary border rounded-xl text-xs font-bold"
                >
                  返回待备货单簿
                </button>
              </div>
            )}
          </div>
        )}


        {/* ======================= ROLE 3: FACTORY ADMIN WORKSPACE ======================= */}
        {currentRole === 'admin' && (
          <div className="space-y-4">
            
            {/* Admin Mini Menu Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-surface-low border p-1 rounded-xl">
              <button
                onClick={() => setAdminSubTab('catalog')}
                className={`py-1.5 text-[10.5px] font-bold rounded flex flex-col items-center justify-center leading-normal transition-all ${
                  adminSubTab === 'catalog' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                <Database className="w-3.5 h-3.5 mb-0.5" />
                <span>商品管理 </span>
              </button>

              <button
                onClick={() => setAdminSubTab('rules')}
                className={`py-1.5 text-[10.5px] font-bold rounded flex flex-col items-center justify-center leading-normal transition-all ${
                  adminSubTab === 'rules' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 mb-0.5" />
                <span>供销规则 </span>
              </button>

              <button
                onClick={() => setAdminSubTab('metrics')}
                className={`py-1.5 text-[10.5px] font-bold rounded flex flex-col items-center justify-center leading-normal transition-all ${
                  adminSubTab === 'metrics' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 mb-0.5" />
                <span>经营数据 </span>
              </button>
            </div>


            {/* Admin SubTab Content 1: Catalog view */}
            {adminSubTab === 'catalog' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">常州直营类目总汇</h3>
                  <button 
                    onClick={() => setShowAddProductModal(true)}
                    className="bg-brand-secondary text-white hover:bg-brand-primary px-3 py-1.5 text-[10.5px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>上架新特供 </span>
                  </button>
                </div>

                <div className="space-y-3">
                  {products.map((p) => (
                    <div key={p.id} className="bg-surface-lowest p-3 rounded-xl border border-surface-highest flex gap-3 hover:border-brand-primary transition-all relative overflow-hidden">
                      <div className="w-14 h-14 bg-surface-low rounded overflow-hidden flex-shrink-0">
                        <img src={p.image} className="w-full h-full object-contain p-1 bg-white" alt="" />
                      </div>
                      
                      <div className="flex-grow space-y-1">
                        <div className="w-full">
                          <h4 className="text-xs font-bold text-brand-primary line-clamp-1 pr-12">{p.name}</h4>
                          <span className="text-[9.5px] text-text-muted font-mono bg-surface-low px-1.5 rounded mt-0.5 inline-block">{p.sku}</span>
                        </div>
                        <p className="text-[10px] text-text-muted font-mono leading-none">类目：{p.category === 'fruitwine' ? '果酒' : p.category === 'baijiu' ? '白酒' : p.category === 'wine' ? '红洋酒' : p.category === 'beer' ? '啤酒' : '配件'}</p>
                        <div className="flex justify-between items-center pt-1.5 border-t border-dashed">
                          <span className="font-mono text-xs font-bold text-brand-secondary">B2B价: ¥{p.price}</span>
                          <span className="font-mono text-[10.5px] text-text-muted">提货库存: <strong className="text-brand-primary">{p.stock}箱</strong></span>
                        </div>
                      </div>

                      {/* Editing & Deleting Triggers on top or right */}
                      <div className="absolute top-2.5 right-2.5 flex gap-1">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setEditPriceVal(p.price.toString());
                            setEditStockVal(p.stock.toString());
                            setEditMoqVal(p.moq.toString());
                          }}
                          className="w-6 h-6 rounded bg-surface-low text-brand-primary hover:bg-[#5c62b5]/10 flex items-center justify-center cursor-pointer"
                          title="修改参数"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => {
                            if (window.confirm(`确定要彻底下架封存常州工厂商品 [${p.name}] 吗？`)) {
                              handleDeleteProductConfirm(p.id, p.name);
                            }
                          }}
                          className="w-6 h-6 rounded bg-surface-low text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer"
                          title="商品下架"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Admin SubTab Content 2: Business rules configurations */}
            {adminSubTab === 'rules' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">全局协议供销基础规则配置（沙箱级别）</h3>

                <div className="bg-surface-lowest p-4 rounded-xl border border-surface-highest space-y-4 shadow-sm text-xs">
                  {/* MOQ policy rules */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="font-bold text-brand-primary block">最小起订量 (MOQ) 全局倍率</label>
                      <span className="font-mono text-brand-secondary font-bold">{b2bMoqMultiplier}x (正常运行)</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="1"
                      className="w-full h-1.5 bg-surface-low rounded-lg appearance-none cursor-pointer accent-[#5c62b5]"
                      value={b2bMoqMultiplier}
                      onChange={(e) => {
                        setB2bMoqMultiplier(parseInt(e.target.value, 10));
                        showToast(`已全局微调大宗采购MOQ最低门槛为：${e.target.value}倍`);
                      }}
                    />
                    <p className="text-[10px] text-text-muted">当仓库运力极度紧张时，可适度拉升MOQ多箱整合运送以提防配载损耗。</p>
                  </div>

                  {/* Defaut credit limits allocation */}
                  <div className="space-y-1.5 border-t pt-3.5">
                    <label className="font-bold text-brand-primary block">常州代理采购结算默认账户授信总额度</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        className="bg-surface-low border rounded p-2 text-xs font-mono font-bold text-brand-primary flex-grow"
                        value={creditLimitDefault}
                        onChange={(e) => setCreditLimitDefault(parseFloat(e.target.value) || 0)}
                      />
                      <button 
                        onClick={() => {
                          showToast(`常州唯一果酒厂：已对默认新签约客户重新校正基础授信：¥${creditLimitDefault.toLocaleString()}`);
                        }}
                        className="bg-brand-primary hover:bg-brand-secondary text-white px-3 font-bold rounded"
                      >
                        下发额度
                      </button>
                    </div>
                  </div>

                  {/* 批发商账期配置（按批发商独立设置） */}
                  <div className="space-y-3 border-t pt-3.5">
                    <label className="font-bold text-brand-primary block text-xs">批发商账期配置（按批发商独立设置）</label>
                    <p className="text-[10px] text-text-muted">为每个批发商单独设置信用账期天数，到期未结算将触发逾期提醒。</p>
                    {Object.entries(wholesalerCreditPeriods).map(([name, days]) => (
                      <div key={name} className="bg-surface-low rounded-lg p-3 border border-surface-highest space-y-2 relative">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-brand-primary">{name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-brand-secondary text-[10px] font-bold">{days} 天</span>
                            <button
                              onClick={() => {
                                if (window.confirm(`确定要删除批发商「${name}」吗？`)) {
                                  onDeleteWholesaler(name);
                                  showToast(`已删除批发商「${name}」`);
                                }
                              }}
                              className="w-5 h-5 rounded bg-surface-lowest hover:bg-red-50 hover:text-red-500 text-text-muted flex items-center justify-center cursor-pointer transition-colors"
                              title="删除此批发商"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSetWholesalerCreditPeriod(name, Math.max(7, days - 7));
                              showToast(`${name} 账期已调整为 ${Math.max(7, days - 7)} 天`);
                            }}
                            className="w-7 h-7 rounded border text-base hover:bg-surface-lowest font-bold cursor-pointer flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="range"
                            min="7"
                            max="180"
                            step="1"
                            className="flex-1 h-1.5 bg-surface-highest rounded-lg appearance-none cursor-pointer accent-[#5c62b5]"
                            value={days}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              onSetWholesalerCreditPeriod(name, val);
                              showToast(`${name} 账期已更新为 ${val} 天`);
                            }}
                          />
                          <button
                            onClick={() => {
                              onSetWholesalerCreditPeriod(name, Math.min(180, days + 7));
                              showToast(`${name} 账期已调整为 ${Math.min(180, days + 7)} 天`);
                            }}
                            className="w-7 h-7 rounded border text-base hover:bg-surface-lowest font-bold cursor-pointer flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* 新增批发商 */}
                    <div className="bg-surface-low rounded-lg p-3 border border-dashed border-brand-secondary/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-brand-secondary">
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">新增批发采购商</span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="输入批发商名称..."
                          className="w-full bg-white border border-surface-highest rounded px-2.5 py-1.5 text-xs font-sans outline-none focus:border-brand-primary"
                          value={newWholesalerName}
                          onChange={(e) => setNewWholesalerName(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-text-muted">账期</span>
                            <input
                              type="number"
                              min="7"
                              max="180"
                              className="w-16 bg-white border border-surface-highest rounded px-2 py-1.5 text-xs font-mono text-center outline-none focus:border-brand-primary"
                              value={newWholesalerDays}
                              onChange={(e) => setNewWholesalerDays(parseInt(e.target.value) || 30)}
                            />
                            <span className="text-[10px] text-text-muted">天</span>
                          </div>
                          <button
                            onClick={() => {
                              if (!newWholesalerName.trim()) {
                                showToast('请输入批发商名称');
                                return;
                              }
                              onAddWholesaler(newWholesalerName.trim(), newWholesalerDays);
                              showToast(`已新增批发商「${newWholesalerName.trim()}」，账期 ${newWholesalerDays} 天`);
                              setNewWholesalerName('');
                              setNewWholesalerDays(30);
                            }}
                            className="bg-brand-secondary hover:brightness-110 text-white text-xs font-bold px-4 py-1.5 rounded transition-all"
                          >
                            添加
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Admin SubTab Content 3: Fully custom SVG charts dashboards */}
            {adminSubTab === 'metrics' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">常州唯一果酒厂经营大宗GMV实况</h3>
                  <span className="text-[9.5px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                    实时汇总(D3核载)
                  </span>
                </div>

                {/* Dashboard grid metrics cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-lowest p-3 border rounded-xl shadow-sm text-center">
                    <p className="text-[10.5px] text-text-muted font-sans">协议预扣总额 (GMV)</p>
                    <p className="font-mono text-md font-extrabold text-[#5c62b5] mt-1.5">
                      ¥{(statistics.totalGmv).toLocaleString(undefined, { minimumFractionDigits: 1 })}
                    </p>
                  </div>
                  
                  <div className="bg-surface-lowest p-3 border rounded-xl shadow-sm text-center">
                    <p className="text-[10.5px] text-text-muted font-sans">已妥投到款额</p>
                    <p className="font-mono text-md font-extrabold text-green-600 mt-1.5">
                      ¥{orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString(undefined, { minimumFractionDigits: 1 })}
                    </p>
                  </div>
                </div>

                {/* Dynamic SVG Bar Chart representing each product's stock data */}
                <div className="bg-surface-lowest p-4 rounded-xl border border-surface-highest space-y-4 shadow-sm text-center">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-brand-primary">果酒厂各单品库存数据</h4>
                    <span className="text-[9px] font-mono text-text-muted">单位: 箱</span>
                  </div>

                  {/* Horizontally scrollable bar chart */}
                  <div className="relative pt-2 overflow-x-auto">
                    <svg
                      viewBox={`0 0 ${Math.max(400, products.length * 70 + 60)} 390`}
                      className="h-80"
                      style={{ width: Math.max(400, products.length * 70 + 60) }}
                    >
                      {/* Grid lines */}
                      {[160, 110, 60, 20].map(y => (
                        <line key={y} x1="40" y1={y} x2={Math.max(380, products.length * 70 + 40)} y2={y} stroke={y === 20 ? '#f3f3f8' : '#f0f0f5'} strokeWidth="1" />
                      ))}

                      {/* Dynamic per-product bars */}
                      {(() => {
                        const barColors = ['#5c62b5', '#e23337', '#ff9900', '#67c23a', '#409eff', '#fa8c16', '#722ed1', '#13c2c2', '#eb2f96', '#f5222d'];
                        const maxStock = Math.max(...products.map(p => p.stock), 1);
                        const scaleFactor = 140 / maxStock;
                        const slotWidth = 70;
                        const barWidth = 32;

                        return products.map((p, i) => {
                          const barHeight = Math.min(140, p.stock * scaleFactor);
                          const centerX = 40 + slotWidth * (i + 0.5);
                          const x = centerX - barWidth / 2;
                          const color = barColors[i % barColors.length];

                          return (
                            <React.Fragment key={p.id}>
                              <rect
                                x={x}
                                y={160 - barHeight}
                                width={barWidth}
                                height={barHeight}
                                fill={color}
                                rx="3"
                                className="transition-all duration-1000"
                              />
                              <text x={centerX} y={148 - barHeight} textAnchor="middle" fill={color} className="font-mono text-[9px] font-bold">
                                {p.stock}
                              </text>
                              {/* Vertical text via absolute-positioned tspan for each character */}
                              <text textAnchor="middle" fill="#606266" className="text-[11px] font-sans" dominantBaseline="auto">
                                {(() => {
                                  const chars = p.name.replace(/\s+\d+ml.*$/, '');
                                  const startY = 210;
                                  const lineHeight = 16;
                                  return chars.split('').map((char, ci) => (
                                    <tspan key={ci} x={centerX} y={startY + ci * lineHeight}>{char}</tspan>
                                  ));
                                })()}
                              </text>
                            </React.Fragment>
                          );
                        });
                      })()}
                    </svg>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </main>


      {/* ====================================================================== */}
      {/* ======================= MODAL LAYERS AREA ======================= */}
      {/* ====================================================================== */}

      {/* 1. Modal: Abnormal reporting details editor */}
      {abnormalModalOrder && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form 
            onSubmit={handleSubmitAbnormalReason}
            className="bg-white w-full max-w-sm rounded-xl p-5 space-y-4 shadow-xl text-left border border-surface-highest"
          >
            <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>上报订单大宗调拔交易异常</span>
            </div>

            <p className="text-[11px] text-text-muted leading-relaxed">
              您正在把大客户陈总的采购单 <strong>{abnormalModalOrder.code}</strong> 更改为阻梗/异常审查状态，请填写大宗物流受阻详情以反馈给陈总看板：
            </p>

            <textarea
              required
              rows={4}
              className="w-full text-xs font-sans p-2 border border-surface-highest bg-surface-low rounded leading-relaxed outline-none focus:border-red-400"
              value={abnormalReasonInput}
              onChange={(e) => setAbnormalReasonInput(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                className="py-2 bg-surface-low hover:bg-surface-highest text-xs font-bold rounded-lg text-text-muted cursor-pointer"
                onClick={() => setAbnormalModalOrder(null)}
              >
                取消
              </button>
              <button
                type="submit"
                className="py-2 bg-red-600 hover:bg-red-700 text-xs font-bold rounded-lg text-white shadow-sm cursor-pointer"
              >
                确认挂检异常
              </button>
            </div>
          </form>
        </div>
      )}


      {/* 3. Modal: Admin - Modify single catalog item stock/price parameter */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-sans text-xs font-extrabold text-brand-primary flex items-center gap-1.5 uppercase border-b pb-2">
              <Edit3 className="w-4 h-4 text-brand-secondary" />
              <span>批量大宗B2B价格库存校准</span>
            </h3>

            <p className="text-[11px] text-text-muted">
              正在修改常州厂房仓库中的大宗商品： <strong>{editingProduct.name}</strong>
            </p>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] text-text-primary font-bold block">B2B 协议单价 / 箱 (CNY) *</label>
                <input 
                  type="number" 
                  step="1"
                  className="w-full text-xs font-mono p-2 border border-surface-highest rounded bg-surface-low font-bold"
                  value={editPriceVal}
                  onChange={(e) => setEditPriceVal(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-text-primary font-bold block">工厂仓库备用安全储备 (箱) *</label>
                <input 
                  type="number" 
                  className="w-full text-xs font-mono p-2 border border-surface-highest rounded bg-surface-low font-bold"
                  value={editStockVal}
                  onChange={(e) => setEditStockVal(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-text-primary font-bold block">最小一键起订起买量 MOQ (箱) *</label>
                <input 
                  type="number" 
                  className="w-full text-xs font-mono p-2 border border-surface-highest rounded bg-surface-low font-bold"
                  value={editMoqVal}
                  onChange={(e) => setEditMoqVal(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <button
                onClick={() => setEditingProduct(null)}
                className="py-2.5 bg-surface-low text-xs font-bold rounded-lg text-text-muted cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveProductEdit}
                className="py-2.5 bg-brand-primary text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
              >
                保存校准参数
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 4. Modal: Admin - Create new product spec form */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <form 
            onSubmit={handleCreateProduct}
            className="bg-white w-full max-w-sm rounded-xl p-5 space-y-3.5 shadow-2xl text-left border overflow-y-auto max-h-[90vh]"
          >
            <h3 className="font-sans text-xs font-extrabold text-brand-primary flex items-center gap-1.5 uppercase border-b pb-2">
              <Plus className="w-4 h-4 text-brand-secondary animate-spin" />
              <span>新上架自建特供 B2B 类目</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-primary block">常州新商品官称 *</label>
                <input 
                  type="text" 
                  required
                  placeholder="如: 常州果酒厂特推 青梅精酿"
                  className="w-full p-2 border rounded bg-surface-low"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">香型分类 *</label>
                  <select 
                    className="w-full p-2 border rounded bg-surface-low font-bold"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                  >
                    <option value="fruitwine">果酒专区</option>
                    <option value="baijiu">白酒专区</option>
                    <option value="wine">红洋酒区</option>
                    <option value="beer">精酿啤酒</option>
                    <option value="accessories">酒具配件</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">SKU 条形码编号 *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="CZ-B-XXXX"
                    className="w-full p-2 border rounded bg-surface-low font-mono"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">单价/箱 *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="300"
                    className="w-full p-2 border rounded bg-surface-low font-mono"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">初始库存 *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="1000"
                    className="w-full p-2 border rounded bg-surface-low font-mono"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary block">起订量 MOQ *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="10"
                    className="w-full p-2 border rounded bg-surface-low font-mono"
                    value={newProdMoq}
                    onChange={(e) => setNewProdMoq(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <button
                type="button"
                className="py-2.5 bg-surface-low text-xs rounded-lg text-text-muted cursor-pointer"
                onClick={() => setShowAddProductModal(false)}
              >
                取消
              </button>
              <button
                type="submit"
                className="py-2.5 bg-brand-primary text-white font-bold text-xs rounded-lg shadow-md cursor-pointer"
              >
                立刻一键投放市场
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
