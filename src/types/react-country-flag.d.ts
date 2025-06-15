declare module 'react-country-flag' {
  import React from 'react';

  interface ReactCountryFlagProps {
    countryCode: string;
    svg?: boolean;
    style?: React.CSSProperties;
    title?: string;
    className?: string;
    'aria-label'?: string;
  }

  const ReactCountryFlag: React.FC<ReactCountryFlagProps>;
  export default ReactCountryFlag;
} 