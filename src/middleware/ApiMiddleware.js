import CorsMiddleware from './CorsMiddleware';
import { withSecurityHeaders } from './SecurityHeaders';
import { withRateLimit, generalLimiter } from './RateLimitMiddleware';

// Combine all API middlewares
export const withApiMiddleware = (handler, options = {}) => {
  // Apply middlewares in order
  let wrappedHandler = handler;
  
  // Apply security headers
  wrappedHandler = withSecurityHeaders(wrappedHandler);
  
  // Apply rate limiting if not disabled
  if (!options.skipRateLimit) {
    const limiter = options.customLimiter || generalLimiter;
    wrappedHandler = withRateLimit(limiter)(wrappedHandler);
  }
  
  // Apply CORS
  return async (req, res) => {
    // Apply CORS first
    await new Promise((resolve) => {
      CorsMiddleware(req, res, resolve);
    });
    
    // If it was a preflight request, CorsMiddleware already handled it
    if (req.method === 'OPTIONS') {
      return;
    }
    
    // Continue to wrapped handler
    return wrappedHandler(req, res);
  };
};