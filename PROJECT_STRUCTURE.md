# FocusFlow - Complete Project Structure

## 📁 Directory Tree

```
focusflow/
│
├── 📄 README.md                          # Main documentation
├── 📄 SETUP_GUIDE.md                    # Setup instructions
├── 📄 DEPLOYMENT_GUIDE.md               # Deployment instructions
├── 📄 PROJECT_STRUCTURE.md              # This file
├── 📄 .gitignore                        # Git ignore rules
│
├── 📂 server/                           # Backend (Node.js + Express)
│   ├── 📄 package.json                  # Backend dependencies
│   ├── 📄 server.js                     # Server entry point
│   ├── 📄 .env.example                  # Environment variables template
│   │
│   ├── 📂 config/
│   │   └── 📄 db.js                     # MongoDB connection config
│   │
│   ├── 📂 models/                       # MongoDB schemas
│   │   ├── 📄 User.js                   # User model
│   │   ├── 📄 Task.js                   # Task model
│   │   ├── 📄 StudySession.js           # Study session model
│   │   └── 📄 Violation.js              # Violation model
│   │
│   ├── 📂 controllers/                  # Business logic
│   │   ├── 📄 authController.js         # Authentication logic
│   │   ├── 📄 taskController.js         # Task CRUD logic
│   │   ├── 📄 sessionController.js      # Session management logic
│   │   ├── 📄 violationController.js    # Violation tracking logic
│   │   └── 📄 analyticsController.js    # Analytics & stats logic
│   │
│   ├── 📂 routes/                       # API endpoints
│   │   ├── 📄 auth.js                   # Auth routes
│   │   ├── 📄 tasks.js                  # Task routes
│   │   ├── 📄 sessions.js               # Session routes
│   │   ├── 📄 violations.js             # Violation routes
│   │   └── 📄 analytics.js              # Analytics routes
│   │
│   ├── 📂 middleware/
│   │   └── 📄 auth.js                   # JWT authentication middleware
│   │
│   └── 📂 utils/
│       └── 📄 generateToken.js          # JWT token generator
│
├── 📂 client/                           # Frontend (React)
│   ├── 📄 package.json                  # Frontend dependencies
│   ├── 📄 tailwind.config.js            # Tailwind CSS config
│   ├── 📄 postcss.config.js             # PostCSS config
│   │
│   ├── 📂 public/
│   │   └── 📄 index.html                # HTML template
│   │
│   └── 📂 src/
│       ├── 📄 index.js                  # React entry point
│       ├── 📄 App.js                    # Main App component with routing
│       ├── 📄 index.css                 # Global styles + Tailwind
│       │
│       ├── 📂 components/               # Reusable React components
│       │   ├── 📄 Timer.js              # Pomodoro timer component
│       │   └── 📄 ViolationWarning.js   # Violation alert component
│       │
│       ├── 📂 pages/                    # Page components
│       │   ├── 📄 Login.js              # Login page
│       │   ├── 📄 Register.js           # Registration page
│       │   ├── 📄 Dashboard.js          # Main dashboard
│       │   ├── 📄 FocusMode.js          # Focus mode (fullscreen)
│       │   ├── 📄 Tasks.js              # Task management page
│       │   └── 📄 Analytics.js          # Analytics & charts page
│       │
│       ├── 📂 context/                  # React Context API
│       │   ├── 📄 AuthContext.js        # User authentication context
│       │   └── 📄 ThemeContext.js       # Dark/Light theme context
│       │
│       ├── 📂 utils/                    # Utility functions
│       │   ├── 📄 api.js                # Axios API client
│       │   └── 📄 focusDetection.js     # Focus detection utilities
│       │
│       ├── 📂 hooks/                    # Custom React hooks (empty for now)
│       ├── 📂 styles/                   # Additional styles (empty for now)
│       └── 📂 assets/                   # Images, icons (empty for now)
│
└── 📂 chrome-extension/                 # Chrome Extension
    ├── 📄 manifest.json                 # Extension manifest (V3)
    ├── 📄 background.js                 # Service worker
    ├── 📄 popup.html                    # Extension popup UI
    ├── 📄 popup.js                      # Popup logic
    ├── 📄 blocked.html                  # Blocked website page
    └── 📂 icons/                        # Extension icons
        ├── 📄 icon16.png               # 16x16 icon (placeholder)
        ├── 📄 icon48.png               # 48x48 icon (placeholder)
        └── 📄 icon128.png              # 128x128 icon (placeholder)
```

## 📊 File Descriptions

