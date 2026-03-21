import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rate your Claude",
  description: "Share how Claude is performing for you today",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
