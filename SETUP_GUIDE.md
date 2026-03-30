# FocusFlow - Complete Setup Guide

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js installed (v16.0.0 or higher)
- [ ] npm or yarn package manager
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Git (optional, for version control)
- [ ] Code editor (VS Code recommended)
- [ ] Google Chrome browser (for extension)

## 🔍 Step 1: Verify Prerequisites

### Check Node.js Installation
```bash
node --version
# Should show v16.x.x or higher
```

### Check npm Installation
```bash
npm --version
# Should show 8.x.x or higher
```

### Check MongoDB (Local)
```bash
mongod --version
# Should show MongoDB version
```

If not installed, download from:
- Node.js: https://nodejs.org/
- MongoDB: https://www.mongodb.com/try/download/community

## 🗄️ Step 2: Database Setup

### Option A: Local MongoDB

1. Start MongoDB service:

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

2. Verify MongoDB is running:
```bash
mongosh
# Should connect to MongoDB shell
```

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Wait for cluster to deploy (2-3 minutes)
5. Click "Connect" → "Connect your application"
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/focusflow
   ```
7. Replace `<username>` and `<password>` with your credentials

## 🎯 Step 3: Backend Setup

### 1. Navigate to Server Directory
```bash
cd focusflow/server
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- morgan
- nodemon (dev)

### 3. Create Environment File
```bash
# Copy example file
cp .env.example .env

# Or create manually
touch .env
```

### 4. Configure .env File

Open `.env` and add:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (choose one)
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/focusflow

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/focusflow

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_random_and_long
JWT_EXPIRE=30d
```

**Important:** Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Start Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 6. Verify Backend is Running

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

Test the API:
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"FocusFlow API is running"}
```

## ⚛️ Step 4: Frontend Setup

### 1. Open New Terminal

Keep backend running and open a new terminal window

### 2. Navigate to Client Directory
```bash
cd focusflow/client
```

### 3. Install Dependencies
```bash
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- framer-motion
- recharts
- react-icons
- tailwindcss
- and more...

**Note:** Installation may take 2-3 minutes

### 4. Configure Environment (Optional)

Create `.env` file in client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Note:** This is optional as the app uses proxy in package.json

### 5. Start Frontend Server
```bash
npm start
```

### 6. Verify Frontend is Running

- Browser should automatically open to `http://localhost:3000`
- You should see the FocusFlow login page
- If not, manually navigate to `http://localhost:3000`

## 🔌 Step 5: Chrome Extension Setup

### 1. Open Chrome Extensions Page

Navigate to:
```
chrome://extensions/
```

Or: Menu → More Tools → Extensions

### 2. Enable Developer Mode

Toggle the "Developer mode" switch in the top-right corner

### 3. Load Extension

1. Click "Load unpacked" button
2. Navigate to `focusflow/chrome-extension` directory
3. Click "Select Folder"

### 4. Verify Extension is Loaded

- You should see "FocusFlow - Website Blocker" in the extensions list
- Pin the extension to toolbar for easy access
- Click the extension icon to test popup

## ✅ Step 6: Testing the Application

### 1. Create Test Account

1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Click "Sign Up"

### 2. Verify Dashboard

After registration, you should see:
- Dashboard with stats (all zeros initially)
- "Start Focus Mode" button
- Navigation menu

### 3. Create Test Task

1. Click "Tasks" in navigation
2. Click "Add Task"
3. Enter:
   - Title: Study React
   - Description: Complete tutorial
   - Priority: High
   - Pomodoros: 2
4. Click "Add Task"

### 4. Test Focus Mode

1. Return to Dashboard
2. Click "Start Focus Mode"
3. Allow fullscreen when prompted
4. Timer should start counting down
5. Try switching tabs → Violation should be detected
6. Try exiting fullscreen → Session should terminate

### 5. Test Chrome Extension

1. Click FocusFlow extension icon
2. Click "Enable Focus Mode"
3. Try to visit `youtube.com`
4. You should see the blocked page

### 6. Check Analytics

1. Complete a focus session
2. Navigate to "Analytics"
3. Verify charts display your session data

## 🚨 Common Issues & Solutions

### Issue: MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running:
   ```bash
   # Check status
   mongosh

   # Start if not running
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```

2. Check MongoDB URI in `.env`
3. For Atlas, check network access settings

### Issue: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Kill process using port:
   ```bash
   # Linux/macOS
   lsof -ti:5000 | xargs kill -9

   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. Or change port in `.env`:
   ```env
   PORT=5001
   ```

### Issue: React Not Starting

**Error:** `Module not found` or dependency errors

**Solutions:**
1. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solutions:**
1. Ensure backend is running
2. Check proxy in `client/package.json`:
   ```json
   "proxy": "http://localhost:5000"
   ```

3. Verify CORS is enabled in `server/server.js`

### Issue: JWT Token Error

**Error:** `Invalid token` or `Token expired`

**Solutions:**
1. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```

2. Login again
3. Check JWT_SECRET is set in `.env`

### Issue: Fullscreen Not Working

**Error:** Fullscreen API not working

**Solutions:**
1. Use Chrome browser (best compatibility)
2. Ensure user gesture triggered the fullscreen
3. Check browser permissions
4. Test in incognito mode

## 🎓 Ready for Development!

Your FocusFlow application is now fully set up and running!

### What's Running:
- ✅ Backend API: `http://localhost:5000`
- ✅ Frontend App: `http://localhost:3000`
- ✅ MongoDB Database: `localhost:27017` or Atlas
- ✅ Chrome Extension: Loaded and active

### Next Steps:
1. Explore the codebase
2. Try modifying components
3. Test all features
4. Review the code structure
5. Prepare for deployment

### Development Workflow:

**Making Changes:**
1. Edit files in your code editor
2. Frontend: Changes auto-reload in browser
3. Backend: Nodemon auto-restarts server
4. Extension: Reload extension in chrome://extensions/

**Stopping the App:**
```bash
# In each terminal
Ctrl + C
```

**Restarting the App:**
```bash
# Backend
cd focusflow/server
npm run dev

# Frontend (new terminal)
cd focusflow/client
npm start
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 🎉 Success!

You're all set! Your FocusFlow application is ready for development and testing.

For deployment instructions, see `DEPLOYMENT_GUIDE.md`

---

Need help? Check the main `README.md` or create an issue on GitHub.