### Backend Files

#### `server/server.js`
- Express server setup
- Middleware configuration (CORS, JSON parsing, Morgan)
- Route mounting
- Error handling
- Server initialization

#### `server/config/db.js`
- MongoDB connection function
- Connection error handling

#### Models (`server/models/`)

**User.js:**
- User schema with authentication fields
- Focus score, streaks, and stats
- Settings (Pomodoro durations, preferences)
- Password hashing pre-save middleware
- Password comparison method

**Task.js:**
- Task schema with title, description
- Priority levels (low, medium, high)
- Estimated and completed Pomodoros
- Completion status

**StudySession.js:**
- Session tracking schema
- Planned vs actual duration
- Focus score calculation
- Violation count
- Session type (focus, break)

**Violation.js:**
- Violation logging schema
- Types: tab-switch, fullscreen-exit, etc.
- Timestamp and penalty points
- Session reference

#### Controllers (`server/controllers/`)

**authController.js:**
- `registerUser`: Create new user account
- `loginUser`: Authenticate user, return JWT
- `getUserProfile`: Get user details
- `updateUserProfile`: Update user settings

**taskController.js:**
- `getTasks`: Fetch all user tasks
- `createTask`: Create new task
- `updateTask`: Update task details
- `deleteTask`: Remove task
- `toggleTaskCompletion`: Mark complete/incomplete

**sessionController.js:**
- `getSessions`: Fetch user sessions
- `createSession`: Start new focus session
- `completeSession`: Mark session complete, update stats
- `terminateSession`: End session early (violation)
- `getSessionById`: Get single session details

**violationController.js:**
- `logViolation`: Record violation event
- `getViolations`: Fetch user violations
- `getSessionViolations`: Violations for specific session
- `getViolationStats`: Aggregated violation statistics

**analyticsController.js:**
- `getDashboardAnalytics`: Main dashboard stats
- `getDailyFocusData`: Daily focus time for charts
- `getProductivityTrends`: Weekly/monthly trends

#### Routes (`server/routes/`)

All routes are prefixed with `/api/`:

- `/auth`: Authentication endpoints
- `/tasks`: Task management endpoints
- `/sessions`: Focus session endpoints
- `/violations`: Violation tracking endpoints
- `/analytics`: Analytics and stats endpoints

### Frontend Files

#### `client/src/App.js`
- React Router setup
- Route protection logic
- Public vs protected routes
- Loading states

#### `client/src/index.js`
- React DOM rendering
- Root component mounting

#### Components (`client/src/components/`)

**Timer.js:**
- Circular progress timer
- Countdown display
- Pause/resume functionality
- Completion callback
- SVG-based progress ring

**ViolationWarning.js:**
- Alert notification component
- Animated entrance/exit
- Different messages per violation type
- Auto-dismiss after 3 seconds

#### Pages (`client/src/pages/`)

**Login.js:**
- Email/password login form
- Error handling
- Redirect to dashboard on success
- Link to registration

**Register.js:**
- User registration form
- Password confirmation
- Validation
- Auto-login after signup

**Dashboard.js:**
- Stats grid (focus score, streak, time, violations)
- Daily focus chart (Recharts)
- "Start Focus Mode" CTA
- Today's summary
- Navigation header

**FocusMode.js:**
- Fullscreen focus session
- Timer integration
- Violation detection hooks
- Session state management
- Focus score tracking
- Warning overlays

**Tasks.js:**
- Task list display
- Add task modal
- Edit/delete functionality
- Priority badges
- Completion toggle

**Analytics.js:**
- Bar chart: Daily focus time
- Line chart: Sessions completed
- Pie chart: Violation distribution
- Statistics table

#### Context (`client/src/context/`)

**AuthContext.js:**
- User state management
- Login/logout functions
- Token handling
- Profile updates
- Loading states

**ThemeContext.js:**
- Dark/light mode toggle
- Theme persistence (localStorage)
- Class-based theme switching

#### Utils (`client/src/utils/`)

**api.js:**
- Axios instance configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)
- Base URL configuration

**focusDetection.js:**
- Fullscreen API wrapper
- Visibility change detection
- Tab switch detection
- Window blur/focus detection
- Event listener management
- Violation callback system

### Chrome Extension Files

#### `manifest.json`
- Extension metadata
- Permissions (storage, tabs, webNavigation)
- Background service worker
- Popup configuration
- Icons

#### `background.js`
- Service worker (runs in background)
- Website blocking logic
- Navigation event listener
- Message handling from popup
- Storage management

