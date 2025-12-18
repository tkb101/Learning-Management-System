import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendNewCourseAnnouncement } from '@/lib/email'

// POST /api/test-email - Send a test email (for development/testing only)
export async function POST(request: NextRequest) {
  try {
    const { type, to } = await request.json()

    if (!to) {
      return NextResponse.json(
        { error: 'Email recipient (to) is required' },
        { status: 400 }
      )
    }

    let result = false
    let message = ''

    switch (type) {
      case 'simple':
        result = await sendEmail({
          to,
          subject: 'Test Email from Learning Management System',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                .badge { display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 20px; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎓 Test Email</h1>
                </div>
                <div class="content">
                  <p>Hello!</p>
                  <p>This is a test email from the <strong>Learning Management System</strong>.</p>
                  <p><span class="badge">✅ Email System Working!</span></p>
                  <p>If you received this email, it means your email configuration is set up correctly.</p>
                  <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 20px 0;">
                  <p style="color: #718096; font-size: 14px;">
                    <strong>Test Details:</strong><br>
                    Sent at: ${new Date().toLocaleString()}<br>
                    To: ${to}
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: 'This is a test email from Learning Management System. Your email configuration is working correctly!'
        })
        message = 'Simple test email sent'
        break

      case 'course-announcement':
        result = await sendNewCourseAnnouncement([to], {
          title: 'Introduction to Web Development',
          description: 'Learn the fundamentals of web development including HTML, CSS, JavaScript, and modern frameworks. Perfect for beginners looking to start their journey in web development.',
          creatorName: 'Dr. Sarah Johnson',
          skillLevel: 'BEGINNER',
          interests: ['Web Development', 'Programming', 'Frontend'],
          skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js']
        })
        message = 'Course announcement test email sent'
        break

      default:
        return NextResponse.json(
          { error: 'Invalid email type. Use "simple" or "course-announcement"' },
          { status: 400 }
        )
    }

    if (result) {
      return NextResponse.json({
        success: true,
        message: `${message} to ${to}`,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email configuration not available or email failed to send. Check your .env file and console logs.',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send test email', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// GET /api/test-email - Get email configuration status
export async function GET() {
  const configured = !!(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD
  )

  return NextResponse.json({
    configured,
    message: configured 
      ? 'Email system is configured and ready to use' 
      : 'Email system is not configured. Please set up EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in your .env file',
    config: {
      host: process.env.EMAIL_HOST || 'Not set',
      port: process.env.EMAIL_PORT || 'Not set',
      user: process.env.EMAIL_USER || 'Not set',
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'Not set'
    }
  })
}
