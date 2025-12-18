# Email Notifications - Quick Start Guide

## ✅ Features Implemented

### 1. **Automatic Course Announcements**
When a new learning path is created, **ALL users** automatically receive an email notification about the new course.

### 2. **Email Types Available**
- 📚 **New Course Announcements** - Sent to all users when a course is created
- 🎓 **Welcome Emails** - New user registration
- 🎉 **Enrollment Confirmations** - Course enrollment
- 🏆 **Completion Certificates** - Course completion
- ⏰ **Progress Reminders** - Learning reminders

## 🚀 Quick Test

### Option 1: Use the Test Email Page
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open in your browser:
   ```
   http://localhost:3000/test-email.html
   ```

3. Select email type and click "Send Test Email"

### Option 2: Run the Test Script
```bash
npx tsx --env-file=.env send-test-email.ts
```

### Option 3: Use the API Directly

**Simple Test Email:**
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"type": "simple", "to": "rameshtkb07@gmail.com"}'
```

**Course Announcement Email:**
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"type": "course-announcement", "to": "rameshtkb07@gmail.com"}'
```

## ✨ Test Results

**Emails sent successfully to: rameshtkb07@gmail.com**
- ✅ Simple test email
- ✅ Course announcement email

Check your inbox (and spam/junk folder if needed)!

## 🔧 Configuration

Your `.env` file is already configured with:
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="rameshtkb07@gmail.com"
EMAIL_PASSWORD="xjjrxnpszctknmwy"
EMAIL_FROM="noreply@tkb.com"
```

## 📋 How It Works

### When Creating a New Course:

1. Admin/Teacher creates a new learning path via:
   - Admin panel: `/admin/learning-paths/add`
   - API: `POST /api/learning-paths`

2. System automatically:
   - Creates the learning path in database
   - Fetches ALL user emails
   - Sends beautiful HTML email to each user
   - Includes course details, instructor, skills, topics

3. Users receive notification with:
   - Course title and description
   - Instructor name
   - Difficulty level
   - Skills they'll learn
   - Direct link to view/enroll

## 📁 Files Created/Modified

### New Files:
- ✅ `app/profile/page.tsx` - User profile page
- ✅ `app/api/profile/route.ts` - Profile API
- ✅ `lib/email.ts` - Email utility functions
- ✅ `app/api/notifications/route.ts` - Email notification API
- ✅ `app/api/test-email/route.ts` - Test email API
- ✅ `public/test-email.html` - Email test interface
- ✅ `send-test-email.ts` - CLI test script
- ✅ `.env.example` - Environment template
- ✅ `.env` - Your configuration
- ✅ `EMAIL_SETUP.md` - Detailed documentation

### Modified Files:
- ✅ `package.json` - Added nodemailer
- ✅ `app/api/learning-paths/route.ts` - Integrated email sending

## 🎯 API Endpoints

### Test Email
```
GET  /api/test-email              - Check email config status
POST /api/test-email              - Send test email
```

### Notifications
```
POST /api/notifications/welcome      - Send welcome email
POST /api/notifications/enrollment   - Send enrollment email
POST /api/notifications/completion   - Send completion email
POST /api/notifications/reminder     - Send reminder email
POST /api/notifications/admin        - Send admin notification
```

### Profile
```
GET  /api/profile                 - Get user profile
PUT  /api/profile                 - Update user profile
```

## 💡 Usage Examples

### Create a Course (Auto-sends emails to all users)
```javascript
fetch('/api/learning-paths', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Advanced React Patterns',
    description: 'Master advanced React patterns and best practices',
    skillLevel: 'ADVANCED',
    interests: ['Web Development', 'React'],
    skills: ['React', 'TypeScript', 'State Management'],
    modules: [
      {
        title: 'Introduction',
        description: 'Course overview',
        content: 'Welcome to the course...'
      }
    ]
  })
})
```

The system will automatically send announcement emails to all users!

### Manual Email Sending
```javascript
// Send enrollment confirmation
fetch('/api/notifications/enrollment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userEmail: 'student@example.com',
    userName: 'John Doe',
    pathTitle: 'Web Development Basics',
    pathDescription: 'Learn HTML, CSS, and JavaScript'
  })
})
```

## 🎨 Email Templates

All emails feature:
- 📱 Responsive design
- 🎨 Beautiful gradient headers
- 🔘 Clear call-to-action buttons
- 📊 Professional formatting
- 📧 Plain text fallback

## 🔍 Troubleshooting

### Emails not sending?
1. Check console for errors
2. Verify `.env` file exists and has correct values
3. Make sure nodemailer is installed: `npm install nodemailer`
4. For Gmail: Ensure you're using App Password, not regular password
5. Check spam/junk folder

### Check Email Status:
```bash
# Via API
curl http://localhost:3000/api/test-email

# Via test page
Open: http://localhost:3000/test-email.html
Click "Check Email Configuration"
```

## 🎓 Next Steps

1. **Test the system**: Create a new learning path and watch emails go out!
2. **Customize templates**: Edit `lib/email.ts` to modify email designs
3. **Add more triggers**: Integrate emails in other parts of the app
4. **Monitor delivery**: Check console logs for email status

## 📞 Support

- Email configuration issues? Check `EMAIL_SETUP.md`
- Want to customize emails? Edit templates in `lib/email.ts`
- Need help? Check console logs for detailed error messages

---

**Status**: ✅ All emails sent successfully to rameshtkb07@gmail.com!

**Ready to use**: Create a new course and all users will receive notification emails automatically!
