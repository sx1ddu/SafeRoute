# SafeRoute

SafeRoute is a school transport app for managing buses, route stops, student attendance, and live bus location. It has administrator, driver, and parent views.

## Stack

- Frontend: React, Vite, React Router, Axios, Leaflet, Socket.IO client
- Backend: Node.js, Express, MySQL (`mysql2`), JWT, Socket.IO
- Maps: Leaflet with OpenStreetMap tiles

The current codebase does not implement the emergency-response, Gemini AI, MongoDB, or Tailwind features described in earlier project notes.

## Local setup

1. Install Node.js and create a MySQL database.
2. Copy `backend/.env.example` to `backend/.env` and fill in the MySQL connection details. Keep SSL enabled for hosted databases.
3. From `backend`, run `npm ci`, then `npm run db:setup` to create the tables. Run `npm run create-admin` in an interactive terminal to create the first administrator.
4. From `frontend`, run `npm ci`. Copy `frontend/.env.example` to `frontend/.env` for the local API and socket URLs.
5. Run `npm run dev` in both folders. Vite prints the frontend address; the API listens on port 5000 by default.

## Deployment

- Deploy `backend` as a Node web service. `render.yaml` provides a Render blueprint. Set `CORS_ORIGINS` to the exact deployed frontend origin and provide the MySQL variables and provider CA certificate when required.
- Deploy `frontend` as a Vite app on Vercel using `frontend/vercel.json`. Set `VITE_API_URL` to the backend URL ending in `/api` and `VITE_SOCKET_URL` to the backend origin.
- Run the database setup command against the production database, then create the first admin with the interactive command from a trusted terminal.

The location simulator is disabled by default. Set `ENABLE_ROUTE_SIMULATION=true` only for a demo environment; normal trip updates use the driver's browser GPS.
