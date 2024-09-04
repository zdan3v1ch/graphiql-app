'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Button, Typography, Box, Alert } from '@mui/material';

import { graphqlSchema } from '@/auth/schema';
import { Namespaces } from '@/app/i18n/data/i18n.enum';

import FormInputText from '@/components/form/FormInputText';

interface Props {
  error?: string;
  onSubmit: (data: GraphqlData) => void;
}

export interface GraphqlData {
  endpoint: string;
  sdl?: string;
  query?: string;
  variables?: string | number;
  headerKey?: string;
  headerValue?: string | number;
}

const GraphqlForm: React.FC<Props> = ({ error, onSubmit }) => {
  const { t } = useTranslation(Namespaces.GRAPHQL);
  const defaultValues: GraphqlData = {
    endpoint: '',
    sdl: '',
  };
  const [loading, setLoading] = useState(false);
  const [show, isShow] = useState(false);
  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm<GraphqlData>({
    resolver: zodResolver(graphqlSchema),
    defaultValues,
    mode: 'onTouched',
  });

  function handleClick() {
    isShow(!show);
  }

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
          {t('titleGraphql')}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}
        <form
          action={() => onSubmit(getValues())}
          onSubmit={() => {
            setLoading(true);
          }}
        >
          <FormInputText
            name="endpoint"
            control={control}
            label={t('endpointUrlGraphql')}
            type="text"
            required
            margin="normal"
          />
          <FormInputText
            name="sdl"
            control={control}
            label={t('sdlUrlGraphql')}
            type="text"
            margin="normal"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" textAlign="center" gutterBottom>
                {t('headersGraphql')}
              </Typography>
              <Button
                onClick={handleClick}
                variant={show ? 'outlined' : 'contained'}
              >
                {t('addHeadersGraphql')}
              </Button>
            </Box>
            {show && (
              <Box sx={{ display: 'flex', gap: '20px' }}>
                <FormInputText
                  name="headerKey"
                  control={control}
                  label={t('headerKeyGraphql')}
                  type="text"
                  margin="normal"
                />
                <FormInputText
                  name="headerValue"
                  control={control}
                  label={t('headerValueGraphql')}
                  type="text"
                  margin="normal"
                />
              </Box>
            )}
          </Box>
          <FormInputText
            name="query"
            control={control}
            label={t('queryGraphql')}
            type="text"
            margin="normal"
          />
          <FormInputText
            name="variables"
            control={control}
            label={t('variablesGraphql')}
            type="text"
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isValid || loading}
          >
            {t('sendRequestGraphql')}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default GraphqlForm;
