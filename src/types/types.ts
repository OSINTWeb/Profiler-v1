// Linkook Types
export interface LinkookSite {
  site: string;
  url: string;
  linked_accounts?: string[];
}

export interface LinkookData {
  username: string;
  found_accounts: number;
  sites: LinkookSite[];
}

// TikTok Types
export interface TikTokProfile {
  Nickname: string;
  Username: string;
  Country: string;
  Language: string;
  About: string;
  "User ID": string;
  SecUID: string;
  "Bio Link": string;
  "Account Created": string;
  "Nickname Last Modified": string;
  "Username Last Modified": string;
  "Avatar URL": string;
}

export interface TikTokStats {
  Followers: string;
  Following: string;
  Hearts: string;
  Videos: string;
  Friends: string;
}

export interface TikTokData {
  profile: TikTokProfile;
  stats: TikTokStats;
  Website: string;
  "You can support me on Ko-fi to keep this project alive!": string;
}

// Breach Guard Types
export interface BreachEntry {
  Name: string;
  Date?: string;
  Description?: string;
  DataClasses?: string[];
  BreachDate?: string;
  AddedDate?: string;
  ModifiedDate?: string;
  PwnCount?: number;
  Domain?: string;
  IsVerified?: boolean;
  IsFabricated?: boolean;
  IsSpamList?: boolean;
  IsRetired?: boolean;
  IsSensitive?: boolean;
}

export interface BreachGuardData {
  breaches: BreachEntry[];
  total_breaches?: number;
  email?: string;
}

// Info Stealer Types
export interface InfoStealerEntry {
  stealer_family: string;
  date_compromised: string;
  computer_name: string;
  operating_system: string;
  malware_path: string;
  antiviruses: string[];
  ip: string;
  top_passwords: string[];
  top_logins: string[];
}

export interface InfoStealerData {
  message: string;
  stealers: InfoStealerEntry[];
  total_corporate_services: number;
  total_user_services: number;
}

// Gravatar Types
export interface GravatarPhoto {
  value: string;
  type: string;
}

export interface GravatarEmail {
  primary: string;
  value: string;
}

export interface GravatarAccount {
  domain: string;
  display: string;
  url: string;
  iconUrl: string;
  is_hidden: boolean;
  username: string;
  verified: boolean;
  name: string;
  shortname: string;
}

export interface GravatarProfileBackground {
  opacity: number;
}

export interface GravatarEntry {
  hash: string;
  requestHash: string;
  profileUrl: string;
  preferredUsername: string;
  thumbnailUrl: string;
  photos: GravatarPhoto[];
  displayName: string;
  aboutMe: string;
  currentLocation: string;
  job_title: string;
  company: string;
  emails: GravatarEmail[];
  accounts: GravatarAccount[];
  profileBackground: GravatarProfileBackground;
}

export interface GravatarData {
  entry: GravatarEntry[];
}

// Email Intelligence Types
export interface EmailIntelResults {
  email: string;
  results: {
    [platform: string]: "found" | "not_found" | "rate_limited" | "error" | null;
  };
}

export interface EmailResult {
  email: string;
  summary: {
    checked: number;
    time: string;
  };
  used: string[];
  not_used: string[];
  rate_limited: string[];
} 