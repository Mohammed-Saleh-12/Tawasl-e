# Tawasl - Complete Project Export

This package contains the complete source code for the Tawasl Communication Skills Platform.

## What's Included

### Core Application Files
- **Frontend**: React 18 + TypeScript application in `client/` directory
- **Backend**: Express + TypeScript API server in `server/` directory  
- **Database Schema**: Drizzle ORM schema definitions in `shared/`
- **Configuration**: All build tools, TypeScript, Tailwind configs

### Complete Dependencies
- All package dependencies listed in `package.json`
- Package lock file for exact version reproducibility
- Development and production dependency separation

### Documentation & Setup
- **README.md**: Complete project overview and setup instructions
- **DEPLOYMENT.md**: Production deployment guide with multiple options
- **database-setup.sql**: Database initialization script
- **.env.example**: Environment variable template

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database URL

# 3. Setup database
createdb tawasl
npm run db:push

# 4. Start development
npm run dev
```

## Project Features

✅ **Working Features**
- Educational articles system with search/categories
- Interactive skill assessments with 15+ questions
- Video analysis with AI feedback simulation

- FAQ system with categorized content
- Progress tracking and results storage
- Responsive design with dark/light themes

✅ **Technical Stack**
- Modern React 18 with TypeScript
- Express.js backend with PostgreSQL
- Drizzle ORM for type-safe database operations
- TailwindCSS + shadcn/ui for beautiful interfaces
- Vite for fast development and building

✅ **Production Ready**
- Build scripts for deployment
- Database migration system
- Session management
- Error handling
- Security configurations

## Database Schema

The application includes a complete database schema with:

- **users**: User authentication and profiles
- **articles**: Educational content library (5 pre-seeded articles)
- **test_categories**: Communication skill test types (3 categories)
- **test_questions**: Assessment questions (15 comprehensive questions)
- **test_results**: User progress and scoring
- **faqs**: Help system (8 detailed FAQ entries)
- **video_analyses**: Video feedback and analysis results

## File Structure

```
tawasl/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components (40+ components)
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database layer
│   └── seed.ts            # Sample data
├── shared/                # Shared types/schema
├── package.json           # Dependencies
├── README.md              # Setup instructions
├── DEPLOYMENT.md          # Production guide
└── .env.example           # Environment template
```

## Development Notes

- Uses TypeScript throughout for type safety
- Includes comprehensive error handling
- Database seeding with realistic sample data
- Hot reload development environment
- Production build optimization

## Support

For setup issues:
1. Check README.md for detailed instructions
2. Verify Node.js 18+ and PostgreSQL 14+ installed
3. Ensure environment variables are correctly configured
4. Review DEPLOYMENT.md for production scenarios

This is a complete, working application ready for development or deployment.