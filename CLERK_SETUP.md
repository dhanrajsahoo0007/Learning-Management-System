# Clerk Integration Guide

This document provides instructions for setting up and using Clerk authentication in the Learning Management System.

## Prerequisites

1. **Clerk Account**: Create a free account at https://clerk.com
2. **Clerk Application**: Create a new application in the Clerk dashboard
3. **API Keys**: Obtain your Publishable Key and Secret Key

## Environment Setup

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_URL=http://localhost:8080/api
```

### Backend Configuration

Update your `.env` file in the `backend` directory:

```env
# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database
TURSO_DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_auth_token
```

## Database Migration

Run the migration script to add Clerk user ID support:

```bash
cd backend
# Apply migration to your database
# For Turso, you can use their CLI or web interface to run the SQL
cat scripts/migrate_to_clerk.sql
```

## Webhook Configuration

1. **In Clerk Dashboard**:

   - Go to Webhooks section
   - Add endpoint: `http://your-domain/api/webhooks/clerk`
   - For local development: Use ngrok or similar tool
   - Subscribe to events: `user.created`, `user.updated`, `user.deleted`
   - Copy the webhook secret

2. **Update Environment**:
   - Add `CLERK_WEBHOOK_SECRET` to your backend `.env`

## Running the Application

### Start Backend Services

```bash
cd backend
bash scripts/start-services.sh
```

This will start:

- API Gateway (8080)
- DSA Service (8082)
- System Design Service (8083)
- AI System Design Service (8084)
- Certifications Service (8085)
- Gamification Service (8086)
- Webhooks Service (8087)

### Start Frontend

```bash
cd frontend
npm run dev
```

## Authentication Flow

### Sign Up

1. Navigate to `/sign-up`
2. Complete the Clerk sign-up form
3. User is created in Clerk
4. Webhook syncs user to your database
5. Redirect to dashboard

### Sign In

1. Navigate to `/sign-in`
2. Enter credentials
3. Clerk validates and creates session
4. JWT token is automatically included in API requests
5. Access protected routes

### Protected Routes

The following routes require authentication:

- `/dashboard` - User dashboard
- `/api/gamification/*` - Gamification endpoints
- `/api/progress` - Progress tracking

Public routes (no auth required):

- `/` - Home page
- `/dsa/*` - DSA topics
- `/system-design/*` - System design topics
- `/certifications/*` - Certifications list

## API Client Usage

For authenticated API calls, use the `useApiClient` hook:

```typescript
import { useApiClient } from "@/api/client";

function MyComponent() {
  const apiClient = useApiClient();

  const fetchData = async () => {
    const response = await apiClient.get("/gamification/stats");
    // Clerk token is automatically included
  };
}
```

## Troubleshooting

### "Missing Clerk Publishable Key" Error

- Ensure `VITE_CLERK_PUBLISHABLE_KEY` is set in frontend `.env`
- Restart the dev server after adding environment variables

### 401 Unauthorized on Protected Routes

- Check that user is signed in
- Verify `CLERK_SECRET_KEY` is correct in backend `.env`
- Check browser console for token errors

### Webhook Not Receiving Events

- Verify webhook URL is accessible (use ngrok for local dev)
- Check webhook secret matches in Clerk dashboard and `.env`
- Review webhook logs in Clerk dashboard

### Database Sync Issues

- Verify migration was run successfully
- Check webhook service logs: `backend/logs/webhooks.log`
- Ensure database connection is working

## Development Tips

1. **Local Webhook Testing**: Use ngrok to expose your local webhook endpoint

   ```bash
   ngrok http 8087
   # Use the ngrok URL in Clerk webhook settings
   ```

2. **Testing Authentication**: Use Clerk's test mode for development

   - Test mode users don't count toward your quota
   - Easy to create/delete test users

3. **Debugging**: Check service logs in `backend/logs/` directory

## Migration from Old Auth

If you have existing users:

1. Export user data from old system
2. Create users in Clerk via API or dashboard
3. Map old user IDs to Clerk user IDs in database
4. Update user records with `clerk_user_id`

## Security Best Practices

1. **Never commit `.env` files** - They contain sensitive keys
2. **Use different keys** for development and production
3. **Rotate secrets regularly** in production
4. **Enable MFA** in Clerk dashboard for production apps
5. **Monitor webhook logs** for suspicious activity

## Support

- Clerk Documentation: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord
- Project Issues: GitHub repository
