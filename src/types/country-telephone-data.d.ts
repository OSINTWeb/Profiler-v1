declare module 'country-telephone-data' {
  interface Country {
    name: string;
    iso2: string;
    dialCode: string;
    priority: number;
    areaCodes: string[] | null;
  }

  export const allCountries: Country[];
  
  const countryTelephoneData: {
    allCountries: Country[];
  };
  
  export default countryTelephoneData;
} 