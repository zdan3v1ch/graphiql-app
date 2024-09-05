'use client';

import { HTTP_METHOD, HTTP_METHODS } from 'next/dist/server/web/http';
import { Select, MenuItem } from '@mui/material';

interface Props {
  method: HTTP_METHOD;
  onMethodChange: (method: HTTP_METHOD) => void;
}

const HttpMethodSelector: React.FC<Props> = ({ method, onMethodChange }) => {
  return (
    <Select
      onChange={(event) => {
        onMethodChange(event.target.value as HTTP_METHOD);
      }}
      value={method}
      variant="outlined"
      sx={{ minWidth: 240 }}
    >
      {HTTP_METHODS.map((method) => {
        return (
          <MenuItem key={method} value={method}>
            {method}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default HttpMethodSelector;
