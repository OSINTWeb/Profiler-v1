// Centralized type definitions for streaming data
export interface SpecFormatValue {
  value: string | boolean | number;
  type?: string;
  proper_key?: string;
}

export interface PlatformVariable {
  key: string;
  proper_key?: string;
  value: string;
  type?: string;
}

export interface SpecFormat {
  registered?: SpecFormatValue;
  platform_variables?: PlatformVariable[];
  verified?: SpecFormatValue;
  breach?: SpecFormatValue;
  name?: SpecFormatValue;
  picture_url?: SpecFormatValue;
  website?: SpecFormatValue;
  id?: SpecFormatValue;
  bio?: SpecFormatValue;
  creation_date?: SpecFormatValue;
  gender?: SpecFormatValue;
  last_seen?: SpecFormatValue;
  username?: SpecFormatValue;
  location?: SpecFormatValue;
  phone_number?: SpecFormatValue;
  phone?: SpecFormatValue;
  email?: SpecFormatValue;
  birthday?: SpecFormatValue;
  language?: SpecFormatValue;
  age?: SpecFormatValue;
  [key: string]: SpecFormatValue | PlatformVariable[] | undefined;
}

export interface ModuleData {
  module: string;
  category: {
    name: string;
    description: string;
  };
  data: Record<string, unknown>;
  front_schemas: Array<{ image?: string }>;
  spec_format: SpecFormat[];
  status: string;
  query: string;
  from: string;
  reliable_source: boolean;
}

export interface PlatformData {
  module: string;
  schemaModule: string;
  status: string;
  query: string;
  pretty_name: string;
  from: string;
  reliable_source: boolean;
  category: {
    name: string;
    description: string;
  };
  spec_format: SpecFormat[];
  front_schemas?: Array<{ image?: string }>;
  data?: unknown[];
}

export interface UserData {
  pretty_name: string;
  query: string;
  category: {
    name: string;
    description: string;
  };
  spec_format?: SpecFormat[];
  front_schemas?: Array<{ image: string }>;
  status?: string;
  module: string;
}

export interface SearchData {
  query: string;
  type: string;
  PaidSearch: string;
}

export interface SSEEvent {
  type: "init" | "module" | "complete" | "error";
  total?: number;
  module?: ModuleData;
  index?: number;
  message?: string;
  query?: string;
  searchType?: string;
  paidSearch?: string;
  finalCount?: number;
}

export interface StreamingState {
  searchData: SearchData | null;
  loading: boolean;
  modules: ModuleData[];
  currentIndex: number;
  totalModules: number;
  isStreaming: boolean;
  connectionStatus: string;
  error: string | null;
} 