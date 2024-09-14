import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/app/[lng]/signin/components/LoginForm';

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    error: undefined,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements and submit button', () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByLabelText(/formLabelEmail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/formLabelPassword/)).toBeInTheDocument();
    expect(screen.getByText(/buttonLabelSignIn/)).toBeInTheDocument();
    expect(screen.getByText(/signInHintText/)).toBeInTheDocument();
  });

  it('displays error message when error prop is passed', () => {
    render(<LoginForm {...defaultProps} error="Invalid credentials" />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('disables submit button when form is invalid or loading', () => {
    render(<LoginForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', {
      name: 'buttonLabelSignIn',
    });
    expect(submitButton).toBeDisabled(); // Initial state, as form is invalid
  });

  it('enables submit button when form is valid', async () => {
    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/formLabelEmail/);
    const passwordInput = screen.getByLabelText(/formLabelPassword/);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'buttonLabelSignIn' })
      ).toBeEnabled();
    });
  });

  it('displays loading spinner when form is submitting', async () => {
    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/formLabelEmail/);
    const passwordInput = screen.getByLabelText(/formLabelPassword/);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', {
      name: 'buttonLabelSignIn',
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveAttribute('disabled');
    });
  });
});
