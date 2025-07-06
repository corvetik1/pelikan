import type { Metadata } from "next";
import Providers from "@/providers/Providers";
import Header from "@/components/Header";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Меридиан — Рыбная компания",
  description: "Корпоративный сайт рыбной компании Меридиан",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
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
