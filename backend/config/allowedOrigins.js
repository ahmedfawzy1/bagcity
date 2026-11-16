const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://bagify-frontend-one.vercel.app",
  "https://www.bagify-frontend-one.vercel.app",
  "https://www.bagcity.shop/",
  "https://bagcity.shop/",
  process.env.FRONTEND_URL,
  process.env.BACKEND_API_URL,
].filter(Boolean);

export default allowedOrigins;
