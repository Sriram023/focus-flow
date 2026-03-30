# FocusFlow - Intelligent Focus & Distraction Control Platform

A full-stack MERN application designed to help students completely avoid distractions during study sessions with exam-like strict focus enforcement.

## 🎯 Features

### 🔐 Authentication
- JWT-based secure authentication
- Protected routes
- Password hashing with bcrypt

### ⏱️ Pomodoro Focus System
- 25 min focus + 5 min break cycles
- Customizable durations
- Animated circular timer
- Auto-cycle with long breaks

### 🔒 Strict Focus Mode (EXAM-LIKE ENFORCEMENT)
- **Fullscreen Enforcement**: Auto-enters fullscreen; session terminates if exited
- **Tab Switch Detection**: Detects and logs tab switches as violations
- **Window Minimize Detection**: Tracks window state changes
- **Violation Tracking**: Complete logging of all distractions
- **Focus Score System**: Real-time scoring based on violations

### 🚫 Website Blocking
- Chrome extension blocks distracting websites
- Customizable blocked site list
- Instagram, YouTube, Facebook, Twitter, Reddit, TikTok, Netflix blocked by default

### 📊 Analytics Dashboard
- Focus hours tracking
- Session completion stats
- Violation analysis with charts
- Daily/weekly productivity trends
- Focus score visualization
- Study streak tracking

### ✅ Task Management
- Add/Edit/Delete tasks
- Priority levels (Low, Medium, High)
- Estimated Pomodoros per task
- Task completion tracking

### 🎨 Modern UI/UX
- Gradient backgrounds
- Glassmorphism effects
- Smooth animations with Framer Motion
- Dark/Light mode support
- Fully responsive design
- Tailwind CSS styling

## 📁 Project Structure

```
focusflow/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB models
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── StudySession.js
│   │   └── Violation.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── sessions.js
│   │   ├── violations.js
│   │   └── analytics.js
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── sessionController.js
│   │   ├── violationController.js
│   │   └── analyticsController.js
│   ├── middleware/        # Auth middleware
│   │   └── auth.js
│   ├── config/           # Database config
│   │   └── db.js
│   ├── utils/            # Utilities
│   │   └── generateToken.js
│   ├── server.js         # Entry point
│   ├── package.json
│   └── .env.example
│
├── client/               # Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── Timer.js
│   │   │   └── ViolationWarning.js
│   │   ├── pages/        # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── FocusMode.js
│   │   │   ├── Tasks.js
│   │   │   └── Analytics.js
│   │   ├── context/      # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── utils/        # Utilities
│   │   │   ├── api.js
│   │   │   └── focusDetection.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── chrome-extension/     # Chrome Extension
    ├── manifest.json
    ├── background.js
    ├── popup.html
    ├── popup.js
    └── blocked.html
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd focusflow/server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/focusflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Run the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd focusflow/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

### Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable "Developer mode" (toggle in top right)

3. Click "Load unpacked"

4. Select the `focusflow/chrome-extension` directory

5. The extension is now installed! Click the icon to enable/disable focus mode

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  focusScore: Number,
  totalFocusMinutes: Number,
  totalSessions: Number,
  currentStreak: Number,
  longestStreak: Number,
  settings: {
    focusDuration: Number,
    shortBreak: Number,
    longBreak: Number,
    darkMode: Boolean
  }
}
```

### StudySession Model
```javascript
{
  user: ObjectId,
  task: ObjectId,
  sessionType: String,
  plannedDuration: Number,
  actualDuration: Number,
  completed: Boolean,
  focusScore: Number,
  violationsCount: Number,
  startTime: Date,
  endTime: Date
}
```

### Violation Model
```javascript
{
  user: ObjectId,
  session: ObjectId,
  violationType: String,
  timestamp: Date,
  details: String,
  penaltyPoints: Number
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `PATCH /api/tasks/:id/toggle` - Toggle completion (protected)

### Sessions
- `GET /api/sessions` - Get all sessions (protected)
- `POST /api/sessions` - Create session (protected)
- `GET /api/sessions/:id` - Get session by ID (protected)
- `PUT /api/sessions/:id/complete` - Complete session (protected)
- `PUT /api/sessions/:id/terminate` - Terminate session (protected)

### Violations
- `GET /api/violations` - Get violations (protected)
- `POST /api/violations` - Log violation (protected)
- `GET /api/violations/stats` - Get violation stats (protected)
- `GET /api/violations/session/:sessionId` - Get session violations (protected)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data (protected)
- `GET /api/analytics/daily-focus` - Get daily focus data (protected)
- `GET /api/analytics/trends` - Get productivity trends (protected)

## 🎨 Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- React Icons

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- CORS

### Chrome Extension
- Manifest V3
- Chrome Storage API
- Chrome Tabs API
- Chrome WebNavigation API

## 🔥 Key Features Implementation

### Fullscreen Enforcement
Located in `client/src/utils/focusDetection.js`:
- Automatically enters fullscreen on session start
- Monitors fullscreen state changes
- Triggers session termination if fullscreen exited

### Tab Switch Detection
- Uses Visibility API and window blur events
- Logs violations to backend
- Reduces focus score on each violation

### Violation Tracking
- Real-time violation logging
- Categorized by type (tab-switch, fullscreen-exit, etc.)
- Penalty points system
- Visualization in analytics dashboard

## 📱 Usage Flow

1. **Register/Login** → Create account or sign in
2. **Dashboard** → View stats, tasks, and start focus session
3. **Create Tasks** → Add tasks you want to work on
4. **Start Focus Mode** → Click "Start Focus Mode" button
5. **Fullscreen Activation** → App enters fullscreen automatically
6. **Focus Session** → Work for 25 minutes without distractions
7. **Violation Detection** → Any tab switch or fullscreen exit is logged
8. **Session Completion** → Complete session to earn focus score
9. **Analytics** → Review your productivity and violations

## 🌐 Deployment

### Backend Deployment (Render/Railway)

1. Create account on Render.com or Railway.app
2. Connect your GitHub repository
3. Configure environment variables:
   - `MONGODB_URI` (use MongoDB Atlas)
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy!

### Frontend Deployment (Vercel)

1. Create account on Vercel.com
2. Import your GitHub repository
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variable: `REACT_APP_API_URL` (your backend URL)
4. Deploy!

### MongoDB Atlas Setup

1. Create account on mongodb.com/atlas
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Use in `MONGODB_URI`

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/focusflow
JWT_SECRET=your_super_secret_key_min_32_characters_long
JWT_EXPIRE=30d
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 🎓 For Viva/Demo

### Key Points to Highlight:
1. **Unique Feature**: Exam-like strict focus enforcement
2. **Violation Tracking System**: Real-time monitoring and logging
3. **Full-Stack Implementation**: Complete MERN architecture
4. **Chrome Extension Integration**: Additional blocking layer
5. **Analytics Dashboard**: Data visualization with charts
6. **Modern UI/UX**: Professional design with animations

### Demo Flow:
1. Show login/registration
2. Demonstrate dashboard with stats
3. Create a sample task
4. Start focus mode and show fullscreen enforcement
5. Try to switch tabs → show violation detection
6. Complete session
7. Show analytics with violations logged

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access in MongoDB Atlas

### CORS Error
- Backend CORS is enabled for all origins in development
- For production, configure specific origins

### Fullscreen Not Working
- Some browsers require user gesture to enter fullscreen
- Test in Chrome for best compatibility

## 📄 License

MIT License - Feel free to use for educational purposes

## 👨‍💻 Author

Built with ❤️ for productivity and focus

---

**⚡ FocusFlow - Stay Focused, Stay Productive!**
