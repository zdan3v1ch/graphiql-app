import type { Metadata } from 'next';
import { dir } from 'i18next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { i18nConfig, namespaces } from '@/app/i18n/data/i18n.constants';
import { Params } from '@/app/i18n/data/i18n.interface';
import './global.css';
import { initI18n } from '@/app/i18n/i18n';
import I18nProvider from '@/app/i18n/i18nProvider';
import { theme } from '@/app/theme/theme';
import { ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';

export const metadata: Metadata = {
  title: 'Final task app',
  description: 'The best final task ever',
};

export function generateStaticParams() {
  return i18nConfig.locales.map((lng) => ({ lng }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const language = params.lng;
  const { resources } = await initI18n({ language, namespaces });
  return (
    <html lang={language} dir={dir(language)}>
      <ThemeProvider theme={theme}>
        <AppRouterCacheProvider>
          <body>
            <I18nProvider
              namespaces={namespaces}
              language={language}
              resources={resources}
            >
              <CssBaseline />
              <Header language={language} />
              <Container>
                <main className="flex" style={{ paddingBlock: '2rem' }}>
                  {children}
                </main>
              </Container>
              <Footer />
            </I18nProvider>
          </body>
        </AppRouterCacheProvider>
      </ThemeProvider>
    </html>
  );
}
