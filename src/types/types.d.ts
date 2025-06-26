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