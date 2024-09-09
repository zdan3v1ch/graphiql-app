'use client';

import { useTranslation } from 'react-i18next';
import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { usePathname } from 'next/navigation';
import { parseGraphqlClientUrl, removeLocaleFromUrl } from '@/app/utils';
import { locales } from '@/app/i18n/data/i18n.constants';
import useGetAllSearchParams from '../../[...method]/hooks/useGetAllSearchParams';
import { validateRequestGraphqlData } from '../../[...method]/components/utils';
import { useEffect, useState } from 'react';
import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';
import EndpointUrlInput from '@/components/EndpointUrlInput/EndpointUrlInput';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import TextVariablesInput from '@/components/TextVariablesInput/TextVariablesInput';
import BodyInput from '@/components/BodyInput/BodyInput';
import ApiResponseViewer from '@/components/ApiResponseViewer/ApiResponseViewer';
import { useLazyGetGraphqlApiResponseQuery } from '@/lib/services/apiResponse';


export function GraphQl() {
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const delocalizedPathname = removeLocaleFromUrl(pathname, locales);
  const searchParamsString = useGetAllSearchParams();
  const clientUrl = `${delocalizedPathname}?${searchParamsString}`;

  const requestData = parseGraphqlClientUrl(clientUrl);
  const {
    validParsedEndpointUrl,
    validParsedHeaders,
    // validParsedBody,
  } = validateRequestGraphqlData(requestData);



  const [endpointUrl, setEndpointUrl] = useState<string>(
    validParsedEndpointUrl ?? ''
  );

  const [sdlUrl, setSdlUrl] = useState<string>(
    validParsedEndpointUrl ?? ''
  );

  const [headers, setHeaders] = useState<[string, string][]>(
    validParsedHeaders ? Object.entries(validParsedHeaders) : []
  );
  const [query, setQuery] = useState<string>('');
  const [variables, setVariables] = useState<string>('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bodyForUrl = {
    query,
    variables
  }


  const [getApiResponse, { data, isFetching }] =
    useLazyGetGraphqlApiResponseQuery();

  useEffect(() => {
    const localePattern = locales.join('|');
    const regex = new RegExp(`^/(${localePattern})/(.*)`);

    // check if pathname starts with locale
    let newUrl = regex.test(pathname)
      ? pathname.slice(0, 1 + i18n.language.length + 1) // if yes then add locale and slashes after and before it to the new url
      : '/';

    newUrl += 'GRAPHQL/';

    if (endpointUrl) {
      newUrl += `${window.btoa(endpointUrl)}`;
    }

    if (bodyForUrl) {
      if (!endpointUrl) {
        newUrl += EMPTY_ENDPOINT_URL_SYMBOL;
      }

      newUrl += `/${window.btoa(JSON.stringify(bodyForUrl))}`;
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
    endpointUrl,
    headers,
    pathname,
    i18n.language.length,
    bodyForUrl,
  ]);


  return (
    <div className="flow">
      <form
        className="flow"
        onSubmit={async (event) => {
          event.preventDefault();

          const url = `${window.location.pathname}${window.location.search}`;
          const delocalizedUrl = removeLocaleFromUrl(url, locales);

          await getApiResponse(JSON.stringify(delocalizedUrl)).catch(() =>
            console.error('Failed to fetch data')
          );
        }}
      >
        <Typography>Set up your request to a restful API</Typography>
        <Box display="flex" flexDirection={upSm ? 'row' : 'column'} gap={2}>
          <EndpointUrlInput
            endpointUrl={endpointUrl}
            onEndpointUrlChange={(newEndpointUrl) => {
              setEndpointUrl(newEndpointUrl);
              setSdlUrl(`${newEndpointUrl}?sdl`);
            }}
            textFieldProps={{ fullWidth: true, disabled: isFetching }}
          />
          <LoadingButton
            type="button"
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            loading={isFetching}
            loadingPosition="end"
            sx={{ flexShrink: 0 }}
          >
            Send
          </LoadingButton>
        </Box>

        <Box display="flex" flexDirection={upSm ? 'row' : 'column'} gap={2}>
          <EndpointUrlInput
            endpointUrl={sdlUrl}
            onEndpointUrlChange={(newSdlUrl) => {
              setSdlUrl(newSdlUrl.endsWith('?sdl') ? newSdlUrl : `${newSdlUrl}?sdl`);
            }}
            textFieldProps={{ fullWidth: true, disabled: isFetching }}
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
        </Box>

        <TextVariablesInput
          title="headers"
          disabled={isFetching}
          variables={headers}
          onVariablesChange={(newHeaders) => {
            setHeaders(newHeaders);
          }}
        />
        <BodyInput body={query} onBodyChange={setQuery} namespace={false} />
        <BodyInput body={variables} onBodyChange={setVariables} namespace={false} variable={true} />
      </form>
      <ApiResponseViewer response={data} loading={isFetching} />
    </div>
  );
}
