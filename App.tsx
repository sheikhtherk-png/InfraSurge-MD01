
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HealthCard from './components/HealthCard';
import { 
  MOCK_DOMAINS, 
  MOCK_MAILBOXES, 
  MOCK_METRICS 
} from './constants.tsx';
import { Domain, HealthStatus, Mailbox, Provider } from './types';
import { diagnoseDomainHealth } from './geminiService';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Bell, 
  Search, 
  FileText, 
  AlertTriangle, 
  Zap, 
  ArrowUpRight, 
  FlaskConical, 
  Thermometer,
  X,
  Activity,
  Stethoscope,
  ChevronDown,
  Trash2,
  MoreHorizontal,
  ClipboardCheck,
  CheckCircle2,
  Package,
  Globe,
  Plus,
  Mail,
  ShieldCheck,
  TrendingUp,
  History
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [domains, setDomains] = useState<Domain[]>(MOCK_DOMAINS);
  const [mailboxes, setMailboxes] = useState<Mailbox[]>(MOCK_MAILBOXES);
  const [selectedDomainIds, setSelectedDomainIds] = useState<Set<string>>(new Set());
  
  const [diagnosisDomain, setDiagnosisDomain] = useState<Domain | null>(null);
  const [diagnosisText, setDiagnosisText] = useState<string>('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  // Pharmacy State
  const [provisionDomain, setProvisionDomain] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const handleDiagnose = async (domain: Domain) => {
    setDiagnosisDomain(domain);
    setIsDiagnosing(true);
    setDiagnosisText('');
    
    const issues = [];
    if (!domain.spf) issues.push("SPF Record Missing");
    if (!domain.dkim) issues.push("DKIM Authentication Failed");
    if (!domain.dmarc) issues.push("DMARC Policy Weak");
    if (domain.healthScore < 80) issues.push("Low Reputation Score");
    if (!domain.forwarding) issues.push("Catch-all Forwarding Disabled");

    const result = await diagnoseDomainHealth(domain.name, issues);
    setDiagnosisText(result || 'No specific treatment required. Maintain monitoring.');
    setIsDiagnosing(false);
  };

  const handleProvision = () => {
    setIsCheckingAvailability(true);
    setTimeout(() => {
        const newId = (domains.length + 1).toString();
        const newDomain: Domain = {
            id: newId,
            name: provisionDomain,
            status: HealthStatus.HEALTHY,
            mailboxCount: 0,
            spf: true, dkim: true, dmarc: true,
            forwarding: true,
            healthScore: 100,
            lastChecked: 'Just now'
        };
        setDomains([newDomain, ...domains]);
        setProvisionDomain('');
        setIsCheckingAvailability(false);
        setActiveTab('domains');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? 'Infrastructure Triage' : 
               activeTab === 'domains' ? 'The Patient Ward' : 
               activeTab === 'mailboxes' ? 'ICU Monitoring' : 
               activeTab === 'pharmacy' ? 'The Pharmacy' :
               'Clinical View'}
            </h2>
            <p className="text-slate-500 text-sm">System health is 94% • 2 Domains in critical condition</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search patient records..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <button 
                onClick={() => setActiveTab('pharmacy')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              New Admission
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Infrastructure', value: domains.length + mailboxes.length, sub: 'Domains & Mailboxes', icon: FileText, color: 'indigo' },
                { label: 'Daily Delivery', value: '42.5k', sub: '8.2% vs yesterday', icon: ArrowUpRight, color: 'emerald', trend: 'up' },
                { label: 'Risk Level', value: 'High', sub: '2 patients critical', icon: AlertTriangle, color: 'rose' },
                { label: 'Avg Pulse', value: '98.2%', sub: 'Deliverability score', icon: Thermometer, color: 'blue' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-5 h-5 text-slate-600`} />
                  </div>
                  <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_METRICS}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dx={-10} />
                      <Tooltip />
                      <Area type="monotone" dataKey="deliverability" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white">
                <h3 className="font-bold mb-4">Urgent Operations</h3>
                <div className="space-y-3">
                  {domains.filter(d => d.healthScore < 50).map(d => (
                    <div key={d.id} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-bold">{d.name}</p>
                            <span className="text-[10px] bg-rose-500 px-2 py-0.5 rounded text-white font-bold">CRITICAL</span>
                        </div>
                        <button onClick={() => handleDiagnose(d)} className="text-xs text-rose-300 font-bold hover:text-white transition-colors flex items-center gap-1">
                            <Stethoscope className="w-3 h-3" />
                            Perform Diagnosis
                        </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {domains.map((domain) => (
                <HealthCard key={domain.id} domain={domain} onDiagnose={handleDiagnose} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pharmacy' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                    <Package className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Provision New Infrastructure</h3>
                                    <p className="text-slate-500">Secure healthy domains and clinical-grade mailboxes in one click.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Domain Name</label>
                                        <div className="relative">
                                            <Globe className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type="text" 
                                                value={provisionDomain}
                                                onChange={(e) => setProvisionDomain(e.target.value)}
                                                placeholder="e.g. outreach-expert.io"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Provider Selection</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="flex items-center gap-3 p-4 bg-white border-2 border-emerald-500 rounded-2xl">
                                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-[10px]">G</div>
                                                <span className="text-sm font-bold">Google</span>
                                            </button>
                                            <button className="flex items-center gap-3 p-4 bg-slate-50 border-2 border-transparent rounded-2xl hover:bg-slate-100 transition-colors">
                                                <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center text-slate-600 font-bold text-[10px]">M</div>
                                                <span className="text-sm font-bold">Microsoft</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                                                <Plus className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <p className="font-bold text-slate-700">Add Mailboxes</p>
                                        </div>
                                        <span className="text-xs text-slate-400">Up to 2 per domain recommended</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-400">user@domain.com</div>
                                        <button className="px-4 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold">Add</button>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleProvision}
                                    disabled={!provisionDomain || isCheckingAvailability}
                                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {isCheckingAvailability ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Clinical Verification in Progress...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5 fill-white" />
                                            Start Group Admission
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'mailboxes' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Avg Reputation', value: '94%', icon: TrendingUp, color: 'emerald' },
                        { label: 'Active Warmup', value: '12', icon: Activity, color: 'blue' },
                        { label: 'Total Volume', value: '1,420', icon: Mail, color: 'indigo' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Patient Mailbox</th>
                                <th className="px-8 py-5">Vitals (Reputation)</th>
                                <th className="px-8 py-5">Treatment (Warmup)</th>
                                <th className="px-8 py-5">Daily Intake</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mailboxes.map((mb) => (
                                <tr key={mb.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                                <Mail className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{mb.email}</p>
                                                <p className="text-xs text-slate-500">{mb.provider}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold">{mb.reputation}%</span>
                                            <div className="flex-1 w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div className={`h-full ${mb.reputation > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${mb.reputation}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border ${
                                            mb.warmupStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${mb.warmupStatus === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                            {mb.warmupStatus}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-slate-700">{mb.dailyVolume} / 50</p>
                                        <p className="text-[10px] text-slate-400">Avg daily send</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                                            <History className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </main>

      {/* Diagnosis Modal */}
      {diagnosisDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDiagnosisDomain(null)}></div>
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-500">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Clinical Diagnosis</h3>
                  <p className="text-sm text-slate-400">Analyzing: {diagnosisDomain.name}</p>
                </div>
              </div>
              <button onClick={() => setDiagnosisDomain(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              {isDiagnosing ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
                    <FlaskConical className="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-900">Scanning Infrastructure Vitals...</p>
                    <p className="text-sm text-slate-500">The Gemini Surgeon is reviewing DNS records and reputation data.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-3xl">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 mb-1">Surgeon's Findings</h4>
                      <div className="text-sm text-emerald-800 leading-relaxed whitespace-pre-line prose prose-emerald prose-sm max-w-none">
                        {diagnosisText}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Patient Health Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">{diagnosisDomain.healthScore ?? 85}%</span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Recommended Recovery Time</p>
                      <p className="text-lg font-bold text-slate-900">7-14 Days re-warming</p>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                        onClick={() => setDiagnosisDomain(null)}
                        className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                      Execute Surgical Plan
                    </button>
                    <button 
                      onClick={() => setDiagnosisDomain(null)}
                      className="px-8 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors active:scale-95"
                    >
                      Close Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
