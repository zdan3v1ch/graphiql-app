import ApiIcon from '@mui/icons-material/Api';
import WebhookIcon from '@mui/icons-material/Webhook';
import HistoryIcon from '@mui/icons-material/History';

export const protectedNavButtonParams = [
  {
    labelHeaderNsKey: 'navRestfulClient',
    url: '/GET',
    muiIcon: ApiIcon,
  },
  {
    labelHeaderNsKey: 'navGraphqlClient',
    url: '/GRAPHQL',
    muiIcon: WebhookIcon,
  },
  {
    labelHeaderNsKey: 'navHistory',
    url: '/requests-history',
    muiIcon: HistoryIcon,
  },
];
