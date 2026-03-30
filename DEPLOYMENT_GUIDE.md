# FocusFlow - Deployment Guide

Complete guide to deploy FocusFlow to production environments.

## 🌐 Deployment Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │────────▶│   Backend API   │────────▶│   MongoDB       │
│   (Vercel)      │         │   (Render)      │         │   (Atlas)       │
│   Port: 443     │         │   Port: 443     │         │   Cloud         │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 📋 Pre-Deployment Checklist

- [ ] Code is tested and working locally
- [ ] Environment variables are documented
- [ ] Git repository is set up (GitHub recommended)
- [ ] MongoDB Atlas account created
- [ ] Vercel account created (for frontend)
- [ ] Render/Railway account created (for backend)

## 🗄️ Step 1: Deploy MongoDB Database

### MongoDB Atlas Setup

1. **Create Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select region closest to your users
   - Name your cluster: `focusflow-cluster`
   - Click "Create Cluster"

3. **Configure Security**
   - **Database Access:**
     - Click "Database Access" in left sidebar
     - Click "Add New Database User"
     - Username: `focusflow_admin`
     - Password: Generate secure password (save this!)
     - User Privileges: "Read and write to any database"
     - Click "Add User"

   - **Network Access:**
     - Click "Network Access" in left sidebar
     - Click "Add IP Address"
     - Click "Allow Access from Anywhere" (0.0.0.0/0)
     - Click "Confirm"

4. **Get Connection String**
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://focusflow_admin:<password>@focusflow-cluster.xxxxx.mongodb.net/
     ```
   - Replace `<password>` with your database password
   - Add database name at the end: `focusflow`
   - Final string:
     ```
     mongodb+srv://focusflow_admin:YOUR_PASSWORD@focusflow-cluster.xxxxx.mongodb.net/focusflow
     ```

## 🔧 Step 2: Deploy Backend (Render)

### Option A: Render Deployment

1. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or use "Public Git repository" and enter URL

3. **Configure Service**
   - **Name:** `focusflow-api`
   - **Region:** Select closest to your users
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://focusflow_admin:YOUR_PASSWORD@focusflow-cluster.xxxxx.mongodb.net/focusflow
   JWT_SECRET=your_generated_secret_key_min_32_chars
   JWT_EXPIRE=30d
   ```

   **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Your API URL: `https://focusflow-api.onrender.com`

6. **Test Backend**
   ```bash
   curl https://focusflow-api.onrender.com/api/health
   ```

### Option B: Railway Deployment

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Select the `server` directory as root
   - Add environment variables (same as Render)
   - Click "Deploy"

4. **Get URL**
   - Go to Settings → Generate Domain
   - Your API URL: `https://focusflow-api.up.railway.app`

## ⚛️ Step 3: Deploy Frontend (Vercel)

1. **Create Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   Click "Environment Variables":

   ```
   REACT_APP_API_URL=https://focusflow-api.onrender.com/api
   ```

   Replace with your actual backend URL from Step 2.

5. **Deploy**
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - Your app URL: `https://focusflow.vercel.app`

6. **Test Frontend**
   - Open your Vercel URL
   - Try to register a new account
   - Verify login works
   - Test all features

## 🔄 Step 4: Update Backend CORS

After deploying frontend, update backend to allow your Vercel domain:

### Option 1: Update via Render Dashboard

1. Go to your Render service
2. Add environment variable:
   ```
   CLIENT_URL=https://focusflow.vercel.app
   ```
3. Update `server/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
```

### Option 2: Allow All Origins (Less Secure)

```javascript
app.use(cors());
```

## 🔌 Step 5: Publish Chrome Extension

### Prepare Extension for Production

1. **Update manifest.json**
   ```json
   {
     "name": "FocusFlow - Website Blocker",
     "version": "1.0.0",
     "description": "Block distracting websites during FocusFlow sessions"
   }
   ```

2. **Test Extension**
   - Load unpacked in Chrome
   - Test all features
   - Verify blocking works

3. **Create Icons** (128x128, 48x48, 16x16)
   - Use a tool like Figma or Canva
   - Export as PNG
   - Save in `chrome-extension/icons/`

### Publish to Chrome Web Store (Optional)

