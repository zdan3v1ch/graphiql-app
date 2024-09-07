'use client';

import { TextField } from '@mui/material';

interface Props {
  endpointUrl: string;
  onEndpointUrlChange: (url: string) => void;
}

const EndpointUrlInput: React.FC<Props> = ({
  endpointUrl,
  onEndpointUrlChange,
}) => {
  return (
    <TextField
      key="EndpointInput"
      value={endpointUrl}
      variant="outlined"
      onChange={(event) => {
        onEndpointUrlChange(event.target.value);
      }}
    />
  );
};

export default EndpointUrlInput;
