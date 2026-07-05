# 🏢 Leave Management System

A full-stack, role-based Leave Management System built with **React** (Vite) and **Node.js** (Express + MongoDB). It features a premium dark/light themed UI, real-time notifications, interactive analytics charts, and multi-category leave tracking.

---

## 📸 Key Highlights

- 🌓 **Dark / Light Mode** with smooth theme transitions
- 📊 **Interactive Analytics Charts** — Employee-wise leave tracking with detailed tooltips
- 🔔 **Real-time Notification Bell** with unread counts and mark-all-as-read
- 🛡️ **Role-Based Access Control** — Super Admin vs Employee dashboards
- 📅 **Date Overlap Prevention** — Smart conflict detection for leave applications
- 🖼️ **Profile Photo Upload** — Local image upload with lightbox viewer (up to 3MB)
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer        | Technology                                                          |
| ------------ | ------------------------------------------------------------------- |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, Redux Toolkit, Framer Motion     |
| **Backend**  | Node.js, Express 4, Mongoose 8, JWT Authentication, Joi Validation  |
| **Database** | MongoDB (local or Atlas)                                            |
| **Icons**    | Lucide React                                                        |
| **Toasts**   | React Hot Toast                                                     |

---

## 📁 Project Structure

```
Leave Management/
├── frontend/                    # React + Vite application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, logos
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI components
│   │   │   │   ├── Avatar.jsx       # Profile avatar with initials fallback
│   │   │   │   ├── Badge.jsx        # Status badges (Approved, Pending, etc.)
│   │   │   │   ├── Button.jsx       # Themed button variants
│   │   │   │   ├── Card.jsx         # Glassmorphism card container
│   │   │   │   ├── ConfirmDialog.jsx # Confirmation popup
│   │   │   │   ├── EmptyState.jsx   # Empty data placeholder
│   │   │   │   ├── FormField.jsx    # Form field wrapper
│   │   │   │   ├── Input.jsx        # Themed text input
│   │   │   │   ├── Loader.jsx       # Loading spinner
│   │   │   │   ├── Modal.jsx        # Animated modal dialog
│   │   │   │   ├── Pagination.jsx   # Table pagination controls
│   │   │   │   ├── PasswordInput.jsx # Password with toggle visibility
│   │   │   │   ├── SearchBar.jsx    # Search input component
│   │   │   │   ├── Select.jsx       # Custom themed dropdown
│   │   │   │   ├── StatsCard.jsx    # Dashboard metric card
│   │   │   │   ├── Table.jsx        # Sortable data table
│   │   │   │   ├── Textarea.jsx     # Themed textarea
│   │   │   │   └── ThemeSwitch.jsx  # Dark/light mode toggle
│   │   │   └── layout/
│   │   │       ├── Navbar.jsx       # Top navigation with notifications
│   │   │       └── Sidebar.jsx      # Collapsible sidebar navigation
│   │   ├── constants/           # App-wide constants (roles, leave types)
│   │   ├── hooks/
│   │   │   └── useValidator.js  # Form validation hook
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx    # Admin metrics & employee leave chart
│   │   │   │   ├── Employees.jsx    # Employee CRUD management
│   │   │   │   └── Leaves.jsx       # Leave request review & approval
│   │   │   ├── employee/
│   │   │   │   ├── ApplyLeave.jsx   # Leave application form
│   │   │   │   ├── Dashboard.jsx    # Employee stats & monthly chart
│   │   │   │   └── LeaveHistory.jsx # Personal leave history table
│   │   │   ├── shared/
│   │   │   │   └── Profile.jsx      # Profile editor with photo upload
│   │   │   ├── login.jsx            # Login page
│   │   │   └── register.jsx         # Registration page
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   └── authSlice.js     # Authentication state management
│   │   │   └── store.js             # Redux store with persist
│   │   ├── routes/
│   │   │   └── index.jsx            # Route guards & layout wrappers
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   ├── auth.service.js      # Auth API calls
│   │   │   ├── leave.service.js     # Leave API calls
│   │   │   ├── notification.service.js # Notification API calls
│   │   │   └── user.service.js      # User/Employee API calls
│   │   ├── theme/
│   │   │   └── ThemeContext.jsx      # Dark/light mode context provider
│   │   ├── App.jsx                  # Root app with routing
│   │   ├── index.css                # Global styles & Tailwind config
│   │   └── main.jsx                 # React entry point
│   ├── index.html                   # HTML template
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js               # Vite config with API proxy
│
├── backend/                     # Express + MongoDB API server
│   ├── config/
│   │   └── db.js                    # MongoDB connection handler
│   ├── controllers/
│   │   ├── auth.controller.js       # Login, logout, profile update
│   │   ├── leave.controller.js      # Leave CRUD, approval, stats
│   │   ├── notification.controller.js # Notification fetch & read
│   │   └── user.controller.js       # Employee CRUD by admin
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification & role guard
│   │   ├── error.js                 # Global error handler
│   │   └── validate.js              # Joi schema validation middleware
│   ├── models/
│   │   ├── Leave.js                 # Leave request schema
│   │   ├── Notification.js          # Notification schema
│   │   └── User.js                  # User schema with leave balances
│   ├── routes/
│   │   ├── auth.routes.js           # /api/auth/*
│   │   ├── leave.routes.js          # /api/leaves/*
│   │   ├── notification.routes.js   # /api/notifications/*
│   │   └── user.routes.js           # /api/users/*
│   ├── schemas/
│   │   ├── auth.schema.js           # Joi schemas for auth endpoints
│   │   └── user.schema.js           # Joi schemas for user endpoints
│   ├── scripts/
│   │   ├── seed.js                  # Database seeder (Super Admin)
│   │   └── clear.js                 # Database reset script
│   ├── server.js                    # Express app entry point
│   ├── package.json
│   ├── .env                         # Environment variables (local)
│   └── .env.example                 # Environment template
│
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** running locally on port `27017` or a MongoDB Atlas URI
- **npm** (bundled with Node.js)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Leave Management"
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file (or copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/leave-management
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Seed the database with the Super Admin account:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

> Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs on `http://localhost:5173` with API requests proxied to port 5000

