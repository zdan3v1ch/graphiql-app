'use client';

import { EMPTY_ENDPOINT } from '@/app/[lng]/[...method]/constants';
import { TextField } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useCallback, useState } from 'react';

export default function EndpointInput() {
  const router = useRouter();
  const params = useParams();
  const endpointInUrl = params.method[1];
  const oldEndpoint =
    !endpointInUrl || decodeURIComponent(endpointInUrl) === btoa(EMPTY_ENDPOINT)
      ? ''
      : decodeURIComponent(endpointInUrl);
  console.log(oldEndpoint);
  const [endpoint, setEndpoint] = useState(atob(oldEndpoint));
  const searchParams = useSearchParams();

  const handleOnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let newURL = '/';
      const newEndpoint =
        !event.target.value && params.method[2]
          ? EMPTY_ENDPOINT
          : event.target.value;
      newURL = newURL.concat(params.method[0], '/', btoa(newEndpoint));
      if (params.method[2]) {
        newURL = newURL.concat('/', decodeURIComponent(params.method[2]));
      }
      console.log(newURL);
      searchParams
        ? router.push(newURL.concat('?', searchParams.toString()))
        : router.push(newURL);
      setEndpoint(event.target.value);
    },
    [params, router, searchParams]
  );
  return (
    <TextField
      key="EndpointInput"
      placeholder={EMPTY_ENDPOINT}
      value={endpoint}
      variant="outlined"
      onChange={handleOnChange}
    />
  );
}
