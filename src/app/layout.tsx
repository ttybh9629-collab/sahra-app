import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAHRA | تطبيق الدردشة الصوتية المباشرة",
  description: "منصة SAHRA الاجتماعية الصوتية المتكاملة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "'Cairo', sans-serif" }}
        className="bg-[#090410] text-white antialiased selection:bg-[#D4AF37] selection:text-black"
      >
        {children}
      </body>
    </html>
  );
}
