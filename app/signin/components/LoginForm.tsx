'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Button, Typography, Box, Alert } from '@mui/material';

import { signInSchema } from '@/auth/schema';
import type { SignInData } from '@/auth/schema';
import FormInputText from '@/components/form/FormInputText';
import FormInputPassword from '@/components/form/FormInputPassword';

interface Props {
  error?: string;
  onSubmit: (data: SignInData) => Promise<void>;
}

const LoginPage: React.FC<Props> = ({ error, onSubmit }) => {
  const defaultValues = {
    email: '',
    password: '',
  };
  const [loading, setLoading] = useState(false);
  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
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
          Sign in to your account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}
        <form
          action={async () => await onSubmit(getValues())}
          onSubmit={() => {
            setLoading(true);
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
          <FormInputPassword
            name="password"
            control={control}
            label="Password"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isValid || loading}
          >
            Sign in
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
