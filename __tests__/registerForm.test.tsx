import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '@/app/[lng]/register/components/RegisterForm';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/components/form/FormInputText', () => ({
  __esModule: true,
  default: ({ name, label }: { name: string; label: string }) => (
    <input placeholder={label} name={name} aria-label={name} />
  ),
}));

jest.mock('@/components/form/FormInputPassword', () => ({
  __esModule: true,
  default: ({ name, label }: { name: string; label: string }) => (
    <input type="password" placeholder={label} name={name} aria-label={name} />
  ),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    getValues: jest.fn().mockReturnValue({
      email: 'test@example.com',
      username: 'test',
      password: 'password123',
      confirmPassword: 'password123',
    }),
    formState: { isValid: true },
  }),
}));

describe('RegisterForm component', () => {
  const mockOnSubmit = jest.fn();

  const renderComponent = (registeredEmail?: string, error?: string) =>
    render(<RegisterForm registeredEmail={registeredEmail} error={error} onSubmit={mockOnSubmit} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render component with fields', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('formLabelEmail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('formLabelUsername')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('formLabelPassword')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('formLabelConfirmPassword')).toBeInTheDocument();
  });

  it('successful registration', () => {
    renderComponent('test@example.com');

    expect(screen.getByText(/Account for/)).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText(/sign in with your credentials/)).toBeInTheDocument();
  });

  it('show error message', () => {
    renderComponent(undefined, 'Some error occurred');

    expect(screen.getByText('Some error occurred')).toBeInTheDocument();
  });

  it('call onSubmit with correct data', async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText('formLabelEmail');
    const usernameInput = screen.getByPlaceholderText('formLabelUsername');
    const passwordInput = screen.getByPlaceholderText('formLabelPassword');
    const confirmPasswordInput = screen.getByPlaceholderText('formLabelConfirmPassword');
    const submitButton = screen.getByRole('button', { name: 'buttonLabelSignUp' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'test',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });
});
