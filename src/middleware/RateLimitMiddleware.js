import rateLimit from 'express-rate-limit';

// Create different rate limiters for different endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Wrapper function for Next.js API routes
export const withRateLimit = (limiter) => {
  return (handler) => {
    return async (req, res) => {
      // Create a mock Express response object for rate-limit
      const mockRes = {
        setHeader: (name, value) => res.setHeader(name, value),
        status: (code) => ({ json: (data) => res.status(code).json(data) }),
      };

      try {
        await new Promise((resolve, reject) => {
          limiter(req, mockRes, (result) => {
            if (result instanceof Error) {
              reject(result);
            } else {
              resolve(result);
            }
          });
        });

        // If rate limit passed, continue to handler
        return handler(req, res);
      } catch (error) {
        // Rate limit exceeded
        return res.status(429).json({
          success: false,
          message: error.message || 'Too many requests',
        });
      }
    };
  };
};