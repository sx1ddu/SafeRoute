# Deployment

Copy the two `.env.example` files and set every value. Generate a random `JWT_SECRET` of at least 32 characters. Set `CORS_ORIGINS` to the exact frontend origin and `VITE_API_URL` to the backend URL ending in `/api`.

Run `mysql -u USER -p DB_NAME < backend/migrations/001_initial.sql` once against a new database. Take a backup before migrations. Existing plaintext passwords cannot be safely transformed without the plaintext value; require affected users to reset passwords or run a controlled, one-time hash migration in a maintenance window. Never log the source values.

Deploy the backend with `npm ci && npm start`, and the frontend with `npm ci && npm run build`. Provide HTTPS/WebSocket support at the proxy. The API health endpoint is `/health`.
