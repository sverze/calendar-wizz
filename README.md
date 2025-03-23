# CalendarWizz

CalendarWizz is a modern, user-friendly calendar application built with Next.js and Supabase. It allows users to manage their schedule with multiple calendar views (month, week, day) and provides a seamless event management experience.

## Features

- **Multiple Calendar Views**: Switch between month, week, and day views
- **Event Management**: Create, edit, and delete events
- **Time Validation**: Prevents scheduling events where end time is before start time
- **User Authentication**: Secure login and registration with Supabase Auth
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatically adapts to system preferences

## Architecture

CalendarWizz follows a modern web application architecture:

- **Frontend**: Next.js with React and TypeScript
- **Backend**: Serverless API routes and Supabase for data storage
- **Authentication**: Supabase Auth with email/password and social providers
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks and context for local state management
- **Testing**: Jest and React Testing Library for component testing

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A Supabase account and project

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

The application requires a Supabase database with the following schema:

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for secure access
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events" 
  ON events FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" 
  ON events FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" 
  ON events FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" 
  ON events FOR DELETE 
  USING (auth.uid() = user_id);
```

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/calendar-wizz.git
cd calendar-wizz

# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Deployment

The application can be easily deployed to Vercel:

```bash
npm install -g vercel
vercel
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
