import rateLimit from "express-rate-limit";

export const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 20,                  // allow max 20 requests per IP
  standardHeaders: true,    // return rate limit info in headers
  legacyHeaders: false,     // disable old X-RateLimit headers

  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});
