import JsonView from 'react18-json-view';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco as htmlViewerStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CircularProgress } from '@mui/material';

import { DataApiResponse } from '@/app/model';

interface Props {
  response?: DataApiResponse;
  loading?: boolean;
}

const ApiResponseViewer: React.FC<Props> = ({ response, loading }) => {
  if (loading) {
    return <CircularProgress />;
  }

  if (!response) {
    return <div>Send your first request to see the response</div>;
  }

  const renderResponseBody = () => {
    if (typeof response.data === 'string') {
      return (
        <SyntaxHighlighter
          language="xml"
          style={htmlViewerStyle}
          customStyle={{ backgroundColor: 'transparent' }}
        >
          {response.data}
        </SyntaxHighlighter>
      );
    }

    return (
      <JsonView
        src={response.data}
        enableClipboard={false}
        displayArrayIndex={false}
        displaySize
      />
    );
  };

  return (
    <div>
      <div>Status: {response.status}</div>
      {renderResponseBody()}
    </div>
  );
};

export default ApiResponseViewer;
