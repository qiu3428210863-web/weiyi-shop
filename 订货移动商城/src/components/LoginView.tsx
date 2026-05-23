import React, { useState } from 'react';
import { WLogo } from './WLogo';
import { User, ShieldCheck, Warehouse, UserCheck, Key, ArrowRight, CornerDownRight, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginViewProps {
  onLoginSuccess: (role: 'wholesaler' | 'sales' | 'warehouse' | 'admin', name: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [userType, setUserType] = useState<'buyer' | 'supplier'>('buyer');
  const [supplierRole, setSupplierRole] = useState<'sales' | 'warehouse' | 'admin'>('sales');
  
  // Custom inputs
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePreFill = (roleKey: 'wholesaler' | 'sales' | 'warehouse' | 'admin') => {
    if (roleKey === 'wholesaler') {
      setUserType('buyer');
      setAccount('13816928842');
      setPassword('chen123456');
    } else {
      setUserType('supplier');
      setSupplierRole(roleKey);
      if (roleKey === 'sales') {
        setAccount('sales_officer');
        setPassword('sales888');
      } else if (roleKey === 'warehouse') {
        setAccount('warehouse_staff');
        setPassword('store321');
      } else if (roleKey === 'admin') {
        setAccount('super_admin');
        setPassword('admin999');
      }
    }
    setErrorMsg(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg('请勾选并阅读大宗协议交易与保税合规申明');
      return;
    }

    // Determine final logged in role
    const finalRole = userType === 'buyer' ? 'wholesaler' : supplierRole;
    let finalName = '';
    
    if (finalRole === 'wholesaler') {
      finalName = 'Marcus Chen (陈明)';
    } else if (finalRole === 'sales') {
      finalName = '王晓东 (业务经理)';
    } else if (finalRole === 'warehouse') {
      finalName = '刘铁柱 (仓储主管)';
    } else if (finalRole === 'admin') {
      finalName = '系统管理员 (最高权限)';
    }

    onLoginSuccess(finalRole, finalName);
  };

  return (
    <div className="min-h-screen bg-surface-bg text-text-primary flex flex-col justify-center py-10 px-4 max-w-lg mx-auto selection:bg-[#5c62b5]/15">
      
      {/* Container Card */}
      <div className="bg-surface-lowest rounded-2xl border border-surface-highest p-6 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Logo and Headings */}
        <div className="flex flex-col items-center text-center space-y-3.5 pb-2.5">
          <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center p-2.5">
            <WLogo className="w-10 h-10 text-brand-primary" color="brand" />
          </div>
          <div>
            <h2 className="font-sans text-base font-extrabold text-brand-primary tracking-tight">常州唯一产品订货平台</h2>
            <p className="text-[11px] text-text-muted mt-1 font-medium">常州白酒厂及特约大宗保税直供供应链系统</p>
          </div>
        </div>

        {/* User Type Selection Tab-Buttons (Wholesaler vs Supplier) */}
        <div className="space-y-1.5">
          <label className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider block">选择用户入口身份</label>
          <div className="grid grid-cols-2 gap-2 bg-surface-low p-1 rounded-xl border border-surface-highest">
            <button
              type="button"
              onClick={() => {
                setUserType('buyer');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                userType === 'buyer'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-text-muted hover:text-brand-primary'
              }`}
            >
              <User className="w-4 h-4" />
              <span>批发采购商</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUserType('supplier');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                userType === 'supplier'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-text-muted hover:text-brand-primary'
              }`}
            >
              <Warehouse className="w-4 h-4" />
              <span>供应方 / 工厂端</span>
            </button>
          </div>
        </div>

        {/* Conditional Role Section for Supplier Roles */}
        <AnimatePresence mode="wait">
          {userType === 'supplier' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-2 bg-[#5c62b5]/5 p-3 rounded-xl border border-[#5c62b5]/15 overflow-hidden"
            >
              <div className="flex items-center gap-1 text-[10.5px] font-bold text-brand-primary uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>选择具体供应端角色</span>
              </div>
              
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setSupplierRole('sales')}
                  className={`py-1.5 px-1 rounded text-[10.5px] font-bold transition-all flex flex-col items-center gap-1 border ${
                    supplierRole === 'sales'
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-text-primary border-surface-highest hover:bg-surface-low'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>酒厂业务员</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSupplierRole('warehouse')}
                  className={`py-1.5 px-1 rounded text-[10.5px] font-bold transition-all flex flex-col items-center gap-1 border ${
                    supplierRole === 'warehouse'
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-text-primary border-surface-highest hover:bg-surface-low'
                  }`}
                >
                  <Warehouse className="w-3.5 h-3.5" />
                  <span>仓库核单员</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSupplierRole('admin')}
                  className={`py-1.5 px-1 rounded text-[10.5px] font-bold transition-all flex flex-col items-center gap-1 border ${
                    supplierRole === 'admin'
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-text-primary border-surface-highest hover:bg-surface-low'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>供应端主管</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Login Form Fields */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3">
            {/* Account field */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider block">协议账户 / 员工工号</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  className="w-full h-11 bg-surface-low hover:bg-surface-lowest border border-surface-highest rounded-lg pl-9 pr-4 text-xs font-sans outline-none focus:border-brand-primary focus:bg-white transition-all"
                  placeholder={userType === 'buyer' ? "输入您的订货注册人手机号..." : "输入供应方工号 account..."}
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider block">安全密钥 / 私钥</label>
              <div className="relative flex items-center">
                <Key className="absolute left-3 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  required
                  className="w-full h-11 bg-surface-low hover:bg-surface-lowest border border-surface-highest rounded-lg pl-9 pr-4 text-xs font-sans outline-none focus:border-brand-primary focus:bg-white transition-all"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Privacy and Rules Declaration Checklist */}
          <div className="flex items-start gap-2 pt-1">
            <button
              type="button"
              onClick={() => setAgreeTerms(!agreeTerms)}
              className="flex-shrink-0 mt-0.5 hover:text-brand-primary transition-colors"
            >
              <div className={`w-4.5 h-4.5 rounded border transition-colors flex items-center justify-center ${
                agreeTerms ? 'bg-brand-primary text-white border-brand-primary' : 'border-surface-highest bg-white'
              }`}>
                {agreeTerms && <span className="text-[10px] font-bold">✓</span>}
              </div>
            </button>
            <span className="text-[10.5px] text-text-muted leading-relaxed select-none">
              我已阅读并自愿签署《<span className="text-brand-secondary font-bold hover:underline cursor-pointer">常州大宗提货合规契约</span>》及《<span className="text-brand-secondary font-bold hover:underline cursor-pointer">企业多仓调拨保密守则</span>》。
            </span>
          </div>

          {/* Dynamic submit action button */}
          <button
            type="submit"
            className="w-full h-12 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-colors cursor-pointer"
          >
            <span>安全验签并授权登录</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Sandbox Easy Access One-Click Demo Pre-fills Grid */}
        <div className="border-t border-surface-highest pt-4 space-y-2">
          <p className="text-[10px] font-mono text-center text-text-muted uppercase tracking-widest font-semibold">
            沙箱快捷通道 • 一键填入并登录体验
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                handlePreFill('wholesaler');
              }}
              className="py-2 px-2 border border-surface-highest bg-surface-low hover:bg-[#5c62b5]/5 hover:border-brand-primary/45 rounded-lg text-left text-[10.5px] transition-all flex flex-col gap-0.5 text-brand-primary cursor-pointer"
            >
              <span className="font-bold flex items-center gap-0.5">
                <CornerDownRight className="w-3 h-3 text-brand-secondary" />
                1. 批发采购商 [陈明]
              </span>
              <span className="text-[9px] text-text-muted font-mono leading-none">手机号登录/全部订货主控端</span>
            </button>

            <button
              onClick={() => {
                handlePreFill('sales');
              }}
              className="py-2 px-2 border border-surface-highest bg-surface-low hover:bg-[#5c62b5]/5 hover:border-brand-primary/45 rounded-lg text-left text-[10.5px] transition-all flex flex-col gap-0.5 text-brand-primary cursor-pointer"
            >
              <span className="font-bold flex items-center gap-0.5">
                <CornerDownRight className="w-3 h-3 text-brand-secondary" />
                2. 供应方-酒厂业务员
              </span>
              <span className="text-[9px] text-text-muted font-mono leading-none">处理大账、确认及退改款订单</span>
            </button>

            <button
              onClick={() => {
                handlePreFill('warehouse');
              }}
              className="py-2 px-2 border border-surface-highest bg-surface-low hover:bg-[#5c62b5]/5 hover:border-brand-primary/45 rounded-lg text-left text-[10.5px] transition-all flex flex-col gap-0.5 text-brand-primary cursor-pointer"
            >
              <span className="font-bold flex items-center gap-0.5">
                <CornerDownRight className="w-3 h-3 text-brand-secondary" />
                3. 供应方-仓库核单
              </span>
              <span className="text-[9px] text-text-muted font-mono leading-none">扫描/核单，提运车辆、物流出库</span>
            </button>

            <button
              onClick={() => {
                handlePreFill('admin');
              }}
              className="py-2 px-2 border border-surface-highest bg-surface-low hover:bg-[#5c62b5]/5 hover:border-brand-primary/45 rounded-lg text-left text-[10.5px] transition-all flex flex-col gap-0.5 text-brand-primary cursor-pointer"
            >
              <span className="font-bold flex items-center gap-0.5">
                <CornerDownRight className="w-3 h-3 text-brand-secondary" />
                4. 供应方-超级管理员
              </span>
              <span className="text-[9px] text-text-muted font-mono leading-none">配置价格库存/多维D3经营看板</span>
            </button>
          </div>
        </div>

      </div>

      <div className="text-center text-[10px] text-text-muted mt-5">
        常州保税仓调货系统已由国家互联网交易保障中心进行了SSL端到端物理签名校验。
      </div>
    </div>
  );
};
