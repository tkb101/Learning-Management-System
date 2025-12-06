import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EduPlatform - Transform Your Learning Journey',
  description: 'Unlock your potential with personalized learning paths, expert-led courses, and AI-powered recommendations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          html {
            scroll-behavior: smooth;
          }
          
          ::-webkit-scrollbar {
            width: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 5px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #764ba2;
          }
          
          a, button {
            transition: all 0.3s ease;
          }
          
          a:hover, button:hover {
            transform: translateY(-2px);
          }
          
          input:focus, textarea:focus, select:focus {
            outline: 2px solid #667eea;
            outline-offset: 2px;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}