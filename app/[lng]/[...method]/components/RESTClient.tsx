import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { HTTP_METHOD } from 'next/dist/server/web/http';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';

import { useLazyGetRestfulApiResponseQuery } from '@/lib/services/apiResponse';

import useGetAllSearchParams from '../hooks/useGetAllSearchParams';
import HttpMethodSelector from '@/components/HttpMethodSelector/HttpMethodSelector';
import EndpointUrlInput from '@/components/EndpointUrlInput/EndpointUrlInput';
import HeadersInput from '@/components/HeadersInput/HeadersInput';
import BodyInput from '@/components/BodyInput/BodyInput';
import ApiResponseViewer from '@/components/ApiResponseViewer/ApiResponseViewer';

import { parseRestfulClientUrl, removeLocaleFromUrl } from '@/app/utils';
import { validateRequestData, variableSubstitute } from './utils';
import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';
import { locales } from '@/app/i18n/data/i18n.constants';

export function RESTClient() {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const delocalizedPathname = removeLocaleFromUrl(pathname, locales);
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

  const [getApiResponse, { data, isFetching }] =
    useLazyGetRestfulApiResponseQuery();

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
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const url = `${window.location.pathname}${window.location.search}`;
          const delocalizedUrl = removeLocaleFromUrl(url, locales);

          await getApiResponse(JSON.stringify(delocalizedUrl)).catch(() =>
            console.error('Failed to fetch data')
          );
        }}
      >
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
            textFieldProps={{ fullWidth: true }}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            loading={isFetching}
            loadingPosition="end"
            sx={{ flexShrink: 0 }}
          >
            Send
          </LoadingButton>
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
      </form>
      <ApiResponseViewer response={data} loading={isFetching} />
    </div>
  );
}
