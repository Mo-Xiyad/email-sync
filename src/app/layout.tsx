import ThemeWrapper from "@/components/theme-provicer";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";
import KBar from "./mail/components/kbar";
export const metadata: Metadata = {
  title: "Email Sync",
  description: "Powered by Ai",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <ThemeWrapper>
            <TRPCReactProvider>
              <KBar>{children}</KBar>
            </TRPCReactProvider>
            <Toaster />
          </ThemeWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
