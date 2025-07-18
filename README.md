# Tawasl - Communication Skills Platform

A comprehensive communication skills training platform that combines AI-powered assessments, educational articles, interactive practice sessions, and video analysis to help users improve their communication abilities.

## Features

- 📚 **Educational Articles**: Searchable library of communication guides and tips
- 🧪 **Interactive Tests**: Skills assessments with immediate feedback
- 🎥 **Video Analysis**: AI-powered analysis of communication skills

- ❓ **FAQ System**: Comprehensive help and guidance
- 📊 **Progress Tracking**: Monitor improvement over time

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** with shadcn/ui components
- **Wouter** for routing
- **TanStack Query** for state management
- **Vite** for development and building

### Backend
- **Node.js** with Express
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **Express sessions** for authentication

## Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- PostgreSQL 14+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tawasl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/tawasl
   NODE_ENV=development
   SESSION_SECRET=your-super-secret-session-key-here
   ```

4. **Setup Database**
   
   Create a PostgreSQL database:
   ```sql
   CREATE DATABASE tawasl;
   ```
   
   Push the schema to your database:
   ```bash
   npm run db:push
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   ├── seed.ts            # Database seeding
│   └── db.ts              # Database connection
├── shared/                # Shared code between client/server
│   └── schema.ts          # Database schema and types
└── package.json           # Dependencies and scripts
```

## Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **articles** - Educational content
- **test_categories** - Test category definitions
- **test_questions** - Individual test questions
- **test_results** - User test completion records
- **faqs** - Frequently asked questions
- **video_analyses** - Video analysis results

## API Endpoints

### Articles
- `GET /api/articles` - Get all articles (with search/filter)
- `GET /api/articles/:id` - Get specific article
- `POST /api/articles` - Create new article

### Tests
- `GET /api/test-categories` - Get all test categories
- `GET /api/test-categories/:id/questions` - Get questions for category
- `POST /api/test-results` - Submit test results
- `GET /api/test-results` - Get user test history

### Video Analysis
- `POST /api/video-analysis` - Submit video for analysis
- `GET /api/video-analyses` - Get user's video analyses

### FAQ
- `GET /api/faqs` - Get all FAQs (with search/filter)

## Development

### Adding New Features

1. **Database Changes**: Update `shared/schema.ts` with new tables/columns
2. **API Changes**: Add routes in `server/routes.ts`
3. **Storage Layer**: Update `server/storage.ts` interfaces and implementations
4. **Frontend**: Add components in `client/src/components/` and pages in `client/src/pages/`

### Database Migrations

Never write SQL migrations manually. Use Drizzle's push command:

```bash
npm run db:push
```

If you get data-loss warnings, you may need to manually handle data migration using SQL queries.

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=your-production-database-url
   SESSION_SECRET=your-production-session-secret
   ```

3. **Start the production server**
   ```bash
   npm run start
   ```

## Configuration

The application can be configured through environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)  
- `SESSION_SECRET` - Secret key for session encryption
- `PORT` - Server port (defaults to 5000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.