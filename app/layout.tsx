import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OMPA 2.0 – Online-Marketing-Potenzialanalyse | zweimeter.online",
  description:
    "Finde heraus, wo dein Online-Marketing wirklich steht. Die OMPA analysiert 10 Themenbereiche und gibt dir konkrete Handlungsempfehlungen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
