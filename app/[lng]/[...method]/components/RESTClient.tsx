import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { HTTP_METHOD } from 'next/dist/server/web/http';
import { FormControl, Stack } from '@mui/material';

import HttpMethodSelector from '@/components/HttpMethodSelector/HttpMethodSelector';
import EndpointUrlInput from '@/components/EndpointUrlInput/EndpointUrlInput';
import HeadersInput from '@/components/HeadersInput/HeadersInput';
import BodyInput from '@/components/BodyInput/BodyInput';

import { locales } from '@/app/i18n/data/i18n.constants';
import { parseRestfulClientUrl, removeLocaleFromPath } from '@/app/utils';
import { validateRequestData } from './utils';
import useGetAllSearchParams from '../hooks/useGetAllSearchParams';

export function RESTClient() {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const delocalizedPathname = removeLocaleFromPath(pathname, locales);
  const searchParamsString = useGetAllSearchParams();
  const clientUrl = `${delocalizedPathname}?${searchParamsString}`;

  const requestData = parseRestfulClientUrl(clientUrl);

  const {
    validParsedMethod,
    validParsedEndpointUrl,
    validParsedHeaders,
    validParsedBody,
  } = validateRequestData(requestData);

  const [method, setMethod] = useState<HTTP_METHOD>(validParsedMethod ?? 'GET');
  const [endpointUrl, setEndpointUrl] = useState<string>(
    validParsedEndpointUrl ?? ''
  );
  const [headers, setHeaders] = useState<[string, string][]>(
    validParsedHeaders ? Object.entries(validParsedHeaders) : []
  );
  const [body, setBody] = useState<string>(validParsedBody ?? '');

  useEffect(() => {
    const localePattern = locales.join('|');
    const regex = new RegExp(`^/(${localePattern})/(.*)`);

    // check if pathname starts with locale
    let newUrl = regex.test(pathname)
      ? pathname.slice(0, 1 + i18n.language.length + 1) // if yes then add locale and slashes after and before it to the new url
      : '/';
    newUrl += method;

    if (endpointUrl) {
      newUrl += `/${window.btoa(endpointUrl)}`;
    } else {
      newUrl += '/';
    }

    if (body) {
      newUrl += `/${window.btoa(body)}`;
    }

    if (headers.length) {
      newUrl += '?';

      headers.forEach(([key, value], index) => {
        if (index > 0) {
          newUrl += '&';
        }

        newUrl += `${key}=${encodeURIComponent(value)}`;
      });
    }

    history.pushState(null, '', newUrl);
  }, [method, body, endpointUrl, headers, pathname, i18n.language.length]);

  return (
    <FormControl size="small">
      <Stack direction="row" spacing={2}>
        <HttpMethodSelector
          method={method}
          onMethodChange={(newMethod) => {
            setMethod(newMethod);
          }}
        />
        <EndpointUrlInput
          endpointUrl={endpointUrl}
          onEndpointUrlChange={(newEndpointUrl) => {
            setEndpointUrl(newEndpointUrl);
          }}
        />
      </Stack>
      <HeadersInput
        headers={headers}
        onHeadersChange={(newHeaders) => {
          setHeaders(newHeaders);
        }}
      />
      <BodyInput
        body={body}
        onBodyChange={(newBody) => {
          setBody(newBody);
        }}
      />
    </FormControl>
  );
}
