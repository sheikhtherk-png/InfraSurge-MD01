
import { Domain, HealthStatus, Mailbox, MetricData, Provider } from './types';

export const MOCK_DOMAINS: Domain[] = [
  { id: '1', name: 'outreach-md.com', status: HealthStatus.HEALTHY, mailboxCount: 5, spf: true, dkim: true, dmarc: true, forwarding: true, healthScore: 98, lastChecked: '2 mins ago' },
  { id: '2', name: 'sender-clinic.io', status: HealthStatus.STABLE, mailboxCount: 3, spf: true, dkim: true, dmarc: true, forwarding: false, healthScore: 82, lastChecked: '15 mins ago' },
  { id: '3', name: 'inbox-vitality.net', status: HealthStatus.CRITICAL, mailboxCount: 2, spf: true, dkim: false, dmarc: false, forwarding: true, healthScore: 45, lastChecked: '1 hour ago' },
  { id: '4', name: 'rep-recovery.org', status: HealthStatus.SURGERY_REQUIRED, mailboxCount: 0, spf: false, dkim: false, dmarc: false, forwarding: false, healthScore: 12, lastChecked: 'Just now' },
];

export const MOCK_MAILBOXES: Mailbox[] = [
  { id: 'm1', email: 'dr.john@outreach-md.com', domainId: '1', provider: Provider.GOOGLE_WORKSPACE, dailyVolume: 45, warmupStatus: 'Active', reputation: 99 },
  { id: 'm2', email: 'support@outreach-md.com', domainId: '1', provider: Provider.GOOGLE_WORKSPACE, dailyVolume: 12, warmupStatus: 'Ready', reputation: 98 },
  { id: 'm3', email: 'hello@sender-clinic.io', domainId: '2', provider: Provider.MICROSOFT_365, dailyVolume: 30, warmupStatus: 'Active', reputation: 85 },
];

export const MOCK_METRICS: MetricData[] = [
  { time: '08:00', deliverability: 98, openRate: 45, replyRate: 12 },
  { time: '10:00', deliverability: 97, openRate: 48, replyRate: 14 },
  { time: '12:00', deliverability: 99, openRate: 52, replyRate: 18 },
  { time: '14:00', deliverability: 95, openRate: 41, replyRate: 11 },
  { time: '16:00', deliverability: 98, openRate: 47, replyRate: 15 },
  { time: '18:00', deliverability: 99, openRate: 55, replyRate: 20 },
];
