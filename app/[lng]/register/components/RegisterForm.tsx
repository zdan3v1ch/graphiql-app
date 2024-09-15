'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { type RegisterData, registerSchema } from '@/lib/firestore/schema';
import { Namespaces } from '@/app/i18n/data/i18n.enum';

import FormInputText from '@/components/form/FormInputText';
import FormInputPassword from '@/components/form/FormInputPassword';

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
  const { t } = useTranslation(Namespaces.AUTH);
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
        }}
      >
        <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
          {t('titleSignUp')}
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
            label={t('formLabelEmail')}
            type="email"
            required
            margin="normal"
          />
          <FormInputText
            name="username"
            control={control}
            label={t('formLabelUsername')}
            required
          />
          <FormInputPassword
            name="password"
            control={control}
            label={t('formLabelPassword')}
            required
          />
          <FormInputPassword
            name="confirmPassword"
            control={control}
            label={t('formLabelConfirmPassword')}
            required
          />
          <LoadingButton
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isValid || loading}
          >
            {t('buttonLabelSignUp')}
          </LoadingButton>
          <Typography marginTop="2rem">
            {t('signUpHintText')}&nbsp;
            <Link href="/signin">{t('signUpHintLinkLabel')}</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterForm;
