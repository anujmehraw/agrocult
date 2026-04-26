import "./globals.css";
import type { Viewport } from "next";

export const metadata = {
  title: "Agrocult",
  description: "Smart Farming App",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}