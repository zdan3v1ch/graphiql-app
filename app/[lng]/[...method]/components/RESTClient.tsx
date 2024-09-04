import BodyInput from '@/components/BodyInput/BodyInput';
import EndpointInput from '@/components/EndpointInput/EndpointInput';
import Headers from '@/components/Headers/Headers';
import { SelectMethod } from '@/components/SelectMethod/SelectMethod';
import { FormControl, Stack } from '@mui/material';

export function RESTClient() {
  return (
    <FormControl size="small">
      <Stack direction="row" spacing={2}>
        <SelectMethod />
        <EndpointInput />
      </Stack>
      <Headers />
      <BodyInput />
    </FormControl>
  );
}
