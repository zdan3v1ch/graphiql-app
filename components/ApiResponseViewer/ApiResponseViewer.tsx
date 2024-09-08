import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco as htmlViewerStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import JsonEditor from '@/components/JsonEditor/JsonEditor';
import { Mode } from 'vanilla-jsoneditor';
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
      <JsonEditor
        mode={Mode.text}
        content={{ json: response.data }}
        readOnly
        mainMenuBar={false}
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
