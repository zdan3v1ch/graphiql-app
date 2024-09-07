'use client';

import { TextField, TextFieldProps } from '@mui/material';

interface Props {
  endpointUrl: string;
  onEndpointUrlChange: (url: string) => void;
  textFieldProps?: TextFieldProps;
}

const EndpointUrlInput: React.FC<Props> = ({
  endpointUrl,
  onEndpointUrlChange,
  textFieldProps,
}) => {
  return (
    <TextField
      key="EndpointInput"
      value={endpointUrl}
      variant="outlined"
      onChange={(event) => {
        onEndpointUrlChange(event.target.value);
      }}
      {...textFieldProps}
    />
  );
};

export default EndpointUrlInput;
