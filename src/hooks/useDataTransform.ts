import { useMemo } from 'react';
import type { ModuleData, PlatformData, UserData } from '@/types/streaming';

interface UseDataTransformReturn {
  nonHibpData: PlatformData[];
  hibpData: UserData[];
  allConvertedData: PlatformData[];
}

export const useDataTransform = (modules: ModuleData[]): UseDataTransformReturn => {
  return useMemo(() => {
    // Convert modules to the format expected by components
    const convertToInfoCardListData = (modules: ModuleData[]): PlatformData[] => {
      return modules.map((module) => ({
        module: module.module,
        schemaModule: module.module,
        status: module.status,
        query: module.query,
        pretty_name: module.module,
        from: module.from,
        reliable_source: module.reliable_source,
        category: module.category,
        spec_format: module.spec_format,
      }));
    };

    // Mapping function from ModuleData to UserData for BreachedAccount
    const mapModuleToUserData = (module: ModuleData): UserData => {
      let pretty_name = module.module;
      if (Array.isArray(module.spec_format) && module.spec_format.length > 0) {
        const firstSpec = module.spec_format[0];
        if (firstSpec?.name?.value && typeof firstSpec.name.value === 'string') {
          pretty_name = firstSpec.name.value;
        }
      }
      return {
        pretty_name,
        query: module.query,
        category: module.category,
        spec_format: module.spec_format,
        front_schemas: module.front_schemas?.map((schema) => ({
          image: (schema as { image?: string }).image || "",
        })),
        status: module.status,
        module: module.module || "Unknown",
      };
    };

    const allConvertedData = convertToInfoCardListData(modules);

    // Filter modules that don't have breach data (non-HIBP data)
    const nonHibpData = allConvertedData.filter(
      (item) => !item.spec_format.some((spec) => spec.breach?.value === true)
    );

    // Filter and convert HIBP data
    const hibpData = modules
      .map(mapModuleToUserData)
      .filter((item) => item.spec_format?.some((spec) => spec.breach?.value === true));

    return {
      nonHibpData,
      hibpData,
      allConvertedData,
    };
  }, [modules]);
}; 