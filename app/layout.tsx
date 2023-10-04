import Navbar from "@/components/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/redux/provider";
import Footer from "@/components/footer";
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommercely Website - Krish Jotaniya",
  description: "Buy the best product at cheaper rates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
          <Navbar />
          {children}
          <Toaster position="bottom-right" />
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
