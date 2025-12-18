# Email Notifications - Setup Guide

## Overview
The Learning Management System includes a comprehensive email notification system that sends automated emails for various user events such as:

- Welcome emails for new users
- Enrollment confirmations
- Course completion certificates
- Progress reminders
- Admin notifications

## Features

### 1. **Profile Page** (`/profile`)
- View and edit user information (name, email)
- Manage interests and skills
- Change password
- View account statistics

### 2. **Email Notifications**
- **Welcome Email**: Sent when a new user registers
- **Enrollment Email**: Sent when a user enrolls in a learning path
- **Completion Email**: Sent when a user completes a learning path
- **Reminder Email**: Sent to remind users about incomplete courses
- **Admin Notifications**: System notifications sent to administrators

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install `nodemailer` and its TypeScript types.

### 2. Configure Email Service

Copy `.env.example` to `.env` and configure your email settings:

```bash
cp .env.example .env
```

Then edit `.env` with your email provider settings:

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Gmail Setup (Recommended for Development)

If using Gmail:

1. Enable 2-factor authentication on your Google Account
2. Go to [Google Account > Security > App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new App Password for "Mail"
4. Use this App Password as `EMAIL_PASSWORD` in your `.env` file

### 4. Other Email Providers

The system supports any SMTP-compatible email service:

- **SendGrid**: `smtp.sendgrid.net` (Port 587)
- **Mailgun**: `smtp.mailgun.org` (Port 587)
- **Amazon SES**: Check AWS console for SMTP settings
- **Outlook/Office365**: `smtp.office365.com` (Port 587)

## Usage

### Profile Page

Navigate to `/profile` to:
- View your profile information
- Edit your name and email
- Add/remove interests and skills
- Change your password

### Sending Email Notifications

The email system works automatically when:

1. **New User Registration**: Welcome email is sent automatically
2. **Course Enrollment**: Enrollment confirmation is sent when enrolling
3. **Course Completion**: Completion certificate email is sent upon finishing
4. **Progress Reminders**: Can be triggered manually or via scheduled tasks

### Manual Email Sending (for testing)

You can also send emails manually via the API:

```javascript
// Send welcome email
fetch('/api/notifications/welcome', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userName: 'John Doe',
    userEmail: 'john@example.com'
  })
})

// Send enrollment email
fetch('/api/notifications/enrollment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userEmail: 'john@example.com',
    userName: 'John Doe',
    pathTitle: 'JavaScript Fundamentals',
    pathDescription: 'Learn the basics of JavaScript'
  })
})
```

## API Endpoints

### Profile API
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile

### Email Notification API
- `POST /api/notifications/welcome` - Send welcome email
- `POST /api/notifications/enrollment` - Send enrollment confirmation
- `POST /api/notifications/completion` - Send completion certificate
- `POST /api/notifications/reminder` - Send progress reminder
- `POST /api/notifications/admin` - Send admin notification (Admin only)

## Email Templates

All emails are styled with modern HTML/CSS and include:
- Responsive design
- Branded headers with gradients
- Clear call-to-action buttons
- Professional formatting
- Mobile-friendly layouts

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**: Ensure all email configuration variables are set in `.env`
2. **SMTP Credentials**: Verify your email credentials are correct
3. **Firewall/Network**: Ensure your server can connect to the SMTP server (port 587 or 465)
4. **Gmail Security**: If using Gmail, make sure you're using an App Password, not your regular password
5. **Check Logs**: Look at the console for error messages

### Testing Locally

For local development, you can use:
- **Mailtrap**: Free email testing service (mailtrap.io)
- **Ethereal**: Fake SMTP service for testing (ethereal.email)

Example Ethereal configuration:
```env
EMAIL_HOST="smtp.ethereal.email"
EMAIL_PORT="587"
EMAIL_USER="your-ethereal-user"
EMAIL_PASSWORD="your-ethereal-password"
```

## Optional: Skip Email Configuration

The system will work without email configuration. If email settings are not provided:
- Email functions will return `false`
- A warning will be logged to the console
- The application will continue to function normally
- Users just won't receive email notifications

## Security Best Practices

1. **Never commit `.env` files** to version control
2. Use **App Passwords** instead of your main email password
3. Set **strong JWT secrets** in production
4. Use **environment-specific** email configurations
5. Consider using **dedicated email service** (SendGrid, Mailgun) in production

## Production Deployment

For production:

1. Use a dedicated transactional email service (SendGrid, Mailgun, Amazon SES)
2. Set up proper SPF, DKIM, and DMARC records
3. Monitor email delivery rates
4. Implement rate limiting
5. Add unsubscribe functionality for marketing emails (if applicable)

## Integration with Existing Features

The email notifications integrate automatically with:
- User registration (`/api/auth/register`)
- Course enrollment (`/api/enrollments`)
- Module completion (`/api/modules/[id]/complete`)

You can enhance these endpoints to trigger emails by importing the email functions:

```typescript
import { sendWelcomeEmail, sendEnrollmentEmail } from '@/lib/email'

// After user registration
await sendWelcomeEmail({
  userName: user.name,
  userEmail: user.email
})

// After enrollment
await sendEnrollmentEmail(user.email, {
  userName: user.name,
  pathTitle: path.title,
  pathDescription: path.description
})
```

## Support

For issues or questions about email notifications:
1. Check the console logs for error messages
2. Verify your SMTP configuration
3. Test with a different email provider
4. Check spam/junk folders for sent emails

---

**Last Updated**: December 2025
