import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import AccessibilityPanel from '@/app/accessibility/AccessibilityPanel';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Air Quality - Sistema de Calidad del Aire',
  description: 'Sistema de monitoreo y predicción de la calidad del aire',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className="">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <AccessibilityPanel />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
