# FocusFlow - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install MongoDB
```bash
# Download MongoDB Community Edition
# https://www.mongodb.com/try/download/community
```

### Step 2: Start Backend
```bash
cd focusflow/server
npm install
cp .env.example .env
# Edit .env and set MONGODB_URI and JWT_SECRET
npm run dev
```

### Step 3: Start Frontend (New Terminal)
```bash
cd focusflow/client
npm install
npm start
```

### Step 4: Open Browser
Navigate to `http://localhost:3000`

### Step 5: Create Account
- Click "Sign Up"
- Enter name, email, password
- Done!

## ✅ Verify Everything Works

1. Login to your account
2. Create a test task
3. Click "Start Focus Mode"
4. Allow fullscreen
5. Wait for timer to count down
6. Check Analytics page

## 🎯 For Demo/Viva

### What to Show:

1. **Authentication System**
   - Register new user
   - Login/logout functionality
   - Protected routes

2. **Strict Focus Mode** (MOST IMPORTANT)
   - Auto fullscreen
   - Try switching tabs → Violation detected!
   - Try exiting fullscreen → Session terminates!
   - Show violation warning popup

3. **Task Management**
   - Create tasks with priorities
   - Link tasks to sessions
   - Mark complete

4. **Analytics Dashboard**
   - Focus score calculation
   - Violation statistics with charts
   - Study streak tracking
   - Daily focus time graph

5. **Chrome Extension**
   - Load extension
   - Enable focus mode
   - Try visiting YouTube → Blocked!

### Key Selling Points:

✅ **Exam-like enforcement** - Not just a timer
✅ **Real-time violation tracking** - Unique feature
✅ **Complete full-stack MERN** - Production-ready
✅ **Modern UI/UX** - Glassmorphism + animations
✅ **Chrome extension** - Extra blocking layer

## 📊 Technical Highlights for Viva

- **Backend:** RESTful API with Express + MongoDB
- **Authentication:** JWT-based secure auth
- **Frontend:** React with Context API, React Router
- **Styling:** Tailwind CSS + Framer Motion animations
- **Charts:** Recharts for data visualization
- **Detection:** Fullscreen API + Visibility API
- **Extension:** Chrome Manifest V3

## 🔥 Unique Features

1. **Fullscreen Enforcement** - Forces user to stay in app
2. **Violation Logging System** - Tracks every distraction
3. **Focus Score Algorithm** - Gamification of focus
4. **Study Streak Tracking** - Habit formation
5. **Website Blocking** - Chrome extension integration

## 📁 Code Files to Highlight

### Most Important:
1. `server/models/Violation.js` - Violation schema
2. `client/src/utils/focusDetection.js` - Detection logic
3. `client/src/pages/FocusMode.js` - Main focus UI
4. `server/controllers/sessionController.js` - Session logic
5. `chrome-extension/background.js` - Extension logic

### Show the Data Flow:
```
User starts session →
Creates StudySession in DB →
Enters fullscreen →
Monitors for violations →
Logs to Violation collection →
Updates focus score →
Displays analytics
```

## 💡 Questions They Might Ask

**Q: How do you detect tab switching?**
A: Using Visibility API and window blur events in `focusDetection.js`

**Q: How is the focus score calculated?**
A: Start at 100, subtract penalty points per violation (5-10 points)

**Q: Can users cheat the system?**
A: Hard to cheat - fullscreen exit terminates session, all events logged

**Q: How do you store data?**
A: MongoDB with 4 collections: Users, Tasks, Sessions, Violations

**Q: Is the extension necessary?**
A: No, but it adds an extra layer of website blocking

**Q: How would you scale this?**
A: Deploy to cloud (Vercel + Render), use MongoDB Atlas, implement caching

**Q: What about mobile?**
A: Could build React Native app with similar logic

## 🎓 For Placement Interviews

### Features to Emphasize:
1. Full-stack development experience
2. RESTful API design
3. State management (Context API)
4. Authentication & authorization
5. Data visualization
6. Browser extension development
7. Deployment experience

### Technologies Learned:
- MongoDB aggregation pipelines
- JWT token authentication
- React Hooks & Context
- Tailwind CSS
- Framer Motion
- Recharts
- Chrome Extension APIs
- Fullscreen & Visibility APIs

## 📝 Default Test Account

After setup, create a test account:
- **Email:** demo@focusflow.com
- **Password:** demo123
- **Name:** Demo User

Or register your own!

## 🔗 Important Links

- Main README: `README.md`
- Setup Guide: `SETUP_GUIDE.md`
- Deployment: `DEPLOYMENT_GUIDE.md`
- Structure: `PROJECT_STRUCTURE.md`

## ⚡ Troubleshooting

**Backend won't start:**
- Check MongoDB is running: `mongosh`
- Verify .env file exists and has correct values

**Frontend errors:**
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

**Can't login:**
- Check backend is running on port 5000
- Check browser console for errors
- Verify MongoDB connection

## 🎉 You're Ready!

Your FocusFlow application is complete and ready to demo!

**Good luck with your viva/placement! 🚀**
