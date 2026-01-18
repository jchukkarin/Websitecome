import "./globals.css";
import { Kanit } from "next/font/google";
import { Toaster } from "react-hot-toast";


// Font Kanit
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata = {
  title: "นายตัวน้อย",
  description: "Dashboard และระบบของนายตัวน้อย",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={kanit.className}>
      <body className="antialiased min-h-screen">

          {children}
  
        {/* Toast */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
