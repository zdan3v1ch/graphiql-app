import { notFound } from 'next/navigation';

import { RestClient } from '../components/RestClient/RestClient';

import { isHttpMethod } from './utils';

interface Props {
  params: {
    slug: string[];
  };
}

const Page: React.FC<Props> = ({ params }) => {
  const { slug } = params;

  if (isHttpMethod(slug[0])) {
    return (
      <>
        <h1>Restful Client</h1>
        <RestClient />
      </>
    );
  }

  notFound();
};

export default Page;
