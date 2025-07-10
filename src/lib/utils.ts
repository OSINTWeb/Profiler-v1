import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Rewardful types
declare global {
  interface Window {
    Rewardful?: {
      referral: string;
    };
  }
}

/**
 * Gets the current Rewardful referral ID if present
 * @returns The referral ID or null if not present
 */
export const getRewardfulReferralId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.Rewardful?.referral || null;
};