### 4. Default Login Credentials

| Role         | Email               | Password   |
| ------------ | ------------------- | ---------- |
| Super Admin  | `admin@example.com` | `Admin123` |

---

## 🔑 User Roles & Permissions

### Super Admin
- View organization-wide dashboard with analytics charts
- Create, edit, and delete employee accounts
- Configure per-employee leave balances (Casual, Sick, Paid, Emergency, WFH)
- Approve or reject leave requests with admin remarks
- View all employee leave requests

### Employee
- View personal dashboard with leave balance progress bars and monthly chart
- Apply for leaves (with date overlap protection)
- View and manage personal leave history
- Cancel pending leave requests
- Edit and update leave applications
- Upload custom profile photos

---

## 📊 Data Models

### User

| Field           | Type     | Description                                          |
| --------------- | -------- | ---------------------------------------------------- |
| `name`          | String   | Full name (required)                                 |
| `email`         | String   | Unique email address (required)                      |
| `password`      | String   | Hashed with bcrypt (min 6 chars)                     |
| `role`          | String   | `Super Admin` or `Employee`                          |
| `department`    | String   | Department name                                      |
| `designation`   | String   | Job title                                            |
| `phone`         | String   | Contact number                                       |
| `employeeCode`  | String   | Unique employee identifier (required)                |
| `avatar`        | String   | Profile photo URL or base64 data URI                 |
| `leaveBalances` | Object   | `{ Casual, Sick, Paid, Emergency, WFH }` (default 12 each) |

### Leave

| Field         | Type     | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| `employee`    | ObjectId | Reference to User model                                      |
| `leaveType`   | String   | `Casual`, `Sick`, `Paid`, `Emergency`, or `Work From Home`  |
| `startDate`   | Date     | Leave start date                                              |
| `endDate`     | Date     | Leave end date                                                |
| `days`        | Number   | Total leave days (min 0.5)                                    |
| `reason`      | String   | Reason for leave (required)                                   |
| `status`      | String   | `Pending`, `Approved`, `Rejected`, or `Cancelled`            |
| `adminRemark` | String   | Admin's comment on approval/rejection                         |

### Notification

| Field         | Type     | Description                        |
| ------------- | -------- | ---------------------------------- |
| `title`       | String   | Notification title                 |
| `description` | String   | Notification body                  |
| `user`        | ObjectId | Target user reference              |
| `read`        | Boolean  | Read/unread status (default false) |

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint            | Access  | Description                   |
| ------ | ------------------- | ------- | ----------------------------- |
| POST   | `/login`            | Public  | Login with email & password   |
| POST   | `/logout`           | Private | Logout and clear session      |
| PUT    | `/profile`          | Private | Update profile info & avatar  |
| PUT    | `/change-password`  | Private | Change account password       |

