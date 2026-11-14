import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verisyn — Your credentials, verified",
  description:
    "A secure home for qualifications and verifiable credentials, built on Gno.",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
