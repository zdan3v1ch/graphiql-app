import { initI18n } from '@/app/i18n/i18n';
import { namespaces } from '@/app/i18n/data/i18n.constants';
import { Params } from '@/app/i18n/data/i18n.interface';
import { Box, Container, Typography } from '@mui/material';
import NavButton from '@/components/NavButton';
import { Namespaces } from '../i18n/data/i18n.enum';
import { auth } from '@/auth';
import { protectedNavButtonParams } from '@/app/[lng]/components/Header/constants';

export default async function Main({ params }: { params: Params }) {
  const language = params.lng;
  const session = await auth();
  const { t } = await initI18n({ language, namespaces });
  const ns = Namespaces.HEADER;

  if (!session) {
    return (
      <Container>
        <Typography variant="h1" sx={{ padding: '20px', textAlign: 'center' }}>
          {t('title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          <NavButton
            label={t('signIn', { ns })}
            url="/signin"
            buttonProps={{
              variant: 'contained',
              color: 'primary',
              sx: { color: 'white' },
            }}
          />
          <NavButton
            label={t('signUp', { ns })}
            url="/register"
            buttonProps={{ variant: 'contained', color: 'secondary' }}
          />
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h1" sx={{ padding: '20px', textAlign: 'center' }}>
        {t('authTitle')}&nbsp;{session.user?.name}!
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '2rem',
          marginTop: '2rem',
        }}
      >
        {protectedNavButtonParams.map((navButton) => (
          <NavButton
            key={`${navButton.labelHeaderNsKey}${navButton.url}`}
            label={t(navButton.labelHeaderNsKey, { ns })}
            url={navButton.url}
            buttonProps={{
              variant: 'contained',
              color: 'primary',
              sx: { color: 'white' },
            }}
          />
        ))}
      </Box>
    </Container>
  );
}