### Users / Employees (`/api/users`)

| Method | Endpoint     | Access      | Description                      |
| ------ | ------------ | ----------- | -------------------------------- |
| GET    | `/`          | Super Admin | List employees (paginated, search) |
| POST   | `/`          | Super Admin | Create new employee              |
| PUT    | `/:id`       | Super Admin | Update employee details          |
| DELETE | `/:id`       | Super Admin | Delete employee account          |

### Leaves (`/api/leaves`)

| Method | Endpoint              | Access      | Description                           |
| ------ | --------------------- | ----------- | ------------------------------------- |
| GET    | `/`                   | Super Admin | List all leave requests (filtered)    |
| GET    | `/my-leaves`          | Employee    | List own leave history                |
| GET    | `/stats`              | Private     | Dashboard stats & analytics data      |
| POST   | `/`                   | Employee    | Apply for a new leave                 |
| PUT    | `/:id`                | Employee    | Update a pending leave request        |
| POST   | `/:id/cancel`         | Employee    | Cancel a pending request              |
| POST   | `/:id/approve-reject` | Super Admin | Approve or reject with remarks        |

### Notifications (`/api/notifications`)

| Method | Endpoint     | Access  | Description                  |
| ------ | ------------ | ------- | ---------------------------- |
| GET    | `/`          | Private | Fetch user notifications     |
| PUT    | `/read-all`  | Private | Mark all as read             |

---

## ⚙️ Key Features in Detail

### 🔒 Authentication & Security
- JWT-based stateless authentication stored in Redux with `redux-persist`
- Passwords hashed with `bcryptjs` (10 salt rounds)
- Automatic session expiration handling with Axios interceptors
- Role-based route protection on both frontend and backend

### 📅 Smart Leave Management
- **5 Leave Categories:** Casual, Sick, Paid, Emergency, Work From Home
- **Configurable Balances:** Admin can set custom leave counts per employee (defaults to 12 each)
- **Date Overlap Protection:** System prevents applying for dates that already have a Pending or Approved leave
- **Balance Validation:** Leave balance is verified before submission; deducted on approval and restored on rejection

### 📊 Analytics & Visualization
- **Admin Dashboard:** Employee-wise leave comparison bar chart with per-type breakdown tooltips
- **Employee Dashboard:** Monthly leave history chart with personal stats and balance progress bars
- **Leave Type Distribution:** Visual breakdown of approved leaves by category

### 🖼️ Profile Management
- Upload custom photos from local device (up to 3MB, base64 encoded)
- Choose from 6 preset avatar options
- Enter custom image URL
- Full-screen lightbox viewer with eye button
- Delete/remove profile photo option

### 🔔 Notifications
- Auto-generated on leave application, approval, and rejection
- Bell icon with unread count badge
- Dropdown panel with mark-all-as-read functionality

---

## 🧪 Available Scripts

### Backend (`/backend`)

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start with nodemon (hot-reload)      |
| `npm start`      | Start production server              |
| `npm run seed`   | Seed database with Super Admin       |
| `npm run clear`  | Clear all data from database         |

### Frontend (`/frontend`)

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start Vite dev server              |
| `npm run build`    | Build for production               |
| `npm run preview`  | Preview production build           |
| `npm run lint`     | Run OxLint linter                  |

---

## 🎨 Design System

The UI is built with a custom Tailwind CSS 4 theme featuring:

- **Brand Colors:** Custom purple/indigo palette (`brand-50` through `brand-950`)
- **Glass Morphism:** Frosted glass card effects with `backdrop-blur`
- **Dark Mode:** Full dark theme support with system preference detection
- **Micro-Animations:** Framer Motion for page transitions, hover effects, and loading states
- **Typography:** Clean, modern font stack with uppercase tracking for labels
- **Responsive:** Mobile-first design with collapsible sidebar

---

## 📝 Environment Variables

| Variable       | Default                                        | Description                |
| -------------- | ---------------------------------------------- | -------------------------- |
| `PORT`         | `5000`                                         | Backend server port        |
| `MONGODB_URI`  | `mongodb://127.0.0.1:27017/leave-management`  | MongoDB connection string  |
| `JWT_SECRET`   | —                                              | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | `7d`                                         | Token expiration duration  |
| `NODE_ENV`     | `development`                                  | Environment mode           |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
