import data from "public/Data/export_test@gmail.com.json";

export interface ModuleData {
  module: string;
  category: {
    name: string;
    description: string;
  };
  data: Record<string, unknown>;
  front_schemas: Record<string, unknown>[];
  spec_format: Record<string, unknown>[];
  status: string;
  query: string;
  from: string;
  reliable_source: boolean;
}

export const fetchData = async (
  query: string, 
  type: string, 
  PaidSearch: string,
  onModuleReceived?: (module: ModuleData, index: number, total: number) => void
): Promise<ModuleData[]> => {
  console.log("query", query);
  console.log("type", type);
  console.log("PaidSearch", PaidSearch);
  
  const modules = data as ModuleData[];
  
  // If callback is provided, stream data module by module
  if (onModuleReceived) {
    for (let i = 0; i < modules.length; i++) {
      // Send module with 1-second delay
      setTimeout(() => {
        onModuleReceived(modules[i], i, modules.length);
      }, i * 1000); // 1 second gap between each module
    }
    
    // Return empty array initially since data will be streamed via callback
    return [];
  }
  
  // If no callback, return all data at once (fallback)
  return modules;
};