1. **Create Developer Account**
   - Go to https://chrome.google.com/webstore/devconsole
   - Pay one-time $5 registration fee

2. **Package Extension**
   ```bash
   cd chrome-extension
   zip -r focusflow-extension.zip .
   ```

3. **Upload**
   - Click "New Item"
   - Upload ZIP file
   - Fill in details:
     - Name
     - Description
     - Screenshots
     - Category: Productivity
   - Submit for review (1-3 days)

## 🧪 Step 6: Post-Deployment Testing

### Backend Testing

```bash
# Health check
curl https://focusflow-api.onrender.com/api/health

# Register user
curl -X POST https://focusflow-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST https://focusflow-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Frontend Testing

1. **Authentication Flow**
   - Register new account
   - Login
   - Logout
   - Login again

2. **Dashboard**
   - View stats
   - Check responsiveness
   - Verify charts load

3. **Focus Mode**
   - Start focus session
   - Test fullscreen
   - Test violation detection
   - Complete session

4. **Tasks**
   - Create task
   - Edit task
   - Delete task
   - Toggle completion

5. **Analytics**
   - View charts
   - Check violation stats
   - Verify data accuracy

## 📊 Step 7: Monitoring & Maintenance

### Render Monitoring

- View logs in Render dashboard
- Set up alerts for downtime
- Monitor resource usage

### MongoDB Atlas Monitoring

- Check database size
- Monitor connections
- View query performance

### Vercel Analytics

- View deployment logs
- Monitor build times
- Check function execution

## 🚀 Continuous Deployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Auto-Deploy:**
   - Vercel automatically rebuilds frontend
   - Render automatically rebuilds backend

### Environment-Specific Deployments

**Development:**
```bash
git push origin dev
```

**Production:**
```bash
git push origin main
```

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different secrets for dev/prod
   - Rotate secrets periodically

2. **CORS Configuration**
   - Specify exact origins in production
   - Don't use wildcard (*) in production

3. **MongoDB**
   - Use strong passwords
   - Enable IP whitelist
   - Regular backups

4. **JWT Tokens**
   - Use strong secret (32+ characters)
   - Set appropriate expiration
   - Implement token refresh

## 📱 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Purchase domain (Namecheap, Google Domains, etc.)

2. In Vercel Dashboard:
   - Go to Project Settings
   - Click "Domains"
   - Add your domain: `focusflow.com`

3. Update DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

4. Wait for DNS propagation (up to 24 hours)

### Add Custom Domain to Render

1. In Render Dashboard:
   - Go to Settings
   - Click "Custom Domain"
   - Add: `api.focusflow.com`

2. Update DNS records:
   ```
   Type: CNAME
   Name: api
   Value: focusflow-api.onrender.com
   ```

## 🆘 Troubleshooting Deployment

### Build Fails on Vercel

**Issue:** `Build failed with exit code 1`

**Solutions:**
1. Check build logs
2. Verify all dependencies in `package.json`
3. Test build locally:
   ```bash
   npm run build
   ```
4. Clear build cache in Vercel settings

### Backend Won't Start on Render

**Issue:** Service keeps restarting

**Solutions:**
1. Check logs in Render dashboard
2. Verify environment variables
3. Test MongoDB connection
4. Check Start Command is correct: `node server.js`

### Database Connection Timeout

**Issue:** `MongoServerError: connection timeout`

**Solutions:**
1. Check MongoDB Atlas network access
2. Verify connection string
3. Ensure IP whitelist includes 0.0.0.0/0
4. Check database user permissions

### CORS Errors in Production

**Issue:** `Access-Control-Allow-Origin error`

**Solutions:**
1. Update backend CORS configuration
2. Verify CLIENT_URL environment variable
3. Check Vercel domain is correct

## 🎉 Deployment Complete!

Your FocusFlow application is now live and accessible worldwide!

### Your URLs:
- **Frontend:** https://focusflow.vercel.app
- **Backend:** https://focusflow-api.onrender.com
- **Database:** MongoDB Atlas (managed)

### Next Steps:
1. Share your app with users
2. Monitor performance and usage
3. Collect feedback
4. Plan new features
5. Scale as needed

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/

**🚀 Happy Deploying!**
