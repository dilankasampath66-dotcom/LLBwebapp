import { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

class RateLimiter {
  private config: RateLimitConfig;
  private cache: Map<string, { count: number; resetTime: number }>;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cache = new Map();
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const entry = this.cache.get(identifier);

    if (entry) {
      if (now > entry.resetTime) {
        // Expired, reset
        this.cache.set(identifier, {
          count: 1,
          resetTime: now + this.config.windowMs,
        });
        return {
          success: true,
          remaining: this.config.maxRequests - 1,
          reset: now + this.config.windowMs,
        };
      } else {
        // Still within window
        const count = entry.count + 1;
        this.cache.set(identifier, {
          count,
          resetTime: entry.resetTime,
        });

        if (count > this.config.maxRequests) {
          return {
            success: false,
            remaining: 0,
            reset: entry.resetTime,
          };
        } else {
          return {
            success: true,
            remaining: this.config.maxRequests - count,
            reset: entry.resetTime,
          };
        }
      }
    } else {
      // New entry
      this.cache.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return {
        success: true,
        remaining: this.config.maxRequests - 1,
        reset: now + this.config.windowMs,
      };
    }
  }
}

export const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

export const forgotPasswordLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3,
});

export const apiLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

export function getIpAddress(req: NextRequest): string {
  // Check common headers for IP address
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  // Fallback
  return "127.0.0.1";
}
