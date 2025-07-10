export interface BreachEntry {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  LogoPath?: string;
  Attribution?: string | null;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
  IsStealerLog: boolean;
}

export interface AdvancedBreach extends BreachEntry {
  id: string;
  name: string;
  icon?: string;
  breach_date: string;
  upload_date: string;
  summary: string;
  rows: number;
  found: {
    label: string;
    value?: string;
    sensitive: boolean;
    fa_icon: string;
  }[];
  hibp_id?: string;
} 