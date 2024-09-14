import { render, screen, fireEvent } from '@testing-library/react';
import { signIn } from '@/auth';
import SignIn from '@/app/[lng]/signin/page';
import LoginForm from '@/app/[lng]/signin/components/LoginForm';
import { AuthErrorType } from '@/app/[lng]/signin/types';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next-auth', () =>
  jest.fn().mockImplementation(() => ({
    handlers: jest.fn(),
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }))
);

jest.mock('@/auth', () => ({
  signIn: jest.fn(),
}));

jest.mock('@/app/i18n/i18n', () => ({
  initI18n: jest.fn().mockResolvedValue({ t: jest.fn((key: string) => key) }),
}));

jest.mock('@/app/[lng]/signin/components/LoginForm', () => jest.fn());

describe('SignIn Component', () => {
  const params = { lng: 'en' };
  const searchParams = {
    callbackUrl: '/dashboard',
    error: 'invalid_credentials' as AuthErrorType,
  };

  beforeEach(() => {
    (LoginForm as jest.Mock).mockImplementation(
      ({
        onSubmit,
      }: {
        onSubmit: (data: { email: string; password: string }) => void;
      }) => (
        <button
          onClick={() =>
            onSubmit({ email: 'test@example.com', password: 'password123' })
          }
        >
          Submit
        </button>
      )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', async () => {
    render(await SignIn({ params, searchParams }));
    expect(LoginForm).toHaveBeenCalled();
  });

  it('calls signIn with valid data on form submission', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({});

    render(await SignIn({ params, searchParams }));

    fireEvent.click(screen.getByText('Submit'));

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirectTo: '/dashboard',
    });
  });

  it('redirects to default page if no callbackUrl is provided', async () => {
    render(await SignIn({ params, searchParams }));

    fireEvent.click(screen.getByText('Submit'));

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password123',
      redirectTo: '/dashboard',
    });
  });
});
