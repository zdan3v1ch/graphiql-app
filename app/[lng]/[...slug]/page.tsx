import { notFound } from 'next/navigation';

import { RestClient } from '../components/RestClient/RestClient';
import { GraphiQl } from '@/app/[lng]/components/GraphiQl/GraphiQl';

import { isHttpMethod } from './utils';
import { auth } from '@/auth';

interface Props {
  params: {
    slug: string[];
  };
}

const Page: React.FC<Props> = async ({ params }) => {
  const { slug } = params;
  const session = await auth();

  if (isHttpMethod(slug[0].toUpperCase())) {
    return <RestClient session={session} />;
  }

  if (slug[0].toUpperCase() === 'GRAPHQL') {
    return <GraphiQl session={session} />;
  }

  notFound();
};

export default Page;
