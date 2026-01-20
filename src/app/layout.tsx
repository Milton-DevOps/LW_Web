import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Providers } from "./providers";
import { Carousel, Navbar } from "@/components";
import "./globals.css";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Light World Mission",
  description: "Light World Mission Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <GoogleOAuthProvider clientId={googleClientId}>
          <Providers>
            {children}
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
