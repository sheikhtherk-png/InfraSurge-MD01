
import React from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Mail, 
  Settings, 
  Stethoscope, 
  Package, 
  HeartPulse,
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Triage Center', icon: Activity },
    { id: 'domains', label: 'The Ward (Domains)', icon: ShieldAlert },
    { id: 'mailboxes', label: 'ICU (Mailboxes)', icon: Mail },
    { id: 'pharmacy', label: 'Pharmacy (Provision)', icon: Package },
    { id: 'surgery', label: 'Surgical Suite', icon: Stethoscope },
    { id: 'health', label: 'Vitals & Stats', icon: HeartPulse },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">InfraSurge</h1>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-emerald-400">Medical Infrastructure</p>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg p-4 flex flex-col gap-2 transition-colors border border-slate-700">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold text-slate-400">PATIENT QUOTA</span>
            <PlusCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-2/3"></div>
          </div>
          <p className="text-[10px] text-slate-400">12 / 20 Active Domains</p>
        </button>
      </div>

      <div className="p-6 border-t border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white/10"></div>
        <div>
          <p className="text-sm font-semibold text-white">Chief Surgeon</p>
          <p className="text-[10px] text-slate-500">Administrator</p>
        </div>
        <Settings className="w-4 h-4 ml-auto text-slate-500 cursor-pointer hover:text-white" />
      </div>
    </div>
  );
};

export default Sidebar;
