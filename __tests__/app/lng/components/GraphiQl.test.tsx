import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';

import {
  useLazyGetGraphqlApiSdlQuery,
  useLazyGetGraphqlApiResponseQuery,
} from '@/lib/services/apiResponse';
import { Store } from '@/lib/localStorage/localStorage';

import { GraphiQl } from '@/app/[lng]/components/GraphiQl/GraphiQl';

jest.mock('@/app/[lng]/components/GraphiQl/hooks/useUpdateUrl', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    upSm: true,
    t: (key: string) => key,
    i18n: { language: 'en' },
    pathname: 'en/GRAPHQL/aHR0cHM6Ly9yaWNrYW5kbW9ydHlhcGkuY29tL2dyYXBocWw=',
    clientUrl: '/en/GRAPHQL/aHR0cHM6Ly9yaWNrYW5kbW9ydHlhcGkuY29tL2dyYXBocWw=',
  }),
}));

jest.mock('@/app/utils', () => ({
  removeLocaleFromUrl: jest
    .fn()
    .mockReturnValue(
      '/GRAPHQL/aHR0cHM6Ly9yaWNrYW5kbW9ydHlhcGkuY29tL2dyYXBocWw='
    ),
  parseGraphiQlUrl: jest.fn().mockReturnValue({
    endpointUrl: 'https://rickandmortyapi.com/graphql',
    headers: { 'Content-Type': 'application/json' },
    body: '',
  }),
}));

jest.mock('@/app/[lng]/hooks/useGetAllSearchParams', () =>
  jest.fn().mockReturnValue({
    removeLocaleFromUrl: jest
      .fn()
      .mockReturnValue('/GET/aHR0cHM6Ly9zd2FwaS5kZXYvYXBpL3Blb3BsZS8x'),
  })
);

jest.mock('@/lib/services/apiResponse', () => ({
  useLazyGetGraphqlApiSdlQuery: jest.fn(),
  useLazyGetGraphqlApiResponseQuery: jest.fn(),
}));

jest.mock('@/lib/localStorage/localStorage', () => ({
  Store: {
    addRequest: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  ToastContainer: () => null,
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('graphql', () => ({
  buildClientSchema: jest.fn().mockReturnValue('schema'),
}));

jest.mock('@/app/[lng]/components/GraphiQl/components/SdlExplorer', () => {
  const SdlExplorer = () => <div>mockSdlExplorer</div>;
  SdlExplorer.displayName = 'SdlExplorer';
  return SdlExplorer;
});

jest.mock(
  '@/app/[lng]/components/GraphiQl/components/GraphqlQueryInput',
  () => {
    const GraphqlQueryInput = () => <div>mockGraphqlQueryInput</div>;
    GraphqlQueryInput.displayName = 'GraphqlQueryInput';
    return GraphqlQueryInput;
  }
);

const mockSession = { user: { email: 'test@example.com' }, expires: '' };
const mockStoreAddRequest = jest
  .spyOn(Store, 'addRequest')
  .mockImplementation(jest.fn());

describe('GraphiQl component', () => {
  const sdlTrigger = jest.fn();

  beforeEach(() => {
    (useLazyGetGraphqlApiSdlQuery as jest.Mock).mockReturnValue([
      sdlTrigger,
      { data: { data: 'mock SDL data' }, isFetching: false, error: null },
    ]);
    (useLazyGetGraphqlApiResponseQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      {
        data: { status: 200, data: 'mock data' },
        isFetching: false,
        error: null,
      },
    ]);
  });

  it('renders correctly', () => {
    render(<GraphiQl session={mockSession} />);

    expect(screen.getByText('graphiQl')).toBeInTheDocument();
    expect(screen.getByLabelText('endpointUrlGraphql')).toBeInTheDocument();
    expect(screen.getByLabelText('sdlUrlGraphql')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /load/i })).toBeInTheDocument();
  });

  it('submits the form and fetches data', async () => {
    render(<GraphiQl session={mockSession} />);

    fireEvent.change(screen.getByLabelText('endpointUrlGraphql'), {
      target: { value: 'http://new-endpoint' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(mockStoreAddRequest).toHaveBeenCalledWith(
        expect.stringContaining(
          '/GRAPHQL/aHR0cHM6Ly9yaWNrYW5kbW9ydHlhcGkuY29tL2dyYXBocWw='
        ),
        mockSession.user.email
      );
    });
  });

  it('loads SDL schema on button click', async () => {
    render(<GraphiQl session={mockSession} />);

    fireEvent.change(screen.getByLabelText('sdlUrlGraphql'), {
      target: { value: 'http://new-sdl-url' },
    });
    fireEvent.click(screen.getByRole('button', { name: /load/i }));

    await waitFor(() => {
      expect(sdlTrigger).toHaveBeenCalledWith('http://new-sdl-url');
    });
  });

  it('handles fetch errors and shows toast messages', async () => {
    const mockError = { data: { error: 'Fetch failed' }, status: 500 };
    (useLazyGetGraphqlApiResponseQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      { data: null, isFetching: false, error: mockError },
    ]);
    (useLazyGetGraphqlApiSdlQuery as jest.Mock).mockReturnValue([
      jest.fn(),
      { data: null, isFetching: false, error: mockError },
    ]);

    render(<GraphiQl session={mockSession} />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('500: Fetch failed');
    });
  });
});
