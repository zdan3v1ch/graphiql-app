import Logo from '@/app/[lng]/components/Header/components/Logo';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Logo Component', () => {
  it('should navigate to the home page when clicked', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    render(<Logo />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
