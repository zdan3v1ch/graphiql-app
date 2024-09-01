import { initI18n } from '@/app/i18n/i18n';
import { namespaces } from '@/app/i18n/data/i18n.constants';
import { Params } from '@/app/i18n/data/i18n.interface';

export default async function Main({ params }: { params: Params }) {
  const language = params.lng;
  const { t } = await initI18n({ language, namespaces });
  return <h1>{t('title')}</h1>;
}
