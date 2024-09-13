import { render, screen, waitFor } from '@testing-library/react';

import { auth } from '@/auth';
import { initI18n } from '@/app/i18n/i18n';

import Main from '@/app/[lng]/page';
import { developers } from '@/app/[lng]/constants';

jest.mock('../auth', () => ({
  auth: jest.fn(),
}));
jest.mock('../app/i18n/i18n', () => ({
  initI18n: jest.fn(),
}));

jest.mock('../components/NavButton', () => {
  const MockNavButton = ({ label }: { label: string }) => <div>{label}</div>;
  MockNavButton.displayName = 'NavButton';
  return MockNavButton;
});

const mockSession = { user: { name: 'Test User' } };

const mockT = jest.fn((key: string) => key);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Main Page', () => {
  it('renders sign in/sign up buttons when session is not available', async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    (initI18n as jest.Mock).mockResolvedValue({ t: mockT });

    render(await Main({ params: { lng: 'en' } }));

    await waitFor(() => {
      expect(screen.getByText('title')).toBeInTheDocument();
      expect(screen.getByText('signIn')).toBeInTheDocument();
      expect(screen.getByText('signUp')).toBeInTheDocument();
    });
  });

  it('renders authenticated user content when session is available', async () => {
    (auth as jest.Mock).mockResolvedValue(mockSession);
    (initI18n as jest.Mock).mockResolvedValue({ t: mockT });

    render(await Main({ params: { lng: 'en' } }));

    await waitFor(() => {
      expect(
        screen.getByText(new RegExp('authTitle', 'i'))
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp('Test User', 'i'))
      ).toBeInTheDocument();
    });
  });

  it('renders developer info and project/course sections', async () => {
    (auth as jest.Mock).mockResolvedValue(mockSession);
    (initI18n as jest.Mock).mockResolvedValue({ t: mockT });

    render(await Main({ params: { lng: 'en' } }));

    await waitFor(() => {
      expect(screen.getByText(developers[0].name)).toBeInTheDocument();

      expect(screen.getByText('project')).toBeInTheDocument();
      expect(screen.getByText('projectDesc')).toBeInTheDocument();
      expect(screen.getByText('course')).toBeInTheDocument();
      expect(screen.getByText('courseDesc')).toBeInTheDocument();
    });
  });
});
