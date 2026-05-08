import type { Metadata } from 'next'; 
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import Providers from './providers'; 
 
export const metadata: Metadata = { 
  title: 'Easy Homes', 
  description: 'Real Estate App', 
  icons: {
    icon: '/easyhomes.png',
    apple: '/easyhomes.png',
    shortcut: '/easyhomes.png',
  },
}; 
 
export default function RootLayout({ 
  children, 
}: { 
  children: React.ReactNode; 
}) { 
  return ( 
    <html lang="en"> 
      <body style={{ margin: 0, background: '#f3f4f6' }}> 
 
        <Providers> 
          <Header /> 
 
          <main style={{ minHeight: '80vh' }}> 
            {children} 
          </main> 
 
          <Footer /> 
        </Providers> 
 
      </body> 
    </html> 
  ); 
}