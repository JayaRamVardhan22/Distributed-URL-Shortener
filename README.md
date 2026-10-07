\# Distributed URL Shortener



A full-stack URL shortening platform built with \*\*Node.js, Express.js, MongoDB, Redis, and React.js\*\*.



The application converts long URLs into short, shareable links while providing click analytics, URL expiration, Redis caching, rate limiting, and a clean React frontend.



\## Features



\- Create short URLs from long URLs

\- Random Base62 short-code generation

\- Collision-safe short-code creation

\- URL expiration

\- Fast redirects using Redis caching

\- Click-count analytics

\- Last-accessed timestamp

\- Delete short URLs

\- Redis cache invalidation after deletion

\- HTTP/HTTPS URL validation

\- API rate limiting

\- Security headers with Helmet

\- CORS support

\- MongoDB persistence

\- React-based frontend

\- Modular backend architecture



\## Tech Stack



\### Frontend



\- React.js

\- Vite

\- JavaScript

\- CSS



\### Backend



\- Node.js

\- Express.js

\- Mongoose

\- REST APIs



\### Database \& Caching



\- MongoDB

\- Redis / Memurai



\### Security \& Validation



\- Helmet

\- express-rate-limit

\- Validator.js



\## Architecture



```text

&#x20;                   ┌─────────────────────┐

&#x20;                   │   React Frontend    │

&#x20;                   │      Vite           │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              │ REST API

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │   Express Server    │

&#x20;                   │      Node.js        │

&#x20;                   └──────┬───────┬──────┘

&#x20;                          │       │

&#x20;                 ┌────────┘       └────────┐

&#x20;                 ▼                         ▼

&#x20;         ┌───────────────┐         ┌───────────────┐

&#x20;         │    MongoDB    │         │     Redis     │

&#x20;         │ Persistent DB │         │    Caching    │

&#x20;         └───────────────┘         └───────────────┘



Project Structure

Distributed-URL-Shortener/

├── backend/

│   ├── src/

│   │   ├── config/

│   │   ├── controllers/

│   │   ├── middleware/

│   │   ├── models/

│   │   ├── routes/

│   │   ├── services/

│   │   └── utils/

│   ├── .env.example

│   ├── package.json

│   └── server.js

├── frontend/

│   ├── src/

│   │   ├── App.jsx

│   │   ├── index.css

│   │   └── main.jsx

│   ├── .env.example

│   ├── package.json

│   └── vite.config.js

├── .gitignore

└── README.md



API Endpoints

Create Short URL

POST /api/urls



Request:

{

&#x20; "originalUrl": "https://example.com",

&#x20; "expiresAt": null

}



Redirect

GET /:shortCode



Redirects the user to the original URL.

Analytics

GET /api/urls/:shortCode



Returns the original URL, short code, click count, last accessed time, creation time, and expiration time.

Delete URL

DELETE /api/urls/:shortCode



Deletes the short URL and removes its Redis cache entry.

Local Setup

Prerequisites

\- Node.js

\- MongoDB

\- Redis-compatible server such as Memurai

Clone

git clone https://github.com/JayaRamVardhan22/Distributed-URL-Shortener.git

cd Distributed-URL-Shortener



Start MongoDB

C:\\MongoDB\\bin\\mongod.exe --dbpath C:\\MongoDB\\data\\db



Start Backend

cd backend

npm install



Create .env:

PORT=5000

MONGODB\_URI=mongodb://127.0.0.1:27017/distributed\_url\_shortener

REDIS\_URL=redis://127.0.0.1:6379

BASE\_URL=http://localhost:5000



Start:

node server.js



Backend:

http://localhost:5000



Start Frontend

Open another terminal:

cd frontend

npm install



Create .env:

VITE\_API\_URL=http://localhost:5000



Start:

npm run dev



Frontend:

http://localhost:5173



Caching Strategy

Redis is used as a caching layer for frequently accessed short URLs.

Cache keys follow:

url:<shortCode>



Cached URL records use a 1-hour TTL.

Request

&#x20;  │

&#x20;  ▼

Redis Cache

&#x20;  │

&#x20;  ├── Cache Hit ──► Redirect

&#x20;  │

&#x20;  └── Cache Miss

&#x20;         │

&#x20;         ▼

&#x20;      MongoDB

&#x20;         │

&#x20;         ▼

&#x20;     Store in Redis

&#x20;         │

&#x20;         ▼

&#x20;      Redirect



When a URL is deleted, its Redis cache entry is invalidated.

Short Code Generation

Short codes use randomly generated characters from a Base62 character set:

0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ



The application handles potential short-code collisions by retrying creation when MongoDB reports a duplicate-key error.

Analytics

Each successful redirect updates:

\- clickCount

\- lastAccessedAt

Click counts are updated atomically in MongoDB using $inc.

Security

The backend includes:

\- Helmet security headers

\- CORS configuration

\- URL validation

\- API rate limiting

\- Environment variables for configuration

\- MongoDB unique indexing for short codes

Environment Variables

Backend

PORT=5000

MONGODB\_URI=mongodb://127.0.0.1:27017/distributed\_url\_shortener

REDIS\_URL=redis://127.0.0.1:6379

BASE\_URL=http://localhost:5000



Frontend

VITE\_API\_URL=http://localhost:5000



Do not commit actual .env files containing environment-specific configuration or secrets.

Future Improvements

\- AWS EC2 deployment

\- Production MongoDB hosting

\- Production Redis deployment

\- HTTPS support

\- Custom aliases

\- User authentication

\- Per-user URL management

\- More detailed analytics

\- Automated testing

\- CI/CD pipeline

\- Monitoring and structured logging

\- Improved production error handling



Author

Jaya Ram Vardhan

GitHub: https://github.com/JayaRamVardhan22

