import React, { useState, useMemo } from 'react';
import { Order, Product, ShippingAddress, SupportMessage } from '../types';
import {
  Building, MapPin, Mail,
  Settings, LogOut, ChevronRight, HelpCircle,
  Send, User, ShieldCheck, Check, Plus, Trash2, Wallet,
  AlertCircle, Clock, CreditCard, ClipboardCheck
} from 'lucide-react';
import { WLogo } from './WLogo';

interface ProfileViewProps {
  addresses: ShippingAddress[];
  onAddAddress: (newAddr: ShippingAddress) => void;
  onSetDefaultAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void;
  supportChats: SupportMessage[];
  onAddSupportMessage: (text: string) => void;
  userCreditLimit: number;
  onLogout?: () => void;
  orders: Order[];
  products: Product[];
  creditPeriodDays: number;
  onSettleOrder: (orderId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  addresses,
  onAddAddress,
  onSetDefaultAddress,
  onDeleteAddress,
  supportChats,
  onAddSupportMessage,
  userCreditLimit,
  onLogout,
  orders,
  products,
  creditPeriodDays,
  onSettleOrder,
}) => {
  const [activeSubPage, setActiveSubPage] = useState<'profile' | 'enterprise' | 'addresses' | 'chats' | 'settings' | 'payment'>('profile');
  const [typedMessage, setTypedMessage] = useState('');
  const [showOverduePopup, setShowOverduePopup] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Addresses forms inputs controllers
  const [addressRecipient, setAddressRecipient] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressProvince, setAddressProvince] = useState('江苏省');
  const [addressCity, setAddressCity] = useState('常州市');
  const [addressDistrict, setAddressDistrict] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [showAddressCreator, setShowAddressCreator] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  const submitAddressCreator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressRecipient || !addressPhone || !addressDetail) {
      showToast('请完整填写必填的收件人、联系电话及门牌层库室');
      return;
    }
    const newAddr: ShippingAddress = {
      id: `addr-${Date.now()}`,
      recipient: addressRecipient,
      phone: addressPhone,
      province: addressProvince,
      city: addressCity,
      district: addressDistrict || '新北区',
      detail: addressDetail,
      isDefault: addresses.length === 0, // Default if first address
    };
    onAddAddress(newAddr);
    showToast('已增加企业优势调至物流中心新网点');
    // Clear details
    setAddressRecipient('');
    setAddressPhone('');
    setAddressDetail('');
    setAddressDistrict('');
    setShowAddressCreator(false);
  };

  const submitSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    onAddSupportMessage(typedMessage.trim());
    setTypedMessage('');
    // Auto-reply simulation
    setTimeout(() => {
      onAddSupportMessage('【自动回复】您的消息已进入专属客户经理处理通道。当前提货繁忙度正常，我们的平均处理时常为2分钟。');
    }, 1200);
  };

  const triggerLogoutMock = () => {
    showToast('已安全清除本次企业采购授权缓存，可在下次提货重填登录。');
    if (onLogout) {
      setTimeout(() => {
        onLogout();
      }, 1000);
    }
  };

  // 账期计算逻辑
  const getCreditStatus = (order: Order) => {
    if (order.status === 'completed') return { type: 'settled' as const };
    const created = new Date(order.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = creditPeriodDays - diffDays;
    if (daysRemaining < 0) return { type: 'overdue' as const, daysOverdue: Math.abs(daysRemaining) };
    if (daysRemaining <= 3) return { type: 'expiring' as const, daysRemaining };
    return { type: 'normal' as const, daysRemaining };
  };

  const unsettledOrders = useMemo(() => orders.filter(o => o.status !== 'completed'), [orders]);
  const outstandingBalance = useMemo(
    () => unsettledOrders.reduce((sum, o) => sum + o.totalPrice, 0),
    [unsettledOrders]
  );
  const hasOverdueOrders = useMemo(
    () => unsettledOrders.some(o => getCreditStatus(o).type === 'overdue'),
    [unsettledOrders, creditPeriodDays]
  );

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const navigateToPayment = () => {
    setActiveSubPage('payment');
    // 检查是否有逾期订单，有则弹出提醒
    const overdueExists = unsettledOrders.some(o => {
      if (o.status === 'completed') return false;
      const created = new Date(o.createdAt);
      const diffDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > creditPeriodDays;
    });
    if (overdueExists) {
      setTimeout(() => setShowOverduePopup(true), 500);
    }
  };

  const handleSettleWithAnimation = (orderIds: string[], message: string) => {
    if (isSettling) return;
    setIsSettling(true);
    setTimeout(() => {
      orderIds.forEach(id => onSettleOrder(id));
      setIsSettling(false);
      setShowOverduePopup(false);
      showToast(message);
    }, 1200);
  };

  return (
    <div className="bg-surface-bg min-h-screen text-text-primary pb-24">
      {/* Dynamic Subpages renderers */}

      {/* 1. Chats Window Subpage */}
      {activeSubPage === 'chats' && (
        <div className="fixed inset-0 bg-surface-bg z-50 flex flex-col">
          <header className="grid grid-cols-3 items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest">
            <button
              onClick={() => setActiveSubPage('profile')}
              className="text-xs text-brand-secondary font-bold justify-self-start"
            >
              返回
            </button>
            <h2 className="text-sm font-bold font-sans text-center">企业分销消息中心</h2>
            <HelpCircle className="w-4 h-4 text-text-muted justify-self-end" />
          </header>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {supportChats.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] rounded-xl p-3.5 ${
                  msg.sender === 'user' 
                    ? 'bg-brand-primary text-white ml-auto rounded-tr-none' 
                    : 'bg-surface-lowest text-brand-primary mr-auto border border-surface-highest rounded-tl-none'
                }`}
              >
                <div className="text-[10px] opacity-75 font-mono mb-1">
                  {msg.sender === 'user' ? '企业主 李远' : '常州果酒厂专属客服'} • {msg.timestamp}
                </div>
                <p className="text-xs leading-relaxed font-sans">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={submitSupportMessage} className="p-3 bg-surface-lowest border-t border-surface-highest flex gap-2">
            <input 
              type="text" 
              className="flex-grow bg-surface-low border border-surface-highest rounded-lg px-4.5 py-2 font-sans text-xs outline-none focus:border-brand-primary focus:bg-surface-lowest transition-all"
              placeholder="编写您想向常州果酒厂财务或物流反应的问题..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
            />
            <button 
              type="submit" 
              className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center hover:bg-brand-secondary transition-colors"
              title="发送"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 2. Addresses Management Subpage */}
      {activeSubPage === 'addresses' && (
        <div className="fixed inset-0 bg-surface-bg z-50 overflow-y-auto">
          <header className="grid grid-cols-3 items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest sticky top-0 z-30">
            <button
              onClick={() => setActiveSubPage('profile')}
              className="text-xs text-brand-secondary font-bold justify-self-start"
            >
              返回
            </button>
            <h2 className="text-sm font-bold font-sans text-center">收货网点地址簿</h2>
            <button
              onClick={() => setShowAddressCreator((prev) => !prev)}
              className="text-[10px] bg-brand-secondary text-white px-2.5 py-1 rounded font-bold justify-self-end"
            >
              {showAddressCreator ? '取消' : '添加网点'}
            </button>
          </header>

          <main className="p-4 max-w-sm mx-auto space-y-4 pb-20">
            {toastMsg && (
              <div className="bg-brand-primary text-white text-xs px-4 py-2.5 rounded shadow text-center ml-auto">
                {toastMsg}
              </div>
            )}

            {/* Address Creator section */}
            {showAddressCreator && (
              <form onSubmit={submitAddressCreator} className="bg-surface-lowest p-4 rounded-xl border border-surface-highest space-y-3.5 shadow-sm">
                <h3 className="text-xs font-bold font-sans border-b pb-1.5 text-brand-primary">创建新的企业集散中心</h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted font-bold block">收货人 / 仓储主管拼名 *</label>
                  <input 
                    type="text" 
                    className="w-full text-xs font-sans p-2 border border-surface-highest rounded bg-surface-low"
                    placeholder="例如：陈明 (新北仓库)"
                    value={addressRecipient}
                    onChange={(e) => setAddressRecipient(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted font-bold block">联系电话 *</label>
                  <input 
                    type="text" 
                    className="w-full text-xs font-sans p-2 border border-surface-highest rounded bg-surface-low"
                    placeholder="例如：13816928842"
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted font-bold block">省份/直辖市</label>
                    <input 
                      type="text" 
                      className="w-full text-xs font-sans p-2 border border-surface-highest rounded bg-surface-low"
                      value={addressProvince}
                      onChange={(e) => setAddressProvince(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted font-bold block">市区</label>
                    <input 
                      type="text" 
                      className="w-full text-xs font-sans p-2 border border-surface-highest rounded bg-surface-low"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted font-bold block">街道 / 县区</label>
                  <input 
                    type="text" 
                    className="w-full text-xs font-sans p-2 border border-surface-highest rounded bg-surface-low"
                    placeholder="新北区 / 钟楼区"
                    value={addressDistrict}
                    onChange={(e) => setAddressDistrict(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted font-bold block">门牌详情与仓位 *</label>
                  <textarea 
                    className="w-full text-xs font-sans p-2 border border-surface-highest rounded bg-surface-low h-16 resize-none"
                    placeholder="请尽量描写仓库号、货架网位，例太湖东路大宗果酒1号仓库门面"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full h-11 bg-brand-primary text-white font-sans text-xs font-bold rounded-lg"
                >
                  添加至地址簿
                </button>
              </form>
            )}

            {/* Address items listing */}
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div 
                  key={addr.id}
                  className={`bg-surface-lowest border rounded-xl p-4 space-y-3 transition-colors ${
                    addr.isDefault ? 'border-brand-primary shadow-sm' : 'border-surface-highest'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-brand-primary">{addr.recipient}</h4>
                      <p className="text-xs text-text-muted mt-1 font-mono">{addr.phone}</p>
                    </div>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 bg-brand-primary text-white text-[8px] font-mono rounded font-bold uppercase tracking-wider">
                        默认提货点
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-text-muted leading-relaxed font-sans bg-surface-low/50 p-2 rounded border border-surface-low">
                    {addr.province}{addr.city}{addr.district}{addr.detail}
                  </p>

                  <div className="pt-2 border-t border-surface-low flex justify-between items-center text-xs">
                    {!addr.isDefault ? (
                      <button 
                        onClick={() => {
                          onSetDefaultAddress(addr.id);
                          showToast('默认仓配集货地址已更新');
                        }}
                        className="text-[10px] text-brand-secondary font-bold underline"
                      >
                        设为默认
                      </button>
                    ) : (
                      <span className="text-[10px] text-text-muted flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        默认选中
                      </span>
                    )}

                    <button 
                      onClick={() => {
                        onDeleteAddress(addr.id);
                        showToast('地址已从地址簿移除');
                      }}
                      className="text-text-muted hover:text-brand-error flex items-center gap-1"
                      title="删除地址"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">删除</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* 4. Settings Dashboard Settings panel */}
      {activeSubPage === 'settings' && (
        <div className="fixed inset-0 bg-surface-bg z-50 overflow-y-auto">
          <header className="grid grid-cols-3 items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest sticky top-0">
            <button
              onClick={() => setActiveSubPage('profile')}
              className="text-xs text-brand-secondary font-bold justify-self-start"
            >
              返回
            </button>
            <h2 className="text-sm font-bold font-sans text-center">系统参数设置</h2>
            <Settings className="w-4 h-4 text-brand-primary justify-self-end" />
          </header>

          <main className="p-4 max-w-sm mx-auto space-y-4">
            <div className="bg-surface-lowest p-4 rounded-xl border border-surface-highest space-y-4 shadow-sm text-xs select-none">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-brand-primary">极速离线数据缓存</h3>
                  <p className="text-[10.5px] text-text-muted mt-0.5">提早缓存大片图片以在地下室信号差时正常运作</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded text-brand-primary cursor-pointer border-surface-highest" />
              </div>
              
              <div className="flex justify-between items-center border-t pt-3">
                <div>
                  <h3 className="font-bold text-brand-primary">价格降价专属推送</h3>
                  <p className="text-[10.5px] text-text-muted mt-0.5">当关注的常州系列产品大单出现优惠时下发短信</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded text-brand-primary cursor-pointer border-surface-highest" />
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <div>
                  <h3 className="font-bold text-brand-primary">出入库消息同步 (DOCK-19)</h3>
                  <p className="text-[10.5px] text-text-muted mt-0.5">订单从仓库发货时将提单PDF发送给物流部</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded text-brand-primary cursor-pointer border-surface-highest" />
              </div>
            </div>

          </main>
        </div>
      )}

      {/* 5. Payment Management Subpage */}
      {activeSubPage === 'payment' && (
        <div className="fixed inset-0 bg-surface-bg z-50 overflow-y-auto">
          <header className="grid grid-cols-3 items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest sticky top-0 z-30">
            <button
              onClick={() => { setActiveSubPage('profile'); setShowOverduePopup(false); }}
              className="text-xs text-brand-secondary font-bold justify-self-start"
            >
              返回
            </button>
            <h2 className="text-sm font-bold font-sans text-center">我的支付</h2>
            <div className="w-10 justify-self-end" />
          </header>

          <main className="p-4 max-w-sm mx-auto space-y-4 pb-24">
            {/* 逾期弹窗 */}
            {showOverduePopup && (
              <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-6 backdrop-blur-sm">
                <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-7 h-7 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-primary">账期逾期提醒</h3>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                      您有以下订单已超过 <strong className="text-red-500">{creditPeriodDays}天</strong> 账期，请尽快结算以避免影响您的信用额度。
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 space-y-1.5 text-left max-h-32 overflow-y-auto">
                    {unsettledOrders.filter(o => getCreditStatus(o).type === 'overdue').map(o => {
                      const status = getCreditStatus(o) as { type: 'overdue'; daysOverdue: number };
                      return (
                        <div key={o.id} className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-brand-primary">{o.code}</span>
                          <span className="text-red-500 font-bold">逾期 {status.daysOverdue} 天</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setShowOverduePopup(false)}
                      className="flex-1 py-2.5 bg-surface-low hover:bg-surface-highest text-xs font-bold rounded-xl text-text-muted cursor-pointer transition-colors"
                    >
                      我知道了
                    </button>
                    <button
                      onClick={() => handleSettleWithAnimation(
                        unsettledOrders.filter(o => getCreditStatus(o).type === 'overdue').map(o => o.id),
                        '逾期订单已结算'
                      )}
                      disabled={isSettling}
                      className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-secondary disabled:opacity-60 text-white text-xs font-bold rounded-xl cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      {isSettling ? '结算中...' : '立即结算'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 结算加载动画 */}
            {isSettling && (
              <div className="fixed inset-0 bg-black/40 z-[65] flex items-center justify-center backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[200px]">
                  <svg className="animate-spin w-10 h-10 text-brand-secondary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm font-bold text-brand-primary">正在结算...</p>
                  <p className="text-[10px] text-text-muted">请稍候，信用额度即将恢复</p>
                </div>
              </div>
            )}

            {/* 支付概览卡片 */}
            <div className="bg-gradient-to-br from-brand-primary to-[#7c82d0] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5">
                <CreditCard className="w-36 h-36 -translate-y-6 translate-x-8" />
              </div>
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] text-white/70 font-mono uppercase tracking-widest">待结算总额</p>
                <p className="font-mono text-2xl font-bold">
                  ¥{outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-white/20 text-[10px] text-white/80">
                  <span>信用额度: ¥{userCreditLimit.toLocaleString()}</span>
                  <span>账期: {creditPeriodDays}天</span>
                </div>
              </div>
              {unsettledOrders.length > 0 && (
                <button
                  onClick={() => handleSettleWithAnimation(
                    unsettledOrders.map(o => o.id),
                    '已结算全部未付订单，信用额度已恢复'
                  )}
                  disabled={isSettling}
                  className="w-full mt-3 py-2.5 bg-white/20 hover:bg-white/30 disabled:opacity-60 text-white text-xs font-bold rounded-xl cursor-pointer disabled:cursor-not-allowed transition-all border border-white/20"
                >
                  {isSettling ? '结算中...' : `一键结算全部 ¥${outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </button>
              )}
            </div>

            {/* 未结订单列表 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  未结算订单 ({unsettledOrders.length})
                </h3>
              </div>
              <div className="space-y-3 pt-2">
                {unsettledOrders.length === 0 ? (
                  <div className="bg-surface-lowest p-8 rounded-xl border border-surface-highest text-center space-y-2">
                    <Check className="w-8 h-8 text-green-500 mx-auto bg-green-50 p-1.5 rounded-full" />
                    <p className="text-xs font-bold text-brand-primary">全部已结算</p>
                    <p className="text-[10px] text-text-muted">暂无未结清的订单</p>
                  </div>
                ) : (
                  unsettledOrders.map((ord) => {
                    const creditStatus = getCreditStatus(ord);
                    return (
                      <div
                        key={ord.id}
                        className={`bg-surface-lowest border rounded-xl p-4 space-y-3 transition-all ${
                          creditStatus.type === 'overdue' ? 'border-red-200 bg-red-50/20' :
                          creditStatus.type === 'expiring' ? 'border-yellow-200 bg-yellow-50/10' :
                          'border-surface-highest'
                        }`}
                      >
                        {/* 订单头部 */}
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs font-extrabold text-brand-primary">{ord.code}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            creditStatus.type === 'overdue' ? 'bg-red-100 text-red-600' :
                            creditStatus.type === 'expiring' ? 'bg-yellow-100 text-yellow-600' :
                            creditStatus.type === 'settled' ? 'bg-green-100 text-green-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {creditStatus.type === 'overdue' ? `逾期 ${creditStatus.daysOverdue} 天` :
                             creditStatus.type === 'expiring' ? `剩 ${creditStatus.daysRemaining} 天` :
                             creditStatus.type === 'settled' ? '已结算' :
                             `剩 ${creditStatus.daysRemaining} 天`}
                          </span>
                        </div>

                        {/* 订单商品 */}
                        <div className="space-y-1">
                          {ord.items.map((itm, idx) => {
                            const p = products.find(x => x.id === itm.productId);
                            return (
                              <div key={idx} className="flex justify-between text-xs font-sans">
                                <span className="text-text-muted line-clamp-1 flex-grow">
                                  {p ? p.name : itm.productId} ×{itm.quantity}箱
                                </span>
                                <span className="font-mono font-bold text-brand-primary ml-2">
                                  ¥{(itm.priceAtPurchase * itm.quantity).toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* 底部信息 */}
                        <div className="flex justify-between items-center bg-surface-low p-2.5 rounded-lg text-xs">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-text-muted" />
                            <span className="text-[10px] text-text-muted font-mono">
                              下单: {formatDate(ord.createdAt)}
                            </span>
                          </div>
                          <span className="font-bold text-brand-secondary">
                            ¥{ord.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                          </span>
                        </div>

                        {/* 过期进度条 */}
                        {creditStatus.type !== 'settled' && (
                          <div className="space-y-1">
                            <div className="w-full h-1.5 bg-surface-low rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  creditStatus.type === 'overdue' ? 'bg-red-500 w-full' :
                                  creditStatus.type === 'expiring' ? 'bg-yellow-500' :
                                  'bg-brand-secondary'
                                }`}
                                style={{
                                  width: creditStatus.type === 'overdue' ? '100%' :
                                    `${((creditPeriodDays - (creditStatus as any).daysRemaining) / creditPeriodDays) * 100}%`
                                }}
                              />
                            </div>
                            <p className="text-[9px] text-text-muted font-mono text-right">
                              {creditStatus.type === 'overdue'
                                ? `已超期 ${(creditStatus as any).daysOverdue} 天`
                                : `剩余 ${(creditStatus as any).daysRemaining} 天 / 共 ${creditPeriodDays} 天`}
                            </p>
                          </div>
                        )}

                        {/* 结算按钮 */}
                        <button
                          onClick={() => handleSettleWithAnimation(
                            [ord.id],
                            `订单 ${ord.code} 已结算，信用额度已恢复`
                          )}
                          disabled={isSettling}
                          className="w-full py-2.5 bg-brand-secondary hover:bg-brand-primary disabled:opacity-60 text-white text-[10.5px] font-bold rounded-xl cursor-pointer disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
                        >
                          {isSettling ? (
                            <>
                              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              <span>结算中...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>立即结算 ¥{ord.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 1 })}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Normal Main Center View */}
      {activeSubPage === 'profile' && (
        <>
          {/* TopAppBar */}
          <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest">
            <div className="flex items-center gap-2">
              <WLogo className="w-6 h-6 text-brand-secondary" />
              <h1 className="font-sans text-xs font-bold text-brand-primary">常州唯一产品订货平台</h1>
            </div>
          </header>

          <main className="pt-14 pb-20">
            {toastMsg && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-primary text-white text-xs px-4 py-2 rounded shadow-lg text-center">
                {toastMsg}
              </div>
            )}

            {/* Profile Header Block */}
            <section className="px-4 py-6 bg-surface-lowest border-b border-surface-highest">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden border border-surface-highest">
                    {/* Placeholder matching business man avatar */}
                    <div className="w-full h-full bg-brand-primary text-white flex items-center justify-center text-lg font-bold font-mono">
                      MC
                    </div>
                  </div>
                </div>

                {/* Highly structured Business Card matching layout exactly */}
                <div className="bg-brand-primary text-white p-5 rounded-xl flex flex-col gap-4.5 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-5 -translate-y-4 translate-x-4">
                    <Building className="w-48 h-48" />
                  </div>

                  <div className="flex justify-between items-start z-10">
                    <div>
                      <p className="font-mono text-[9px] text-white/70 uppercase tracking-widest mb-0.5">企业名称</p>
                      <p className="font-sans text-sm font-bold">高鑫零售有限公司</p>
                    </div>
                    <span className="text-brand-secondary fill-brand-secondary text-white">
                      <ShieldCheck className="w-5 h-5 fill-brand-secondary text-brand-primary" />
                    </span>
                  </div>

                  <div className="flex gap-12 mt-1 z-10 text-xs">
                    <div>
                      <p className="font-mono text-[9px] text-white/70 uppercase tracking-widest mb-0.5">联系人</p>
                      <p className="font-sans font-bold text-xs">李远</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] text-white/70 uppercase tracking-widest mb-0.5">客户ID</p>
                      <p className="font-mono font-bold text-xs">LX-88204-BC</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Overview boxes layout exactly */}
            <section className="px-4 py-4 grid grid-cols-3 gap-2">
              <div className="bg-surface-low p-3 rounded-xl border border-surface-highest flex flex-col justify-between h-24">
                <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-hanken text-sm font-bold text-brand-primary">{unsettledOrders.length}</p>
                  <p className="font-serif text-[9px] text-text-muted mt-0.5">未结订单</p>
                </div>
              </div>

              <div className="bg-surface-low p-3 rounded-xl border border-surface-highest flex flex-col justify-between h-24">
                <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold text-brand-primary">¥{userCreditLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="font-serif text-[9px] text-text-muted mt-0.5">信用额度</p>
                </div>
              </div>

              <div className="bg-surface-low p-3 rounded-xl border border-surface-highest flex flex-col justify-between h-24 cursor-pointer hover:bg-surface-highest/20 transition-colors"
                onClick={navigateToPayment}
              >
                <div className="w-7 h-7 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold text-brand-secondary">
                    ¥{outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="font-serif text-[9px] text-text-muted mt-0.5">
                    待结算 {hasOverdueOrders ? '(逾期!)' : ''}
                  </p>
                </div>
              </div>
            </section>

            {/* Options list exactly matching outline design layout */}
            <section className="px-4 mt-1.5">
              <div className="bg-surface-lowest rounded-xl border border-surface-highest overflow-hidden divide-y divide-surface-low">
                {/* Shipping Addresses */}
                <button 
                  onClick={() => setActiveSubPage('addresses')}
                  className="w-full flex items-center justify-between px-4.5 py-4 hover:bg-surface-low transition-colors group active:bg-surface-container"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-low flex items-center justify-center text-brand-primary border border-surface-highest/60">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-brand-primary">收货网点地址</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Message Center */}
                <button 
                  onClick={() => setActiveSubPage('chats')}
                  className="w-full flex items-center justify-between px-4.5 py-4 hover:bg-surface-low transition-colors group active:bg-surface-container"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-low flex items-center justify-center text-brand-primary relative border border-surface-highest/60">
                      <Mail className="w-4.5 h-4.5" />
                      <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-brand-secondary rounded-full border border-surface-lowest"></span>
                    </div>
                    <span className="text-xs font-bold text-brand-primary">平台消息中心</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Payment */}
                <button
                  onClick={navigateToPayment}
                  className="w-full flex items-center justify-between px-4.5 py-4 hover:bg-surface-low transition-colors group active:bg-surface-container"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-low flex items-center justify-center text-brand-primary border border-surface-highest/60 relative">
                      <Wallet className="w-4.5 h-4.5" />
                      {hasOverdueOrders && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border border-surface-lowest"></span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-brand-primary">我的支付</span>
                      {hasOverdueOrders && (
                        <span className="text-[9px] text-red-500 font-bold">有逾期账单!</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Settings */}
                <button
                  onClick={() => setActiveSubPage('settings')}
                  className="w-full flex items-center justify-between px-4.5 py-4 hover:bg-surface-low transition-colors group active:bg-surface-container"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-low flex items-center justify-center text-brand-primary border border-surface-highest/60">
                      <Settings className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-brand-primary">通用参数设置</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>

            {/* Logout control button block */}
            <div className="px-4 mt-8">
              <button 
                onClick={triggerLogoutMock}
                className="w-full py-3.5 rounded-lg border border-brand-error text-brand-error font-sans text-xs font-bold flex items-center justify-center gap-2 hover:bg-brand-error-container/20 transition-colors active:scale-[0.98]"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>退出登录</span>
              </button>

            </div>
          </main>
        </>
      )}
    </div>
  );
};
