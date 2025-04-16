const CorsMiddleware = async (req, res, next) => {
  try {
    // List of allowed origins
    const allowedOrigins = [
      'https://attirealley.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173' // Vite default port
    ];

    // Get the origin from the request
    const origin = req.headers.origin;

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return next();
  } catch (error) {
    console.error('CORS Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default CorsMiddleware; 