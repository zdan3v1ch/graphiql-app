import { notFound } from 'next/navigation';

import { RestClient } from '../components/RestClient/RestClient';
import { GraphiQl } from '@/app/[lng]/components/GraphiQl/GraphiQl';

import { isHttpMethod } from './utils';

interface Props {
  params: {
    slug: string[];
  };
}

const Page: React.FC<Props> = ({ params }) => {
  const { slug } = params;

  if (isHttpMethod(slug[0].toUpperCase())) {
    return (
      <>
        <h1>Restful Client</h1>
        <RestClient />
      </>
    );
  }

  if (slug[0].toUpperCase() === 'GRAPHQL') {
    return (
      <>
        <h1>GraphiQL</h1>
        <GraphiQl />
      </>
    );
  }

  notFound();
};

export default Page;
