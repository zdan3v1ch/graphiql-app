import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { FirebaseError } from '@firebase/util';
import { registerWithEmailAndPassword } from '@/lib/firestore/service';
import Register from '@/app/[lng]/register/page';
import RegisterForm from '@/app/[lng]/register/components/RegisterForm';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
jest.mock('@/app/i18n/i18n', () => ({
  initI18n: jest.fn().mockResolvedValue({ t: (key: string) => key }),
}));
jest.mock('@/lib/firestore/service', () => ({
  registerWithEmailAndPassword: jest.fn(),
}));
jest.mock('@/app/[lng]/register/components/RegisterForm', () =>
  jest.fn(
    ({
      onSubmit,
    }: {
      onSubmit: (data: {
        username: string;
        email: string;
        password: string;
      }) => void;
    }) => (
      <form
        role="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            username: 'testuser',
            email: 'test@test.com',
            password: 'password',
          });
        }}
      />
    )
  )
);

describe('Register Component', () => {
  const params = { lng: 'en' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the RegisterForm and handle successful submission', async () => {
    (registerWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    render(await Register({ params, searchParams: {} }));

    expect(RegisterForm).toHaveBeenCalled();

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() =>
      expect(redirect).toHaveBeenCalledWith(
        'register?registeredEmail=test@test.com'
      )
    );
  });

  it('should handle Firebase errors and redirect with error code', async () => {
    const mockFirebaseError = new FirebaseError(
      'auth/email-already-in-use',
      'The email is already in use.'
    );
    (registerWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      mockFirebaseError
    );

    render(await Register({ params, searchParams: {} }));

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() =>
      expect(redirect).toHaveBeenCalledWith(
        'register?error=auth/email-already-in-use'
      )
    );
  });
});
