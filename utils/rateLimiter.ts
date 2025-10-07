interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RequestRecord> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  check(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      const resetTime = now + this.config.windowMs;
      this.requests.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime,
      };
    }

    if (record.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    record.count++;
    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      resetTime: record.resetTime,
    };
  }

  reset(key: string): void {
    this.requests.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000,
});

export const authRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 300000,
});

export const uploadRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000,
});

setInterval(() => {
  apiRateLimiter.cleanup();
  authRateLimiter.cleanup();
  uploadRateLimiter.cleanup();
}, 60000);
