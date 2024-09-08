import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco as htmlViewerStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import JsonEditor from '@/components/JsonEditor/JsonEditor';
import { Mode } from 'vanilla-jsoneditor';
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { DataApiResponse } from '@/app/model';
import { getResponseStatusColor } from '@/components/ApiResponseViewer/utils';

interface Props {
  response?: DataApiResponse;
  loading?: boolean;
}

const ApiResponseViewer: React.FC<Props> = ({ response, loading }) => {
  const renderResponseSection = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      );
    }

    if (!response) {
      return <div>Send your first request to see the response</div>;
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
          mode={Mode.text}
          content={{ json: data }}
          readOnly
          mainMenuBar={false}
        />
      );
    };

    return (
      <Paper variant="outlined">
        <Stack>
          <Box display="flex" justifyContent="space-between" paddingInline={1}>
            <div>Body:</div>
            <Box color={getResponseStatusColor(status)}>
              Status: {response.status}
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
        API Response
      </Typography>
      {renderResponseSection()}
    </Stack>
  );
};

export default ApiResponseViewer;
