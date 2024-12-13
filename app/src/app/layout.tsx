import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LNLottery",
  description: "Bitcoin lightning network games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
