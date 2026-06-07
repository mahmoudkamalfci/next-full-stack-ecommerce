import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { CartSyncProvider } from "@/components/CartSyncProvider";
import { cookies } from "next/headers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FreshFit - Modern Athletic Wear",
  description: "Your premier destination for fashion-forward clothing and accessories",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <CartSyncProvider isAuthenticated={!!(await cookies()).get("token")}>
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
        <SiteFooter />
        </CartSyncProvider>
      </body>
    </html>
  );
}

