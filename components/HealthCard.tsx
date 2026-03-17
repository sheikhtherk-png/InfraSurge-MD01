
import React from 'react';
import { Domain, HealthStatus } from '../types';
import { CheckCircle2, AlertCircle, Zap, ShieldCheck, Activity } from 'lucide-react';

interface HealthCardProps {
  domain: Domain;
  onDiagnose: (domain: Domain) => void;
}

const HealthCard: React.FC<HealthCardProps> = ({ domain, onDiagnose }) => {
  const getStatusStyles = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case HealthStatus.STABLE: return 'bg-blue-50 text-blue-700 border-blue-200';
      case HealthStatus.CRITICAL: return 'bg-amber-50 text-amber-700 border-amber-200';
      case HealthStatus.SURGERY_REQUIRED:
      case HealthStatus.INFECTED: return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY: return <CheckCircle2 className="w-4 h-4" />;
      case HealthStatus.CRITICAL: return <AlertCircle className="w-4 h-4" />;
      case HealthStatus.SURGERY_REQUIRED: return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col gap-4 group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{domain.name}</h3>
          <p className="text-xs text-slate-500">Patient ID: {domain.id.padStart(4, '0')}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${getStatusStyles(domain.status)}`}>
          {getStatusIcon(domain.status)}
          {domain.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Vitals Check</span>
          </div>
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${domain.spf ? 'bg-emerald-500' : 'bg-slate-300'}`} title="SPF"></div>
            <div className={`w-2 h-2 rounded-full ${domain.dkim ? 'bg-emerald-500' : 'bg-slate-300'}`} title="DKIM"></div>
            <div className={`w-2 h-2 rounded-full ${domain.dmarc ? 'bg-emerald-500' : 'bg-slate-300'}`} title="DMARC"></div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Activity className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Heart Rate</span>
          </div>
          <p className="text-sm font-bold text-slate-700">{domain.healthScore}%</p>
        </div>
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">Active Mailboxes</span>
          <span className="font-semibold text-slate-700">{domain.mailboxCount}</span>
        </div>
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${domain.healthScore > 80 ? 'bg-emerald-500' : domain.healthScore > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
            style={{ width: `${domain.healthScore}%` }}
          ></div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-auto flex gap-2">
        <button 
          onClick={() => onDiagnose(domain)}
          className="flex-1 text-xs font-bold py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          Diagnosis
        </button>
        <button className="flex-1 text-xs font-bold py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          Surgeries
        </button>
      </div>
    </div>
  );
};

export default HealthCard;
