import {  Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import { constructMetadata } from "@/lib/utils";


const geistSans = Recursive({
  subsets: ["latin"],
});


export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased`}
        cz-shortcut-listen="true"
      >
        <Navbar />
        <main className="flex flex-1 flex-col min-h-[calc(100vh-3.5rem-1px)]">
          <div className="h-full flex flex-col flex-1">
            <Providers>
              {children}
            </Providers>
          </div>
          <Footer />
        </main>
        <Toaster />
      </body>
    </html>
  );
}
