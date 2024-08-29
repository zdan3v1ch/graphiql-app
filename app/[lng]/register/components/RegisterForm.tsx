'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Button, Typography, Box, Alert } from '@mui/material';

import { type RegisterData, registerSchema } from '@/lib/firestore/schema';
import FormInputText from '@/components/form/FormInputText';
import FormInputPassword from '@/components/form/FormInputPassword';
import Link from 'next/link';

interface Props {
  registeredEmail?: string;
  error?: string;
  onSubmit: (data: Omit<RegisterData, 'confirmPassword'>) => Promise<void>;
}

const RegisterForm: React.FC<Props> = ({
  registeredEmail,
  error,
  onSubmit,
}) => {
  const defaultValues: RegisterData = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };
  const [loading, setLoading] = useState(false);
  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: 'onTouched',
  });

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          height: '100vh',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Create your account
        </Typography>
        {registeredEmail && (
          <Alert severity="success" sx={{ width: '100%' }}>
            Account for{' '}
            <Typography fontWeight="bold" display="inline" fontSize="inherit">
              {registeredEmail}
            </Typography>{' '}
            has been successfully created!
            <br />
            Now you can{' '}
            <Typography
              display="inline"
              fontSize="inherit"
              fontWeight="medium"
              sx={{ textDecoration: 'underline' }}
            >
              <Link href={'/signin'}>sign in with your credentials</Link>
            </Typography>
            .
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            await onSubmit(getValues());
          }}
        >
          <FormInputText
            name="email"
            control={control}
            label="Email"
            type="email"
            required
            margin="normal"
          />
          <FormInputText
            name="username"
            control={control}
            label="Username"
            required
          />
          <FormInputPassword
            name="password"
            control={control}
            label="Password"
            required
          />
          <FormInputPassword
            name="confirmPassword"
            control={control}
            label="Confirm password"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isValid || loading}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterForm;
