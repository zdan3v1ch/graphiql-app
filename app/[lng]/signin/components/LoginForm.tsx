'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { type SignInData, signInSchema } from '@/auth/schema';
import { Namespaces } from '@/app/i18n/data/i18n.enum';

import FormInputText from '@/components/form/FormInputText';
import FormInputPassword from '@/components/form/FormInputPassword';
import Link from 'next/link';

interface Props {
  error?: string;
  onSubmit: (data: SignInData) => Promise<void>;
}

const LoginForm: React.FC<Props> = ({ error, onSubmit }) => {
  const { t } = useTranslation(Namespaces.AUTH);
  const defaultValues: SignInData = {
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
        }}
      >
        <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
          {t('titleSignIn')}
        </Typography>
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
          <FormInputPassword
            name="password"
            control={control}
            label={t('formLabelPassword')}
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
            {t('buttonLabelSignIn')}
          </LoadingButton>
          <Typography marginTop="2rem">
            {t('signInHintText')}&nbsp;
            <Link href="/register">{t('signInHintLinkLabel')}</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
