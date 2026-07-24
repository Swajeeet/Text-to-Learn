# Deployment Guide — Text-to-Learn

This guide explains how to deploy Text-to-Learn to production using **Vercel** (frontend), **Railway** (backend), and **MongoDB Atlas** (database).

---

## Production Architecture

```
[User Browser]
      │
      ▼
[Vercel — React SPA]  ──HTTPS──→  [Railway — Express API]  ──→  [MongoDB Atlas]
                                          │
                                          ├──→  [OpenRouter API]
                                          └──→  [YouTube Data API v3]
```

---

## 1. MongoDB Atlas Setup

### Create a Cluster

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **free M0 cluster** (region: closest to your Railway deployment region)
3. In **Database Access**: create a user with **Read and Write** privileges
4. In **Network Access**: add IP `0.0.0.0/0` (allow all — required for Railway's dynamic IPs)

### Get Connection String

1. Click **Connect** → **Connect your application**
2. Select **Node.js** driver
3. Copy the URI:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your DB user credentials
5. Add the database name after the host:
   ```
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/text-to-learn?retryWrites=true&w=majority
   ```

---

## 2. Backend — Railway

### Initial Setup

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `Text-to-Learn` repository
4. Set the **Root Directory** to `server`

### Environment Variables

In Railway → your service → **Variables**, add:

| Variable | Value |
|---|---|
| `PORT` | `5000` (Railway maps this automatically; can omit) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random string (min 32 characters) |
| `JWT_EXPIRES_IN` | `7d` |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `YOUTUBE_API_KEY` | Your YouTube Data API v3 key |

> **Tip:** Generate a strong JWT secret with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Start Command

Railway auto-detects Node.js and will run `npm start` (which runs `node server.js`).

If needed, set the **Start Command** manually:
```
npm start
```

### Verify Deployment

```bash
curl https://your-app.railway.app/api/v1/health
```

Expected:
```json
{"success": true, "status": "Server Running", "timestamp": "..."}
```

### Custom Domain (Optional)

In Railway → Settings → Domains, generate a Railway domain or attach your own custom domain.

---

## 3. Frontend — Vercel

### Initial Setup

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → Import `Text-to-Learn`
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Environment Variables

In Vercel → Project → Settings → **Environment Variables**, add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-app.railway.app/api/v1` |

> **Important:** Replace `your-app.railway.app` with your actual Railway deployment URL.

### Deploy

Click **Deploy**. Vercel builds and hosts the React app on a global CDN.

### Verify

Visit your Vercel URL (e.g., `https://text-to-learn-nu.vercel.app`) and confirm the app loads and can communicate with the backend.

---

## 4. Communication Between Services

```
Vercel Frontend (text-to-learn-nu.vercel.app)
    │
    │  Uses VITE_API_URL env var
    ▼
Railway Backend (text-to-learn-production.up.railway.app)
    │
    ├── Uses MONGODB_URI env var
    │       ▼
    │   MongoDB Atlas (cluster0.xxxxx.mongodb.net)
    │
    ├── Uses OPENROUTER_API_KEY env var
    │       ▼
    │   OpenRouter API (openrouter.ai)
    │
    └── Uses YOUTUBE_API_KEY env var
            ▼
        YouTube Data API v3 (googleapis.com)
```

### CORS Configuration

The backend's `app.js` uses `cors()` middleware. For production, restrict the allowed origin to your Vercel domain:

```javascript
// Current (allow all origins):
app.use(cors());

// Recommended for production (restrict to Vercel frontend):
app.use(cors({
  origin: 'https://text-to-learn-nu.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

> Note: Do not change application code without verifying the implications.

---

## 5. Environment Variables Reference

### Complete Backend `.env`

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/text-to-learn?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_64_character_hex_secret_here
JWT_EXPIRES_IN=7d

# AI — OpenRouter
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Video Recommendations
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Complete Frontend `.env` (Production)

```env
VITE_API_URL=https://text-to-learn-production.up.railway.app/api/v1
```

### Complete Frontend `.env` (Local Development)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 6. Getting API Keys

### OpenRouter API Key

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Go to **Keys** in the dashboard
3. Click **Create Key**
4. Copy the key (starts with `sk-or-v1-`)
5. Add credit or use a free-tier model

> The app uses `deepseek/deepseek-r1-0528` by default (see `server/constants/aiConstants.js`).

### YouTube Data API v3 Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Navigate to **APIs & Services** → **Library**
4. Search for **YouTube Data API v3** and enable it
5. Go to **APIs & Services** → **Credentials**
6. Click **Create Credentials** → **API Key**
7. Copy the key and optionally restrict it by referrer or IP

> **Quota:** The free tier provides 10,000 units/day. Each search request costs ~100 units, giving ~100 searches per day on the free tier.

### MongoDB Atlas (Free Tier)

- Free M0 cluster includes 512 MB storage
- Sufficient for development and portfolio projects
- For production at scale, upgrade to M10 or above

---

## 7. Deployment Checklist

- [ ] MongoDB Atlas cluster created with network access open
- [ ] DB user created with read/write privileges
- [ ] Railway project created, root directory set to `server`
- [ ] All backend environment variables added in Railway
- [ ] Backend deployed and health endpoint returns `{"success": true}`
- [ ] Vercel project created, root directory set to `client`
- [ ] `VITE_API_URL` set to Railway backend URL in Vercel
- [ ] Frontend deployed and loads successfully
- [ ] Test registration and login flow end-to-end
- [ ] Test AI course generation
- [ ] Test PDF download
- [ ] Test YouTube video recommendations

---

## 8. Monitoring & Logs

### Railway Logs

- Railway → your service → **Logs** tab
- Real-time request logs powered by Morgan (`morgan('dev')`)

### MongoDB Atlas Monitoring

- Atlas → your cluster → **Monitoring** tab
- View query performance, connection count, and storage usage

### Vercel Analytics

- Vercel → your project → **Analytics** tab
- View page views and performance metrics (requires Vercel Analytics addon)

---

## 9. Local Development vs Production

| Aspect | Local | Production |
|---|---|---|
| Frontend URL | http://localhost:5173 | https://text-to-learn-nu.vercel.app |
| Backend URL | http://localhost:5000 | https://text-to-learn-production.up.railway.app |
| `VITE_API_URL` | `http://localhost:5000/api/v1` | `https://...railway.app/api/v1` |
| Database | MongoDB Atlas (same cluster) | MongoDB Atlas (same cluster) |
| AI API | OpenRouter (same key) | OpenRouter (same key) |
| YouTube API | YouTube Data API (same key) | YouTube Data API (same key) |

---

*For API details see [API.md](./API.md) · For architecture see [Architecture.md](./Architecture.md)*
