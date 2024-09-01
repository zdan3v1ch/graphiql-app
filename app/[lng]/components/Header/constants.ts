import ApiIcon from '@mui/icons-material/Api';
import WebhookIcon from '@mui/icons-material/Webhook';
import HistoryIcon from '@mui/icons-material/History';

export const protectedNavButtonParams = [
  {
    labelHeaderNsKey: 'navRestfulClient',
    url: '/restful',
    muiIcon: ApiIcon,
  },
  {
    labelHeaderNsKey: 'navGraphqlClient',
    url: '/graphql',
    muiIcon: WebhookIcon,
  },
  {
    labelHeaderNsKey: 'navHistory',
    url: '/history',
    muiIcon: HistoryIcon,
  },
];
