/**
 * Email Notification Utility
 * 
 * This module provides email notification functionality using Nodemailer.
 * Configure your email service credentials in environment variables:
 * - EMAIL_HOST: SMTP host (e.g., smtp.gmail.com)
 * - EMAIL_PORT: SMTP port (e.g., 587)
 * - EMAIL_USER: Email account username
 * - EMAIL_PASSWORD: Email account password
 * - EMAIL_FROM: Sender email address
 */

import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

interface WelcomeEmailData {
  userName: string
  userEmail: string
}

interface EnrollmentEmailData {
  userName: string
  pathTitle: string
  pathDescription?: string
}

interface CompletionEmailData {
  userName: string
  pathTitle: string
  completedAt: Date
}

interface ReminderEmailData {
  userName: string
  pathTitle: string
  progress: number
}

// Create a transporter using environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

/**
 * Send a generic email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email configuration not found. Skipping email send.')
      return false
    }

    const transporter = createTransporter()
    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER

    await transporter.sendMail({
      from,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    })

    console.log(`Email sent successfully to: ${options.to}`)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #718096; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Welcome to Learning Management System!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${data.userName}</strong>,</p>
          <p>Welcome to our Learning Management System! We're excited to have you on board.</p>
          <p>Your account has been successfully created with the email: <strong>${data.userEmail}</strong></p>
          <p>You can now:</p>
          <ul>
            <li>Browse available learning paths</li>
            <li>Enroll in courses that match your interests</li>
            <li>Track your learning progress</li>
            <li>Get personalized course recommendations</li>
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
              Go to Dashboard
            </a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy learning!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Learning Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: data.userEmail,
    subject: 'Welcome to Learning Management System! 🎓',
    html,
    text: `Hi ${data.userName}, Welcome to our Learning Management System! Your account has been successfully created.`
  })
}

/**
 * Send enrollment confirmation email
 */
export async function sendEnrollmentEmail(userEmail: string, data: EnrollmentEmailData): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .course-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #718096; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Enrollment Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${data.userName}</strong>,</p>
          <p>Great news! You've successfully enrolled in:</p>
          <div class="course-box">
            <h2 style="margin-top: 0; color: #2d3748;">${data.pathTitle}</h2>
            ${data.pathDescription ? `<p style="color: #718096;">${data.pathDescription}</p>` : ''}
          </div>
          <p>You can start learning right away and track your progress from your dashboard.</p>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
              Start Learning
            </a>
          </div>
          <p>Good luck with your learning journey!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Learning Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: userEmail,
    subject: `Enrollment Confirmed: ${data.pathTitle} 🎉`,
    html,
    text: `Hi ${data.userName}, You've successfully enrolled in ${data.pathTitle}. Start learning now!`
  })
}

/**
 * Send course completion email
 */
export async function sendCompletionEmail(userEmail: string, data: CompletionEmailData): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .achievement { background: white; padding: 30px; text-align: center; border: 3px solid #f59e0b; margin: 20px 0; border-radius: 12px; }
        .badge { font-size: 60px; margin: 10px 0; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #718096; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏆 Congratulations!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${data.userName}</strong>,</p>
          <div class="achievement">
            <div class="badge">🎓</div>
            <h2 style="color: #2d3748; margin: 10px 0;">Course Completed!</h2>
            <h3 style="color: #f59e0b; margin: 10px 0;">${data.pathTitle}</h3>
            <p style="color: #718096;">Completed on ${new Date(data.completedAt).toLocaleDateString()}</p>
          </div>
          <p>Congratulations on completing this learning path! You've demonstrated dedication and commitment to your learning journey.</p>
          <p>Keep up the great work and explore more courses to continue growing your skills!</p>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/learning-paths-view" class="button">
              Explore More Courses
            </a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Learning Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: userEmail,
    subject: `🏆 Congratulations! You completed ${data.pathTitle}`,
    html,
    text: `Hi ${data.userName}, Congratulations on completing ${data.pathTitle}! Keep up the great work.`
  })
}

/**
 * Send progress reminder email
 */
