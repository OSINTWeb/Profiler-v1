import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ProtonResult } from "@/types/proton";
import { LinkookData } from "@/types/types";

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

// Parse Linkook API result to OsintResult
export function parseLinkookResult(raw: unknown): LinkookData | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null) {
    // Already in correct format
    if ("username" in raw && "found_accounts" in raw && "sites" in raw) {
      return raw as LinkookData;
    }
    // If wrapped in { data: ... }
    if ("data" in raw && typeof (raw as any).data === "object") {
      return parseLinkookResult((raw as any).data);
    }
  }
  if (typeof raw === "string") {
    try {
      // Try to parse JSON string
      const parsed = JSON.parse(raw);
      return parseLinkookResult(parsed);
    } catch {
      // Not JSON, try to extract JSON from string
      const match = raw.match(/Parsed JSON data: (\{[\s\S]*\})/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          return parseLinkookResult(parsed);
        } catch {}
      }
    }
  }
  return null;
}

export function parseProtonResult(raw: unknown): ProtonResult {
  // Example raw input: 'pub:610eeaca8dc1d15f6bca0ba6bdd07f62e32809a1:1::1400277585::\nuid:UserID:1400277585::'
  // We'll extract keyId, creationDate, and set isOfficialDomain based on email domain
  let keyId = "";
  let creationDate = 0;
  let email = "";
  let isOfficialDomain = false;

  if (typeof raw === "object" && raw !== null) {
    // If already in correct format
    if ("keyId" in raw && "creationDate" in raw && "email" in raw) {
      return raw as ProtonResult;
    }
    if ("data" in raw) raw = raw.data;
  }
  if (typeof raw === "string") {
    // Try to extract keyId and creationDate from the string
    // Example: pub:610eeaca8dc1d15f6bca0ba6bdd07f62e32809a1:1::1400277585::
    const pubMatch = raw.match(/pub:([a-f0-9]{40,}):[0-9]*::([0-9]+)::/);
    if (pubMatch) {
      keyId = pubMatch[1];
      creationDate = parseInt(pubMatch[2], 10);
    }
    // Try to extract email if present
    const emailMatch = raw.match(/[\w.-]+@[\w.-]+/);
    if (emailMatch) {
      email = emailMatch[0];
    }
    // Fallback: if not found, set demo email
    if (!email) email = "unknown@protonmail.com";
    isOfficialDomain = email.endsWith("@protonmail.com") || email.endsWith("@proton.me");
  }
  return {
    email,
    keyId,
    creationDate,
    isOfficialDomain,
  };
}
