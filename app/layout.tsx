import type { Metadata } from "next";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import './global.css';

export const metadata: Metadata = {
  title: "Final task app",
  description: "The best final task ever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <body>
          <Header />
            {children}
          <Footer />
        </body>
      </AppRouterCacheProvider>
    </html>
  );
}
