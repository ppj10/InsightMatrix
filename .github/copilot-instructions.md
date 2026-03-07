# InsightMatrix - Analytics Dashboard

## Project Overview
A full-stack data-driven analytics dashboard built with:
- **Frontend**: React 18, TypeScript, Redux Toolkit, Recharts
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Features**: User management with authenticated access, real-time data persistence

## Architecture
- **Feature-based folder structure** for frontend scalability
- **Redux Toolkit** for state management with separate loading states
- **Recharts** for interactive data visualization
- **MongoDB** for persistent data storage
- **Express.js API** with CORS support
- **Memoization** for performance optimization
- **TypeScript** for type safety (both frontend and types for backend)

## Key Technologies
### Frontend
- React 18+ with TypeScript
- Vite (build tool)
- Redux Toolkit & React-Redux
- Recharts for charts
- Modular feature-based architecture

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- CORS for cross-origin requests
- dotenv for environment variables

## Development Guidelines
### Frontend
- Follow feature-based organization (features/ directory)
- Use Redux Toolkit for all state management
- Implement derived state patterns to prevent re-renders
- Apply React.memo and useMemo for performance
- Maintain TypeScript strict mode

### Backend
- Use Express middleware appropriately
- Implement proper error handling
- Validate all incoming requests
- Use MongoDB transactions for complex operations
- Keep API endpoints RESTful

## Setup & Deployment
- **MongoDB Atlas**: Cloud-based MongoDB with automatic backups
- **Development Environment**: `.env` file configuration
- **Full-stack Development**: Use `npm run dev:all` to run both servers
- **Data Persistence**: All user data stored in MongoDB

