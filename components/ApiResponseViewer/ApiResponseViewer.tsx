import SyntaxHighlighter from 'react-syntax-highlighter';
import { useTranslation } from 'react-i18next';
import { docco as htmlViewerStyle } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { DataApiResponse } from '@/app/model';
import { getResponseStatusColor } from './utils';

import JsonEditor from '@/components/JsonEditor/JsonEditor';

interface Props {
  response?: DataApiResponse;
  loading?: boolean;
}

const ApiResponseViewer: React.FC<Props> = ({ response, loading }) => {
  const { t } = useTranslation(Namespaces.CLIENTS);

  const renderResponseSection = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      );
    }

    if (!response) {
      return <div>{t('emptyResponse')}</div>;
    }

    const { status, data } = response;
    const renderResponseBody = () => {
      if (typeof data === 'string') {
        return (
          <SyntaxHighlighter
            language="xml"
            style={htmlViewerStyle}
            customStyle={{ backgroundColor: 'transparent', fontSize: '14px' }}
          >
            {data}
          </SyntaxHighlighter>
        );
      }

      return (
        <JsonEditor
          value={JSON.stringify(data, null, 2)}
          maxHeight="75vh"
          readOnly
        />
      );
    };

    return (
      <Paper variant="outlined">
        <Stack>
          <Box display="flex" justifyContent="space-between" paddingInline={1}>
            <div>{t('responseBody')}:</div>
            <Box color={getResponseStatusColor(status)}>
              {t('status')}: {response.status}
            </Box>
          </Box>
          <Divider />
          <Box sx={{ maxHeight: '90vh', overflowY: 'auto' }}>
            {renderResponseBody()}
          </Box>
        </Stack>
      </Paper>
    );
  };

  return (
    <Stack spacing={2}>
      <Typography component="h2" variant="h5">
        {t('response')}
      </Typography>
      {renderResponseSection()}
    </Stack>
  );
};

export default ApiResponseViewer;
