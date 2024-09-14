import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BurgerMenu from '@/app/[lng]/components/Header/components/BurgerMenu';
import { Session } from 'next-auth';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));


jest.mock('@mui/icons-material/Menu', () => {
  const MockMenu = () => <div>Mock Menu</div>;
  MockMenu.displayName = 'Menu';
  return MockMenu;
});
jest.mock('@mui/icons-material/Login', () => {
  const MockLogin = () => <div>Mock Login</div>;
  MockLogin.displayName = 'Login';
  return MockLogin;
});
jest.mock('@mui/icons-material/Face', () => {
  const MockFace = () => <div>Mock Face</div>;
  MockFace.displayName = 'Face';
  return MockFace;
});

jest.mock('../components/NavButton', () => {
  const MockNavButton = ({ label }: { label: string }) => <div>{label}</div>;
  MockNavButton.displayName = 'NavButton';
  return MockNavButton;
});

jest.mock('../app/[lng]/components/Header/components/SignOutButton', () => {
  const MockSignOutButton = () => <div>SignOutButton Mock</div>;
  MockSignOutButton.displayName = 'SignOutButton';
  return MockSignOutButton;
});

jest.mock('../app/[lng]/components/LanguageToggle/LanguageToggle', () => {
  const MockLanguageToggle = () => <div>LanguageToggle Mock</div>;
  MockLanguageToggle.displayName = 'LanguageToggle';
  return { LanguageToggle: MockLanguageToggle };
});

jest.mock('../app/[lng]/components/Header/constants', () => ({
  protectedNavButtonParams: [
    { labelHeaderNsKey: 'dashboard', url: '/dashboard', muiIcon: jest.fn(() => <div>Icon</div>) },
  ],
}));

describe('BurgerMenu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for unauthenticated users', () => {
    render(<BurgerMenu session={null} />);

    expect(screen.getByText('LanguageToggle Mock')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Mock Menu'));

    expect(screen.getByText('signIn')).toBeInTheDocument();
    expect(screen.getByText('signUp')).toBeInTheDocument();
  });

  it('renders correctly for authenticated users', async () => {
    const mockSession: Session = { user: { email: 'test@example.com', name: 'Test User' }, expires: '' };

    render(<BurgerMenu session={mockSession} />);

    expect(screen.getByText('LanguageToggle Mock')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Mock Menu'));

    await waitFor(() => expect(screen.getByText('dashboard')).toBeInTheDocument());

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('SignOutButton Mock')).toBeInTheDocument();
  });

});
