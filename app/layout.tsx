// import type React from "react"
// import type { Metadata } from "next"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
// import { Analytics } from "@vercel/analytics/next"
// import { AuthProvider } from "@/lib/auth-context"
// import { ThemeProvider } from "@/components/theme-provider"
// import { Suspense } from "react"
// import "./globals.css"

// export const metadata: Metadata = {
//   title: "HR Management System",
//   description: "Comprehensive HR Management System",
//   generator: "v0.app",
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
//         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
//           <Suspense fallback={null}>
//             <AuthProvider>{children}</AuthProvider>
//           </Suspense>
//         </ThemeProvider>
//         <Analytics />
//       </body>
//     </html>
//   )
// }





import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster" // Import the Toaster
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "HR Management System",
  description: "Comprehensive HR Management System",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          <Suspense fallback={null}>
            <AuthProvider>
              {children}
              <Toaster /> {/* Add the Toaster component here */}
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}