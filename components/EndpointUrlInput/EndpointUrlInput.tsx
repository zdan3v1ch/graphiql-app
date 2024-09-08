'use client';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  endpointUrl: string;
  onEndpointUrlChange: (url: string) => void;
}

const EndpointUrlInput: React.FC<Props> = ({
  endpointUrl,
  onEndpointUrlChange,
}) => {
  const { t } = useTranslation(Namespaces.GRAPHQL);
  
  return (
    <TextField
      key="EndpointInput"
      label={t('endpointUrlGraphql')}
      value={endpointUrl}
      variant="outlined"
      onChange={(event) => {
        onEndpointUrlChange(event.target.value);
      }}
    />
  );
};

export default EndpointUrlInput;
