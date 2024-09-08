'use client';

import { useTranslation } from 'react-i18next';
import { Container, Button, Typography, Box } from '@mui/material';
import { Namespaces } from '@/app/i18n/data/i18n.enum';

import FormInputText from '@/components/form/FormInputText';


export interface GraphqlData {
  endpoint: string;
  sdl?: string;
  query?: string;
  variables?: string | number;
  headerKey?: string;
  headerValue?: string | number;
}

const GraphqlForm = () => {
  const { t } = useTranslation(Namespaces.GRAPHQL);


  return (
    <Container maxWidth="sm">
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
        <form
          action={() => {console.log('do something')}}
          onSubmit={() => {
            console.log('submit')
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            {/* <FormInputText
              name="endpoint"
              control={control}
              label={t('endpointUrlGraphql')}
              type="text"
              required
              margin="normal"
            /> */}
            <FormInputText
              name="sdl"
              label={t('sdlUrlGraphql')}
              type="text"
              margin="normal"
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" textAlign="center" gutterBottom>
                {t('headersGraphql')}
              </Typography>
              <Button
              >
                {t('addHeadersGraphql')}
              </Button>
            </Box>
            
          </Box>
          <FormInputText
            name="query"
            label={t('queryGraphql')}
            type="text"
            margin="normal"
          />
          <FormInputText
            name="variables"
            label={t('variablesGraphql')}
            type="text"
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {t('sendRequestGraphql')}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default GraphqlForm;
