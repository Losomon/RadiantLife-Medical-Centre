# RadiantLife Medical Center Backend (Phase 1)

// Quick Start
1. Copy `.env.example` to `.env` and update MONGO_URI (install MongoDB local or use Atlas) & JWT_SECRET.
2. `npm install`
3. `npm start` (or `npm run dev` for nodemon)

// Endpoints
- POST /api/auth/register {name, email, password, role}
- POST /api/auth/login {email, password} → returns JWT token
- GET/POST /api/data/patients → token in Authorization: Bearer <token>
- GET/POST /api/data/appointments → token required

Example curl login:
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

Test root: http://localhost:5000

