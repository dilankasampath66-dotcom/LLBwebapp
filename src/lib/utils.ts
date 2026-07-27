import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import crypto from "crypto";

// Generic className merger
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Extract YouTube Video ID from standard and shortened URLs
export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Get YouTube hqdefault thumbnail URL
export function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

// Get standard YouTube embed URL
export function getYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

// Check if a URL is a valid YouTube URL
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

// Check if a URL is a valid Google Drive URL (very basic check)
export function isValidGoogleDriveUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("drive.google.com");
  } catch {
    return false;
  }
}

// Format date relative to now (e.g., '3 days ago')
export function formatRelativeDate(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Generate a random token (useful for password resets, verification, etc.)
export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
