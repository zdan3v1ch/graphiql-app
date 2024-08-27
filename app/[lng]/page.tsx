import { Header } from '@/app/[lng]/components/Header/Header';
import { initI18n } from '@/app/i18n/i18n';
import { namespaces } from '@/app/i18n/data/i18n.constants';
import { Params } from '@/app/i18n/data/i18n.interface';
import I18nProvider from '@/app/i18n/i18nProvider';

export default async function Main({ params }: { params: Params }) {
  const language = params.lng;
  const { t, resources } = await initI18n({ language, namespaces });
  return (
    <I18nProvider
      namespaces={namespaces}
      language={language}
      resources={resources}
    >
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <Header></Header>
        <h1>{t('title')}</h1>
      </main>
    </I18nProvider>
  );
}
