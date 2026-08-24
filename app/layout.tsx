import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Natural Wild — An Interactive 3D Forest Journey",
  description:
    "Scroll through a living low-poly forest — from the firefly-lit floor to the canopy, across a hidden river, into the sunset.",
};

export const viewport: Viewport = {
  themeColor: "#07130d",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