export async function sendReminderEmail(userEmail: string, data: ReminderEmailData): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .progress-bar { background: #e2e8f0; height: 30px; border-radius: 15px; overflow: hidden; margin: 20px 0; }
        .progress-fill { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #718096; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Continue Your Learning!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${data.userName}</strong>,</p>
          <p>You're making great progress! Don't forget to continue with your course:</p>
          <h3 style="color: #2d3748;">${data.pathTitle}</h3>
          <p>Current Progress:</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${data.progress}%;">
              ${data.progress}%
            </div>
          </div>
          <p>Keep the momentum going! Every step forward is progress toward your learning goals.</p>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
              Continue Learning
            </a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Learning Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: userEmail,
    subject: `⏰ Continue your learning: ${data.pathTitle}`,
    html,
    text: `Hi ${data.userName}, You're ${data.progress}% through ${data.pathTitle}. Keep going!`
  })
}

/**
 * Send new course announcement to all users
 */
export async function sendNewCourseAnnouncement(
  userEmails: string[],
  courseData: {
    title: string
    description?: string
    creatorName: string
    skillLevel: string
    interests: string[]
    skills: string[]
  }
): Promise<boolean> {
  if (userEmails.length === 0) {
    return true
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .course-card { background: white; padding: 25px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
        .badge { display: inline-block; padding: 6px 12px; background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); color: #5b21b6; border-radius: 20px; font-size: 13px; font-weight: 600; margin: 5px; }
        .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #718096; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 New Course Available!</h1>
        </div>
        <div class="content">
          <p>Hello!</p>
          <p>We're excited to announce a new learning path has just been added to our platform:</p>
          
          <div class="course-card">
            <h2 style="margin-top: 0; color: #2d3748;">${courseData.title}</h2>
            ${courseData.description ? `<p style="color: #718096; margin: 15px 0;">${courseData.description}</p>` : ''}
            
            <div style="margin: 15px 0;">
              <strong style="color: #4a5568;">Instructor:</strong> ${courseData.creatorName}<br/>
              <strong style="color: #4a5568;">Level:</strong> ${courseData.skillLevel}
            </div>
            
            ${courseData.skills.length > 0 ? `
              <div style="margin: 15px 0;">
                <strong style="color: #4a5568; display: block; margin-bottom: 8px;">Skills you'll learn:</strong>
                ${courseData.skills.map(skill => `<span class="badge">${skill}</span>`).join('')}
              </div>
            ` : ''}
            
            ${courseData.interests.length > 0 ? `
              <div style="margin: 15px 0;">
                <strong style="color: #4a5568; display: block; margin-bottom: 8px;">Topics:</strong>
                ${courseData.interests.map(interest => `<span class="badge">${interest}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          
          <p>Start learning today and enhance your skills!</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/learning-paths-view" class="button">
              View Course
            </a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Learning Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `New Course Available: ${courseData.title}\n\nInstructor: ${courseData.creatorName}\nLevel: ${courseData.skillLevel}\n\n${courseData.description || ''}\n\nVisit ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/learning-paths-view to enroll now!`

  // Send to all users
  try {
    await sendEmail({
      to: userEmails,
      subject: `📚 New Course: ${courseData.title}`,
      html,
      text
    })
    return true
  } catch (error) {
    console.error('Error sending course announcement:', error)
    return false
  }
}

/**
 * Send admin notification email
 */
export async function sendAdminNotification(subject: string, message: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

  if (!adminEmail) {
    console.warn('Admin email not configured')
    return false
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #718096; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛡️ Admin Notification</h1>
        </div>
        <div class="content">
          <h2 style="color: #2d3748;">${subject}</h2>
          <div style="background: white; padding: 20px; border-left: 4px solid #ef4444; border-radius: 8px;">
            ${message}
          </div>
          <p style="margin-top: 20px; color: #718096; font-size: 14px;">
            <em>This is an automated notification from the Learning Management System.</em>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Learning Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: adminEmail,
    subject: `[Admin] ${subject}`,
    html,
    text: `${subject}\n\n${message}`
  })
}
