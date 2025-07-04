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
  settypeofsearch: (type: string) => void;
  selected: string;
  typeofsearch: string;
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