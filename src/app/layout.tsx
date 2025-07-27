import type { Metadata } from "next";
import Providers from "@/providers/Providers";
import { getActiveThemeTokens } from '@/lib/themeServer';
import Header from "@/components/Header";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Бухта пеликанов — Рыбная компания",
  description: "Корпоративный сайт рыбной компании Бухта пеликанов",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTokens = await getActiveThemeTokens();
  return (
    <html lang="en">
      <body>
        <Providers initialTokens={initialTokens}>
          <Header />
            <main>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                  {children}
                </Container>
              </Box>
            </main>
            <Footer />
        </Providers>
      </body>
    </html>
  );
}
