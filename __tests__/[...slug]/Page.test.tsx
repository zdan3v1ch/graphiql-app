import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { isHttpMethod } from '@/app/[lng]/[...slug]/utils';
import { RestClient } from '@/app/[lng]/components/RestClient/RestClient';
import { GraphiQl } from '@/app/[lng]/components/GraphiQl/GraphiQl';
import Page from '@/app/[lng]/[...slug]/page';

jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));
jest.mock('@/app/[lng]/components/RestClient/RestClient', () => ({
  RestClient: jest.fn(() => <div>RestClient Component</div>),
}));
jest.mock('@/app/[lng]/components/GraphiQl/GraphiQl', () => ({
  GraphiQl: jest.fn(() => <div>GraphiQl Component</div>),
}));
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));
jest.mock('@/app/[lng]/[...slug]/utils', () => ({
  isHttpMethod: jest.fn(),
}));

describe('Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders RestClient when slug[0] is an HTTP method', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: 'testUser' });
    (isHttpMethod as unknown as jest.Mock).mockReturnValue(true);

    render(await Page({ params: { slug: ['GET'] } }));

    expect(await screen.findByText('RestClient Component')).toBeInTheDocument();
    expect(RestClient).toHaveBeenCalledWith(
      { session: { user: 'testUser' } },
      {}
    );
  });

  test('renders GraphiQl when slug[0] is "GRAPHQL"', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: 'testUser' });
    (isHttpMethod as unknown as jest.Mock).mockReturnValue(false);

    render(await Page({ params: { slug: ['GRAPHQL'] } }));

    expect(await screen.findByText('GraphiQl Component')).toBeInTheDocument();
    expect(GraphiQl).toHaveBeenCalledWith(
      { session: { user: 'testUser' } },
      {}
    );
  });

  test('calls notFound when slug[0] is not an HTTP method or "GRAPHQL"', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: 'testUser' });
    (isHttpMethod as unknown as jest.Mock).mockReturnValue(false);

    render(await Page({ params: { slug: ['any-other-slug'] } }));

    expect(notFound).toHaveBeenCalled();
  });
});
