import { Header } from '@/app/[lng]/components/Header/Header';
import { useTranslation } from '@/app/i18n/i18n';
import { Params } from '@/app/i18n/i18n.interface';

export default async function Home({ params }: { params: Params }) {
  const { lng } = params;
  const { t } = await useTranslation(lng);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Header lng={lng}></Header>
      <div>Set up internationalization. You are in {lng}</div>
      <h1>{t('title')}</h1>
    </main>
  );
}
