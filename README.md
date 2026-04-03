# Vanshawali Land & Family Tree Management System

Production-oriented monorepo with clean architecture split:
- `backend/` Express + MongoDB + JWT + Multer/Cloudinary
- `frontend/` React (Vite) + Tailwind + Zustand + React Query + React Flow + dagre

## Clean Architecture Mapping

### Backend Layers
- **Presentation**: controllers/routes/middleware in `backend/src/presentation`
- **Application**: services/use-cases in `backend/src/application`
- **Domain**: core tree/distribution logic in `backend/src/domain`
- **Infrastructure**: Mongoose models, repositories, cloud storage adapters in `backend/src/infrastructure`

### Frontend Layers
- **Presentation**: React components and pages in `frontend/src/components` and `frontend/src/app`
- **Application**: React Query orchestration in `App.jsx`, Zustand stores in `frontend/src/store`
- **Domain**: tree graph transformation + layout logic in `frontend/src/utils/tree.js`
- **Infrastructure**: HTTP client in `frontend/src/services/api.js`

## Key Implemented Features

1. **Family Tree Engine**
   - Tree rendered with React Flow + dagre auto layout
   - Expand/collapse per node with full graph kept in memory
   - Global expand all / collapse all

2. **Member Management**
   - CRUD APIs + UI actions for add/edit/delete
   - Root delete prevention
   - Delete subtree OR reassign children strategy
   - Soft delete support

3. **Land Views**
   - Independent land views with switchable selection

4. **Distribution Engine**
   - Domain functions: `distributeDown`, `aggregateUp`, `recalculateTree`
   - Mandatory preview before apply (`/distribution/preview/:viewId` then `/distribution/apply`)

5. **Real-time trigger points**
   - UI exposes preview/apply flow after member/value/view changes
   - Memoized graph transformations in frontend

6. **Document Management**
   - File uploads via Multer + Cloudinary storage adapter
   - Link docs to person/view via metadata

7. **RBAC**
   - Viewer: read-only
   - Editor: mutations enabled
   - Backend enforcement with `authorize()` middleware

8. **Audit + Safety**
   - All mutating operations log to `AuditLog`
   - Soft delete enabled for members

9. **Dashboard**
   - Top share snapshot from selected view distribution

## Seed Data (Provided Vanshawali JSON)

- Stored at `backend/src/seed/family-tree.json`
- Flattening transformer in `backend/src/utils/tree.js`
- Seeding script in `backend/src/seed/seed.js`

### Relationship Guarantees
- IDs preserved exactly from input JSON (`id -> _id`)
- `parentId` set during DFS flatten
- `childrenIds[]` preserved
- No node dropped in transformation

## Local Run

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

Create `backend/.env`:
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/vanshawali
JWT_SECRET=super-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Sample Accounts
- Editor: `editor@example.com` / `password123`
- Viewer: `viewer@example.com` / `password123`

## API Endpoints
- `POST /api/login`
- `POST /api/register`
- `GET /api/members`
- `POST /api/members`
- `PUT /api/members/:id`
- `DELETE /api/members/:id`
- `POST /api/views`
- `GET /api/views`
- `GET /api/views/:id`
- `GET /api/distribution/preview/:viewId`
- `POST /api/distribution/apply`
- `GET /api/distribution/:viewId`
- `POST /api/upload`
- `GET /api/documents/:id`
