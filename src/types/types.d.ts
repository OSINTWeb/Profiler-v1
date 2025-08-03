// Type for the search type ("Basic" or "Advance")
export type SearchOption = "Basic" | "Advance";

// Type for a tool card
export interface Tool {
  title: string;
  description: string;
  link: string;
}
export interface SearchFreeTools {
  title: string;
  description: string;
}

// Props for the SearchTypes component
export interface SearchTypesProps {
  selected: string;
  Credits: number;
}

// Transaction types
export interface Transaction {
  source: "stripe" | "razorpay";
  email: string;
  amount: number;
  currency: string;
  phone_number: string | null;
  country: string;
  timestamp: string;
  payment_id?: string;
}

export interface TransactionResponse {
  email: string;
  transactions: Transaction[];
  page: number;
  total_pages: number;
  total_items: number;
}

export interface TransactionApiResponse extends Array<TransactionResponse> {}

export interface OsintResult {
  username: string;
  found_accounts: number;
  sites: Site[];
}

export interface Site {
  site: string;
  url: string;
  linked_accounts?: string[];
}

export interface AggregatedAccount {
  platform: string;
  url: string;
  sources: string[];
}

// Tool Result Types
export interface TikTokData {
  username: string;
  followers?: number;
  following?: number;
  likes?: number;
  bio?: string;
  found_accounts?: number;
  sites?: Site[];
}

export interface GravatarData {
  entry?: Array<{
    hash?: string;
    profileUrl?: string;
    thumbnailUrl?: string;
    displayName?: string;
  }>;
}

export interface LinkookData {
  username: string;
  found_accounts: number;
  sites: Site[];
  platforms?: string[];
  profileLinks?: string[];
}

export interface InfoStealerData {
  email?: string;
  username?: string;
  leaked_data?: Array<{
    source: string;
    details: string;
  }>;
  found_accounts?: number;
  sites?: Site[];
}

export interface BreachGuardData {
  email: string;
  total_breaches: number;
  breaches: Array<{
    name: string;
    date: string;
    details: string;
  }>;
}

export interface ProtonIntelData {
  email: string;
  account_status?: 'active' | 'inactive';
  creation_date?: string;
  found_accounts?: number;
  sites?: Site[];
} 