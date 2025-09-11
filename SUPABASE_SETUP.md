# Supabase Setup Instructions for Zephy

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in your Supabase dashboard

## Database Setup

### Step 1: Run the Schema
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor"
3. Copy and paste the contents of `backend/database/schema.sql`
4. Run the SQL script to create all tables and policies

### Step 2: Configure Authentication
1. Go to "Authentication" → "Settings" in your Supabase dashboard
2. Enable email authentication
3. Configure Google OAuth:
   - Go to "Authentication" → "Providers"
   - Enable Google provider
   - Add your Google OAuth credentials:
     - Client ID: Get from Google Cloud Console
     - Client Secret: Get from Google Cloud Console
   - Set redirect URLs:
     - `http://localhost:3000/index.html` (for development)
     - `https://yourdomain.com/index.html` (for production)

### Step 3: Configure Frontend
1. Open `frontend/config.js`
2. Replace the placeholders with your actual Supabase credentials:
   ```javascript
   const SUPABASE_URL = 'https://your-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```
3. You can find these values in your Supabase project settings under "API"

## Google OAuth Setup

### Step 1: Create Google OAuth Application
1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
7. Copy the Client ID and Client Secret

### Step 2: Configure in Supabase
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Paste your Client ID and Client Secret
4. Save the configuration

## Environment Variables (Optional for Backend)
Create a `.env` file in the backend directory:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

## Testing the Setup
1. Start your local server
2. Open the application
3. Click "Login" to test the authentication modal
4. Try signing up with email/password
5. Try signing in with Google

## Row Level Security (RLS)
The schema includes RLS policies that ensure:
- Users can only see/edit their own profiles
- Posts and polls are viewable by everyone but only editable by creators
- Votes are anonymous but tied to user accounts to prevent duplicate voting
- Wellness assessments are private to each user

## Database Tables Created
- `user_profiles`: Anonymous user profiles with nicknames and avatars
- `communities`: Student community categories
- `posts`: Anonymous posts in communities
- `post_votes`: Voting system for posts
- `replies`: Replies to posts
- `reply_votes`: Voting system for replies
- `polls`: Anonymous polls with various types
- `poll_votes`: Poll voting system
- `wellness_assessments`: Private wellness check-in data

## Security Features
- All user data is protected by Row Level Security
- Anonymous posting while maintaining vote integrity
- Secure authentication with Supabase Auth
- Protected API endpoints
- Encrypted data transmission

## Troubleshooting
1. **Authentication not working**: Check your Supabase URL and keys
2. **Google login fails**: Verify OAuth configuration and redirect URLs
3. **Database errors**: Ensure schema was applied correctly
4. **CORS issues**: Check allowed origins in Supabase settings
