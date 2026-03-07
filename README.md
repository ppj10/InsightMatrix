# InsightMatrix - Analytics Dashboard

A modern, feature-rich analytics dashboard built with React 18, TypeScript, Redux Toolkit, and Recharts. Showcases best practices in state management, performance optimization, and responsive design.

## Features

- **Admin Login Page** - JWT-based authentication with mock token generation
- **Add Users** - Authenticated admins can add new users with validation
- **Persistent Data** - User data stored in MongoDB, persists across sessions
- **Role-Based Access Control** - Admins can only see and manage their own users
- **Dynamic Metrics Cards** - Display key performance indicators with trends
- **Interactive Charts** - Revenue trends and performance metrics using Recharts
- **Paginated User Table** - User management with search and filtering
- **Redux State Management** - Separate loading states for metrics and tabular data
- **Backend API** - Express.js server with MongoDB integration
- **Optimized Performance** - Memoization techniques and derived state patterns
- **Responsive Design** - Fully responsive across desktop, tablet, and mobile devices
- **Type-Safe** - Full TypeScript support with strict mode enabled

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **State Management**: Redux Toolkit & React-Redux
- **Build Tool**: Vite
- **Data Visualization**: Recharts
- **Styling**: CSS3

## Project Structure

```
## Project Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Login.css
│   ├── metrics/
│   │   ├── MetricsSection.tsx
│   │   ├── MetricsCard.tsx
│   │   └── *.css
│   ├── charts/
│   │   ├── ChartsSection.tsx
│   │   └── ChartsSection.css
│   └── users/
│       ├── UsersSection.tsx
│       ├── UserTable.tsx
│       ├── SearchBar.tsx
│       ├── Pagination.tsx
│       ├── AddUserModal.tsx
│       └── *.css
├── services/
│   └── api.ts
├── store/
│   ├── store.ts
│   ├── hooks.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── metricsSlice.ts
│       └── usersSlice.ts
├── App.tsx
├── App.css
├── main.tsx
└── index.css

/
├── server.js              # Express.js backend server
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env                   # Environment variables (not committed)
├── .env.example           # Example environment variables
├── .gitignore
└── README.md
```
```

### Feature-Based Architecture

The project uses a feature-based folder structure for scalability:

- **Metrics Feature** - Key performance indicators and metric cards
- **Charts Feature** - Data visualizations with Recharts
- **Users Feature** - User table with search and pagination

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally OR a MongoDB Atlas cloud account
- npm or yarn package manager

### Demo Credentials

The application uses mock JWT authentication for demo purposes:
- **Email**: admin@example.com
- **Password**: any password

Note: Each admin ID will show different users based on the `adminId` field in MongoDB.

### Installation

```bash
npm install
```

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: MongoDB runs as a service (check Services app)
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update `.env` with your connection string: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/insightmatrix`

### Environment Configuration

Copy `.env.example` to `.env` and update if using MongoDB Atlas:

```bash
cp .env.example .env
```

Then edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/insightmatrix
PORT=5000
NODE_ENV=development
```

### Running the Application

#### Development (Frontend Only)
```bash
npm run dev
```
Runs Vite dev server at `http://localhost:5173`

#### Development (Backend Only)
```bash
npm run dev:server
```
Runs Express server at `http://localhost:5000`

#### Development (Full Stack - Recommended)
```bash
npm run dev:all
```
Runs both frontend and backend concurrently

#### Production Build
```bash
npm run build
```
Creates optimized production build in `/dist` folder

#### Preview Production Build
```bash
npm run preview
```
Previews the production build locally

## Performance Optimizations

1. **Memoization** - Components wrapped with `React.memo()` to prevent unnecessary re-renders
2. **useMemo Hooks** - Computed values memoized to prevent expensive recalculations
3. **Derived State Pattern** - Complex state computations (filtering, pagination) done in useMemo
4. **Lazy Imports** - Features can be lazy loaded (ready for implementation)
5. **Code Splitting** - Vite handles automatic code splitting

## Redux Store Structure

### Auth Slice
- Manages admin authentication state
- Stores JWT token and admin user information
- Persists token in localStorage
- Actions: `loginSuccess`, `loginError`, `logout`, `clearError`

### Metrics Slice
- Manages key performance indicators
- Separate loading state for metrics
- Actions: `setMetricsLoading`, `setMetricsError`, `setMetrics`

### Users Slice
- Manages user data, pagination, and search state
- Separate loading state for user data
- Filters users by admin ID (role-based access)
- Actions: `setUsersLoading`, `setUsersError`, `setCurrentPage`, `setSearchTerm`, `setUsers`

## Key Implementation Details

### Authentication Flow
- **Login Page** - Beautiful, responsive login interface with form validation
- **JWT Token Management** - Tokens stored in localStorage and validated on app load
- **Protected Routes** - Dashboard only displays when authenticated
- **Role-Based Data Access** - Users are filtered by their admin ID

### User Management System
- **Add User Modal** - Form with validation for creating new users
- **MongoDB Storage** - All users persisted in MongoDB
- **API Integration** - Frontend calls Express.js endpoints to manage data
- **Automatic Refresh** - User list updates immediately after adding a new user
- **Data Persistence** - Newly added users remain in database across sessions and logins

### Dynamic Metric Cards
- Values are memoized and formatted with proper localization
- Trend indicators show percentage changes
- Hover effects for better UX

### Interactive Charts
- Line chart for revenue trends
- Bar chart for performance metrics
- Fully responsive containers

### User Management
- Real-time search filtering
- Pagination with configurable page size
- Derived state for filtered users prevents unnecessary re-renders
- Status indicators for active/inactive users

## API Endpoints

The backend provides the following REST API endpoints:

### Health Check
- **GET** `/api/health` - Check server status

### Users Management
- **GET** `/api/users/:adminId` - Fetch all users for a specific admin
- **POST** `/api/users` - Create a new user
  - Body: `{ name, email, status, adminId, joinDate? }`
  - Returns: User object with MongoDB `_id`

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  joinDate: String (ISO date),
  status: String ('active' | 'inactive'),
  adminId: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- Strict TypeScript mode is enabled
- ESLint configuration can be customized in `vite.config.ts`
- Path aliases configured: `@/*` maps to `src/*`
- Backend uses Node.js with Express.js framework
- Database abstraction using Mongoose ODM

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or update `MONGO_URI` in `.env`
- Check MongoDB connection string format: `mongodb://localhost:27017/insightmatrix`
- For MongoDB Atlas: Use full connection string with credentials

### Cannot Add Users
- Verify backend server is running: `npm run dev:server`
- Check browser console for API errors
- Ensure `adminId` is set correctly after login
- Verify MongoDB database has write permissions

### API Endpoints Not Working
- Backend must be running on `http://localhost:5000`
- Check Network tab in Browser DevTools for API calls
- Verify CORS is enabled in Express server
- Check server logs for error messages

### Port Already in Use
- Frontend: Change Vite port in `vite.config.ts` (default: 5173)
- Backend: Change PORT in `.env` file (default: 5000)

## Future Enhancements

- Add edit/delete user functionality
- Add internationalization (i18n)
- Implement data export functionality
- Add user role-based access control (multiple roles)
- Enhanced animation transitions
- Dark/Light theme toggle
- Backend authentication with JWT refresh tokens
- Email verification for new users
- User activity logging
- Admin dashboard with analytics

## License

MIT
