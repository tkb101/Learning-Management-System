import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireRole } from '@/lib/middleware'
import { 
  sendWelcomeEmail, 
  sendEnrollmentEmail, 
  sendCompletionEmail, 
  sendReminderEmail,
  sendAdminNotification 
} from '@/lib/email'

// POST /api/notifications/welcome - Send welcome email
export const POST_welcome = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { userName, userEmail } = await request.json()

    if (!userName || !userEmail) {
      return NextResponse.json(
        { error: 'userName and userEmail are required' },
        { status: 400 }
      )
    }

    const sent = await sendWelcomeEmail({ userName, userEmail })

    return NextResponse.json({
      success: sent,
      message: sent ? 'Welcome email sent successfully' : 'Email configuration not available'
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
})

// POST /api/notifications/enrollment - Send enrollment confirmation
export const POST_enrollment = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { userEmail, userName, pathTitle, pathDescription } = await request.json()

    if (!userEmail || !userName || !pathTitle) {
      return NextResponse.json(
        { error: 'userEmail, userName, and pathTitle are required' },
        { status: 400 }
      )
    }

    const sent = await sendEnrollmentEmail(userEmail, {
      userName,
      pathTitle,
      pathDescription
    })

    return NextResponse.json({
      success: sent,
      message: sent ? 'Enrollment email sent successfully' : 'Email configuration not available'
    })
  } catch (error) {
    console.error('Error sending enrollment email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
})

// POST /api/notifications/completion - Send completion email
export const POST_completion = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { userEmail, userName, pathTitle, completedAt } = await request.json()

    if (!userEmail || !userName || !pathTitle) {
      return NextResponse.json(
        { error: 'userEmail, userName, and pathTitle are required' },
        { status: 400 }
      )
    }

    const sent = await sendCompletionEmail(userEmail, {
      userName,
      pathTitle,
      completedAt: completedAt ? new Date(completedAt) : new Date()
    })

    return NextResponse.json({
      success: sent,
      message: sent ? 'Completion email sent successfully' : 'Email configuration not available'
    })
  } catch (error) {
    console.error('Error sending completion email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
})

// POST /api/notifications/reminder - Send progress reminder
export const POST_reminder = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { userEmail, userName, pathTitle, progress } = await request.json()

    if (!userEmail || !userName || !pathTitle || progress === undefined) {
      return NextResponse.json(
        { error: 'userEmail, userName, pathTitle, and progress are required' },
        { status: 400 }
      )
    }

    const sent = await sendReminderEmail(userEmail, {
      userName,
      pathTitle,
      progress
    })

    return NextResponse.json({
      success: sent,
      message: sent ? 'Reminder email sent successfully' : 'Email configuration not available'
    })
  } catch (error) {
    console.error('Error sending reminder email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
})

// POST /api/notifications/admin - Send admin notification (Admin only)
export const POST_admin = requireRole(['ADMIN'])(async (request: NextRequest, user: any) => {
  try {
    const { subject, message } = await request.json()

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'subject and message are required' },
        { status: 400 }
      )
    }

    const sent = await sendAdminNotification(subject, message)

    return NextResponse.json({
      success: sent,
      message: sent ? 'Admin notification sent successfully' : 'Email configuration not available'
    })
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
})
