/**
 * Quick Email Test Script
 * 
 * This script sends a test email to verify email configuration.
 * Run with: node --require dotenv/config send-test-email.js
 * Or: tsx send-test-email.ts
 */

import { sendEmail, sendNewCourseAnnouncement } from './lib/email'

async function main() {
  console.log('🚀 Starting email test...\n')

  const testEmail = 'rameshtkb07@gmail.com'
  
  console.log('📧 Sending simple test email...')
  const simpleResult = await sendEmail({
    to: testEmail,
    subject: '✅ Test Email from Learning Management System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-badge { display: inline-block; padding: 10px 20px; background: #10b981; color: white; border-radius: 25px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Email Test Successful!</h1>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>This is a test email from your <strong>Learning Management System</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <span class="success-badge">✅ Email System Working!</span>
            </div>
            <p>If you're reading this, your email configuration is set up correctly and emails are being sent successfully.</p>
            <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #718096; font-size: 14px;">
              <strong>Test Details:</strong><br>
              Sent at: ${new Date().toLocaleString()}<br>
              To: ${testEmail}<br>
              From: ${process.env.EMAIL_FROM || process.env.EMAIL_USER}
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Email Test - Learning Management System\n\nYour email configuration is working correctly!\n\nSent at: ${new Date().toLocaleString()}\nTo: ${testEmail}`
  })

  if (simpleResult) {
    console.log('✅ Simple test email sent successfully!\n')
  } else {
    console.log('❌ Failed to send simple test email. Check your configuration.\n')
  }

  console.log('📚 Sending course announcement test email...')
  const courseResult = await sendNewCourseAnnouncement([testEmail], {
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, JavaScript, and modern frameworks. This comprehensive course covers everything you need to start your journey in web development.',
    creatorName: 'Dr. Sarah Johnson',
    skillLevel: 'BEGINNER',
    interests: ['Web Development', 'Programming', 'Frontend', 'Backend'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express']
  })

  if (courseResult) {
    console.log('✅ Course announcement test email sent successfully!\n')
  } else {
    console.log('❌ Failed to send course announcement email. Check your configuration.\n')
  }

  console.log('✨ Email test completed!')
  console.log(`\n📬 Check your inbox at: ${testEmail}`)
  console.log('\nNote: If you don\'t see the emails, check your spam/junk folder.')
}

main().catch(console.error)
