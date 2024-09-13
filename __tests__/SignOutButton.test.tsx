import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/auth/utils';
import SignOutButton from '@/app/[lng]/components/Header/components/SignOutButton';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/auth/utils', () => ({
  signOut: jest.fn(),
}));

describe('SignOutButton Component', () => {
  const mockRouterPush = jest.fn();
  const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it('renders correctly with the icon', () => {
    render(<SignOutButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('ExitToAppIcon')).toBeInTheDocument();
  });

  it('disables button and shows loading spinner while loading', () => {
    render(<SignOutButton />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('calls signOut and router.push on click', async () => {
    mockSignOut.mockResolvedValueOnce(undefined);

    render(<SignOutButton />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });
  });

  it('calls onSignOut prop if provided', async () => {
    const mockOnSignOut = jest.fn();
    mockSignOut.mockResolvedValueOnce(undefined);

    render(<SignOutButton onSignOut={mockOnSignOut} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockOnSignOut).toHaveBeenCalled();
    });
  });
});
