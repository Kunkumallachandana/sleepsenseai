import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SleepSense AI — Know Your Sleep Quality",
  description: "AI-Powered Smartphone Sleep Prediction",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ background: "#f0f2f5", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
