
export enum HealthStatus {
  HEALTHY = 'Healthy',
  STABLE = 'Stable',
  CRITICAL = 'Critical',
  INFECTED = 'Infected',
  SURGERY_REQUIRED = 'Surgery Required'
}

export enum Provider {
  GOOGLE_WORKSPACE = 'Google Workspace',
  MICROSOFT_365 = 'Microsoft 365',
  ZOHO = 'Zoho',
  CUSTOM_SMTP = 'Custom SMTP'
}

export interface Domain {
  id: string;
  name: string;
  status: HealthStatus;
  mailboxCount: number;
  spf: boolean;
  dkim: boolean;
  dmarc: boolean;
  forwarding: boolean;
  healthScore: number;
  lastChecked: string;
}

export interface Mailbox {
  id: string;
  email: string;
  domainId: string;
  provider: Provider;
  dailyVolume: number;
  warmupStatus: 'Active' | 'Paused' | 'Ready';
  reputation: number;
}

export interface MetricData {
  time: string;
  deliverability: number;
  openRate: number;
  replyRate: number;
}
