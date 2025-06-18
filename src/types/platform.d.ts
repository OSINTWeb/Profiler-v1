export interface SharedPlatformData {
  pretty_name: string;
  query: string;
  category: {
    name: string;
    description: string;
  };
  spec_format?: Record<string, unknown>[];
  front_schemas?: {
    image?: string;
  }[];
  status?: string;
  module: string; // Required for compatibility
}

export interface ExpandPlatformData extends SharedPlatformData {
  module: string; // Required by Expand component
} 