#### `popup.html`
- Extension popup UI
- Toggle focus mode button
- Blocked sites list
- Status display

#### `popup.js`
- Popup interaction logic
- Message passing to background
- UI updates

#### `blocked.html`
- Full-page block screen
- Motivational message
- Displayed when user visits blocked site

## 🔄 Data Flow

### Authentication Flow
```
User Input (Login.js)
    ↓
AuthContext.login()
    ↓
POST /api/auth/login
    ↓
authController.loginUser
    ↓
User.findOne() + password check
    ↓
Generate JWT token
    ↓
Return user + token
    ↓
Store in localStorage
    ↓
Redirect to Dashboard
```

### Focus Session Flow
```
User clicks "Start Focus Mode" (Dashboard.js)
    ↓
Navigate to FocusMode.js
    ↓
POST /api/sessions (create session)
    ↓
Enter fullscreen
    ↓
Start focus detection monitoring
    ↓
Timer counts down
    ↓
[Violation occurs]
    ↓
POST /api/violations (log violation)
    ↓
Update session.focusScore
    ↓
Show ViolationWarning component
    ↓
[Session completes]
    ↓
PUT /api/sessions/:id/complete
    ↓
Update user stats (streak, total time)
    ↓
Exit fullscreen
    ↓
Navigate to Dashboard
```

### Violation Detection Flow
```
Focus session active
    ↓
focusDetection.startMonitoring()
    ↓
Listen for events:
  - window.blur
  - document.visibilitychange
  - fullscreenchange
    ↓
Event triggered
    ↓
Call violation callback
    ↓
POST /api/violations
    ↓
Create Violation document
    ↓
Update StudySession.violationsCount
    ↓
Update StudySession.focusScore
    ↓
Return violation data
    ↓
Show warning to user
```

## 🗃️ Database Collections

### `users`
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  focusScore: Number,
  totalFocusMinutes: Number,
  totalSessions: Number,
  currentStreak: Number,
  longestStreak: Number,
  lastSessionDate: Date,
  settings: {
    focusDuration: Number,
    shortBreak: Number,
    longBreak: Number,
    darkMode: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### `tasks`
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  title: String,
  description: String,
  completed: Boolean,
  estimatedPomodoros: Number,
  completedPomodoros: Number,
  priority: String (low/medium/high),
  dueDate: Date,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

### `studysessions`
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  task: ObjectId (ref: Task),
  sessionType: String (focus/short-break/long-break),
  plannedDuration: Number,
  actualDuration: Number,
  completed: Boolean,
  startTime: Date,
  endTime: Date,
  focusScore: Number,
  violationsCount: Number,
  notes: String,
  sessionNumber: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### `violations`
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  session: ObjectId (ref: StudySession),
  violationType: String (tab-switch/fullscreen-exit/etc),
  timestamp: Date,
  details: String,
  penaltyPoints: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Key Features Implementation

### 1. JWT Authentication
- **Location:** `server/middleware/auth.js`, `server/utils/generateToken.js`
- **Flow:** Login → Generate token → Store in localStorage → Send with requests

### 2. Fullscreen Enforcement
- **Location:** `client/src/utils/focusDetection.js`, `client/src/pages/FocusMode.js`
- **Implementation:** Fullscreen API + event listeners

### 3. Violation Tracking
- **Location:** Backend controllers + frontend detection
- **Types:** Tab switch, fullscreen exit, window minimize
- **Penalty:** -5 to -10 points per violation

### 4. Focus Score Algorithm
```javascript
initialScore = 100
finalScore = initialScore - (violations × penaltyPoints)
userScore = weightedAverage(allSessionScores)
```

### 5. Streak Calculation
```javascript
if (lastSession was yesterday) {
  currentStreak += 1
} else if (lastSession was today) {
  // No change
} else {
  currentStreak = 1  // Reset
}
```

## 📦 Dependencies

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT tokens
- dotenv: Environment variables
- cors: Cross-origin requests
- morgan: HTTP logging

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- framer-motion: Animations
- recharts: Charts
- react-icons: Icons
- tailwindcss: CSS framework

## 🚀 Getting Started

1. Read `README.md` for overview
2. Follow `SETUP_GUIDE.md` for local setup
3. Use `DEPLOYMENT_GUIDE.md` for production deployment
4. Refer to this file for understanding structure

---

**Total Files:** 50+ files
**Lines of Code:** ~5000+ lines
**Technologies:** MERN Stack + Chrome Extension
**Features:** 20+ major features

Built with ❤️ for maximum productivity!
