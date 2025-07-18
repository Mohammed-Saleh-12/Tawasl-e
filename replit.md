# Tawasl - Communication Skills Platform

## Overview

Tawasl is a comprehensive communication skills training platform that combines AI-powered assessments, educational articles, interactive practice sessions, and video analysis to help users improve their communication abilities. The platform is designed for professionals and students looking to enhance their verbal and non-verbal communication skills.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and bundling
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: Hot reload with Vite middleware integration
- **Session Management**: Express sessions with PostgreSQL store

### Database Design
The system uses PostgreSQL (Neon-backed) with Drizzle ORM for type-safe operations:
- **Users**: Authentication and user management
- **Articles**: Educational content with full rich-text content, categories and metadata
- **Test Categories**: Different types of communication assessments (Verbal, Body Language, Active Listening)
- **Test Questions**: Multiple choice questions with detailed explanations and correct answers
- **Test Results**: User performance tracking with detailed feedback and scoring
- **FAQs**: Frequently asked questions with comprehensive answers and categorization
- **Video Analyses**: AI-powered video assessment results with detailed scoring metrics

Database is automatically seeded with sample content on startup including 5 comprehensive articles, 3 test categories with 15 real questions, and 8 detailed FAQ entries.

## Key Components

### 1. Educational Articles System
- Searchable article library with categories
- Content covers verbal/non-verbal communication, presentation skills, workplace communication
- Articles include metadata like read time, author, and publication date

### 2. Interactive Testing Platform
- Multiple test categories (verbal communication, body language, active listening, etc.)
- Timed assessments with immediate feedback
- Progress tracking and performance analytics
- Detailed explanations for incorrect answers

### 3. AI Video Analysis
- Video recording capabilities for practice sessions
- Mock analysis of facial expressions, eye contact, and body language
- Scenario-based practice (job interviews, presentations, difficult conversations)
- Detailed feedback reports with scoring metrics



### 5. FAQ System
- Categorized frequently asked questions
- Search functionality across all FAQ content
- Topics cover platform usage and communication techniques

## Data Flow

1. **User Authentication**: Currently prepared but not fully implemented
2. **Content Delivery**: Articles and FAQs fetched via REST API with search/filter capabilities
3. **Assessment Flow**: 
   - User selects test category
   - Questions loaded dynamically
   - Answers submitted and scored
   - Results stored with detailed feedback
4. **Video Analysis**:
   - Browser-based video recording
   - Client-side processing (mock AI analysis)
   - Results stored and displayed with metrics


## External Dependencies

### Database & ORM
- **PostgreSQL**: Primary database (configured for Neon serverless)
- **Drizzle ORM**: Type-safe database operations
- **connect-pg-simple**: PostgreSQL session store

### UI & Styling
- **shadcn/ui**: Complete component library built on Radix UI
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Development Environment
- Replit-based development with hot reload
- Vite dev server with Express API integration
- PostgreSQL database provisioning through Replit

### Production Build
- Client: Vite builds React app to static assets
- Server: ESBuild bundles Express server with external dependencies
- Single command deployment with `npm run build && npm run start`

### Replit Configuration
- Node.js 20 runtime environment
- PostgreSQL 16 database module
- Auto-scaling deployment target
- Port 5000 for local development, port 80 for production

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
- June 25, 2025. Added PostgreSQL database integration
- June 25, 2025. Enhanced articles with creation modal and full-content reading
- June 25, 2025. Added 15+ comprehensive test questions across all skill categories
- June 25, 2025. Improved header design with icons and enhanced navigation
- June 25, 2025. Added enhanced button styles and hover effects
- June 25, 2025. Expanded FAQ content with better categorization
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```