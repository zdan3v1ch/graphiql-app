import { render, screen, waitFor } from '@testing-library/react';

import { auth } from '@/auth';
import { initI18n } from '@/app/i18n/i18n';

import Header from '@/app/[lng]/components/Header/Header';

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
jest.mock('../app/[lng]/components/Header/components/Logo', () => {
  const MockLogo = () => <div>Logo Mock</div>;
  MockLogo.displayName = 'Logo';
  return MockLogo;
});
jest.mock('../app/[lng]/components/Header/components/HeaderBar', () => {
  const MockHeaderBar = ({ children }: { children: React.ReactNode }) => (
    <div>HeaderBar Mock {children}</div>
  );
  MockHeaderBar.displayName = 'HeaderBar';
  return MockHeaderBar;
});
jest.mock('../app/[lng]/components/Header/components/BurgerMenu', () => {
  const MockBurgerMenu = () => <div>BurgerMenu Mock</div>;
  MockBurgerMenu.displayName = 'BurgerMenu';
  return MockBurgerMenu;
});
jest.mock('../app/[lng]/components/LanguageToggle/LanguageToggle', () => {
  const MockLanguageToggle = () => <div>LanguageToggle Mock</div>;
  MockLanguageToggle.displayName = 'LanguageToggle';
  return { LanguageToggle: MockLanguageToggle };
});
jest.mock('../app/[lng]/components/Header/components/SignOutButton', () => {
  const MockSignOutButton = () => <div>SignOutButton Mock</div>;
  MockSignOutButton.displayName = 'SignOutButton';
  return MockSignOutButton;
});

const t = (key: string) => key;

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login and signup buttons when no user is authenticated', async () => {
    // Mock the auth function to return null (unauthenticated user)
    (auth as jest.Mock).mockResolvedValueOnce(null);
    (initI18n as jest.Mock).mockResolvedValueOnce({
      t,
    });

    render(await Header({ language: 'en' }));

    await waitFor(() => {
      expect(screen.getByText('signIn')).toBeInTheDocument();
      expect(screen.getByText('signUp')).toBeInTheDocument();
    });
  });

  it('renders navigation and user chip when user is authenticated', async () => {
    // Mock the auth function to return a session object
    (auth as jest.Mock).mockResolvedValueOnce({
      user: {
        name: 'John Doe',
      },
    });
    (initI18n as jest.Mock).mockResolvedValueOnce({
      t,
    });

    render(await Header({ language: 'en' }));

    await waitFor(() => {
      expect(screen.getByText('navMain')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('SignOutButton Mock')).toBeInTheDocument();
    });
  });

  it('renders default name when no user name is provided', async () => {
    // Mock the auth function to return a session without a username
    (auth as jest.Mock).mockResolvedValueOnce({
      user: {},
    });
    (initI18n as jest.Mock).mockResolvedValueOnce({
      t,
    });

    render(await Header({ language: 'en' }));

    await waitFor(() => {
      expect(screen.getByText('No name')).toBeInTheDocument();
    });
  });

  it('renders the language toggle', async () => {
    // Mock the auth function to return null (unauthenticated)
    (auth as jest.Mock).mockResolvedValueOnce(null);
    (initI18n as jest.Mock).mockResolvedValueOnce({
      t,
    });

    render(await Header({ language: 'en' }));

    await waitFor(() => {
      expect(screen.getByText('LanguageToggle Mock')).toBeInTheDocument();
    });
  });
});
