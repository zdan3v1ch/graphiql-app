import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { HTTP_METHOD } from 'next/dist/server/web/http';
import { FormControl, Stack } from '@mui/material';

import useGetAllSearchParams from '../hooks/useGetAllSearchParams';
import HttpMethodSelector from '@/components/HttpMethodSelector/HttpMethodSelector';
import EndpointUrlInput from '@/components/EndpointUrlInput/EndpointUrlInput';
import HeadersInput from '@/components/HeadersInput/HeadersInput';
import BodyInput from '@/components/BodyInput/BodyInput';

import { parseRestfulClientUrl, removeLocaleFromPath } from '@/app/utils';
import { validateRequestData, variableSubstitute } from './utils';
import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';
import { locales } from '@/app/i18n/data/i18n.constants';

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
  const [variables, setVariables] = useState<[string, string][]>([]);
  const [bodyForUrl, setBodyForUrl] = useState<string>(validParsedBody ?? '');
  const [bodyForInput, setBodyForInput] = useState<string>(
    validParsedBody ?? ''
  );

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

    if (bodyForUrl) {
      if (!endpointUrl) {
        newUrl += EMPTY_ENDPOINT_URL_SYMBOL;
      }

      newUrl += `/${window.btoa(bodyForUrl)}`;
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
  }, [
    method,
    endpointUrl,
    headers,
    pathname,
    i18n.language.length,
    bodyForUrl,
  ]);

  const onBodyChange = (newBody: string) => {
    setBodyForInput(newBody);
    setBodyForUrl(variableSubstitute(newBody, variables));
  };
  const onVariablesChange = (newVariables: [string, string][]) => {
    setVariables(newVariables);
    setBodyForUrl(variableSubstitute(bodyForInput, variables));
  };

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
        title="headers"
        headers={headers}
        onHeadersChange={(newHeaders) => {
          setHeaders(newHeaders);
        }}
      />
      <BodyInput body={bodyForInput} onBodyChange={onBodyChange} />
      <HeadersInput
        title="variables"
        headers={variables}
        onHeadersChange={onVariablesChange}
      />
    </FormControl>
  );
}
