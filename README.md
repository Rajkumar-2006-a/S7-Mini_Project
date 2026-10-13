# MedTrack

MedTrack is a hospital bed capacity and transfer application built with React, Express, Node.js, and MongoDB.

## Project Structure

- `client/` contains the React application, Vite configuration, and static assets.
- `server/` contains the Express API, MongoDB data access, and server entry point.

## Run Locally

Prerequisites: Node.js and npm.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to a MongoDB connection string. The API can run in in-memory mode when MongoDB is not configured.
3. Start the client and API with `npm run dev`.

The client runs at `http://localhost:5173` and proxies `/api` requests to the Express API at `http://localhost:3000`.

## Production

Run `npm run build` to build the client and bundle the API. Start the production server with `npm start`; Express serves the client build and API from port `3000` (or `PORT`).
