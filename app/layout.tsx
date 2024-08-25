import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

// Initialize Google Font
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <SignedOut>
            {/* If the user is signed out, show the SignInButton */}
            <SignInButton />
          </SignedOut>
          
          <SignedIn>
            {/* If the user is signed in, show the UserButton */}
            <UserButton />
          </SignedIn>
          
          {/* Main content where page-specific content will be injected */}
          <main>
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
