import { initI18n } from '@/app/i18n/i18n';
import { namespaces } from '@/app/i18n/data/i18n.constants';
import { Params } from '@/app/i18n/data/i18n.interface';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from '@mui/material';
import NavButton from '@/components/NavButton';
import { Namespaces } from '../i18n/data/i18n.enum';
import { auth } from '@/auth';
import { protectedNavButtonParams } from '@/app/[lng]/components/Header/constants';
import { Grid } from '@mui/system';
import { developers } from './constants';

export default async function Main({ params }: { params: Params }) {
  const language = params.lng;
  const session = await auth();
  const { t } = await initI18n({ language, namespaces });
  const ns = Namespaces.HEADER;

  const renderGeneralInfo = () => {
    return (
      <>
        <div>
          <Typography
            component="h2"
            variant="h4"
            sx={{ padding: '20px', textAlign: 'center' }}
          >
            {t('devs')}
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
            {developers.map((dev, index) => (
              <Grid key={index}>
                <Card sx={{ maxWidth: 300 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={dev.image}
                    alt={`${dev.name}'s photo`}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {dev.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {t(dev.role)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(dev.bio)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Box>
        </div>
        <div>
          <Typography
            component="h2"
            variant="h4"
            sx={{ padding: '20px', textAlign: 'center' }}
          >
            {t('project')}
          </Typography>
          <Typography textAlign="center">{t('projectDesc')}</Typography>
        </div>
        <div>
          <Typography
            component="h2"
            variant="h4"
            sx={{ padding: '20px', textAlign: 'center' }}
          >
            {t('course')}
          </Typography>
          <Typography textAlign="center">{t('courseDesc')}</Typography>
        </div>
      </>
    );
  };

  if (!session) {
    return (
      <Container className="flow">
        <div>
          <Typography
            variant="h1"
            sx={{ padding: '20px', textAlign: 'center' }}
          >
            {t('title')}
          </Typography>
          <Box display="flex" gap="2rem" justifyContent="center">
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
        </div>
        {renderGeneralInfo()}
      </Container>
    );
  }

  return (
    <Container className="flow">
      <div>
        <Typography component="h1" variant="h3" textAlign="center">
          {t('authTitle')}&nbsp;{session.user?.name}!
        </Typography>
        <Box
          display="flex"
          gap="2rem"
          justifyContent="center"
          flexWrap="wrap"
          marginTop="1rem"
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
      </div>
      {renderGeneralInfo()}
    </Container>
  );
}
