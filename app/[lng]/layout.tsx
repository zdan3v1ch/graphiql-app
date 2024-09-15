import type { Metadata } from 'next';
import { dir } from 'i18next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Container, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import StoreProvider from '@/app/[lng]/StoreProvider';
import SessionProvider from './SessionProvider';
import { i18nConfig, namespaces } from '@/app/i18n/data/i18n.constants';
import { Params } from '@/app/i18n/data/i18n.interface';
import { initI18n } from '@/app/i18n/i18n';
import I18nProvider from '@/app/i18n/i18nProvider';

import { auth } from '@/auth';
import { theme } from '@/app/theme/theme';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import './global.css';

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
  const session = await auth();
  const { resources } = await initI18n({ language, namespaces });

  return (
    <html lang={language} dir={dir(language)}>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <SessionProvider session={session}>
        <StoreProvider>
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
                    <main
                      className="flex"
                      style={{ paddingBlock: '2rem', marginTop: '5rem' }}
                    >
                      {children}
                    </main>
                  </Container>
                  <Footer />
                </I18nProvider>
              </body>
            </AppRouterCacheProvider>
          </ThemeProvider>
        </StoreProvider>
      </SessionProvider>
    </html>
  );
}
