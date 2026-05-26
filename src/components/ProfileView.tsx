import React, { useState } from 'react';
import { ShippingAddress, SupportMessage } from '../types';
import { 
  Building, MapPin, Mail,
  Settings, LogOut, ChevronRight, HelpCircle,
  Send, User, ShieldCheck, Check, Plus, Trash2, Wallet
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
}) => {
  const [activeSubPage, setActiveSubPage] = useState<'profile' | 'enterprise' | 'addresses' | 'chats' | 'settings'>('profile');
  const [typedMessage, setTypedMessage] = useState('');
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

  return (
    <div className="bg-surface-bg min-h-screen text-text-primary pb-24">
      {/* Dynamic Subpages renderers */}

      {/* 1. Chats Window Subpage */}
      {activeSubPage === 'chats' && (
        <div className="fixed inset-0 bg-surface-bg z-50 flex flex-col">
          <header className="flex justify-between items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest">
            <button 
              onClick={() => setActiveSubPage('profile')} 
              className="text-xs text-brand-secondary font-bold"
            >
              返回个人中心
            </button>
            <h2 className="text-sm font-bold font-sans">企业分销消息中心</h2>
            <HelpCircle className="w-4 h-4 text-text-muted" />
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
          <header className="flex justify-between items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest sticky top-0 z-30">
            <button 
              onClick={() => setActiveSubPage('profile')} 
              className="text-xs text-brand-secondary font-bold"
            >
              返回个人中心
            </button>
            <h2 className="text-sm font-bold font-sans">收货网点地址簿</h2>
            <button 
              onClick={() => setShowAddressCreator((prev) => !prev)}
              className="text-[10px] bg-brand-secondary text-white px-2.5 py-1 rounded font-bold"
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
          <header className="flex justify-between items-center px-4 h-14 bg-surface-lowest border-b border-surface-highest sticky top-0">
            <button 
              onClick={() => setActiveSubPage('profile')} 
              className="text-xs text-brand-secondary font-bold"
            >
              返回个人中心
            </button>
            <h2 className="text-sm font-bold font-sans">系统参数设置</h2>
            <Settings className="w-4 h-4 text-brand-primary" />
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
            <section className="px-4 py-4 grid grid-cols-2 gap-3">
              <div className="bg-surface-low p-4 rounded-xl border border-surface-highest flex flex-col justify-between h-28">
                <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-hanken text-lg font-bold text-brand-primary">12</p>
                  <p className="font-serif text-[10.5px] text-text-muted mt-0.5">进行中订单</p>
                </div>
              </div>
              
              <div className="bg-surface-low p-4 rounded-xl border border-surface-highest flex flex-col justify-between h-28">
                <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-brand-primary">¥{userCreditLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="font-serif text-[10.5px] text-text-muted mt-0.5">信用额度</p>
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
