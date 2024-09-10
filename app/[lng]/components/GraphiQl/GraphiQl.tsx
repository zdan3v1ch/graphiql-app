'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { GraphQLSchema } from 'graphql';
import { Typography, Box, useMediaQuery } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';

import {
  useLazyGetGraphqlApiResponseQuery,
  // useLazyGetGraphqlApiSdlQuery,
} from '@/lib/services/apiResponse';

import useGetAllSearchParams from '../../hooks/useGetAllSearchParams';
import EndpointUrlInput from '@/components/EndpointUrlInput/EndpointUrlInput';
import TextVariablesInput from '@/components/TextVariablesInput/TextVariablesInput';
import BodyInput from '@/components/BodyInput/BodyInput';
import ApiResponseViewer from '@/components/ApiResponseViewer/ApiResponseViewer';

import { parseGraphiQlUrl, removeLocaleFromUrl } from '@/app/utils';
import { parseGraphqlBody } from './utils';
import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';
import { locales } from '@/app/i18n/data/i18n.constants';
import QueryEditor from '@/app/[lng]/components/GraphiQl/QueryEditor';

export function GraphiQl() {
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const delocalizedPathname = removeLocaleFromUrl(pathname, locales);
  const searchParamsString = useGetAllSearchParams();
  const clientUrl = `${delocalizedPathname}?${searchParamsString}`;

  const {
    endpointUrl: parsedEndpointUrl,
    headers: parsedHeaders,
    body: parsedBodyString,
  } = parseGraphiQlUrl(clientUrl.slice(1));

  let initialQuery = '';
  let initialVariables = '';

  if (parsedBodyString) {
    const bodyJson = parseGraphqlBody(parsedBodyString);
    initialQuery = bodyJson.query;
    initialVariables = bodyJson.variables;
  }

  const [endpointUrl, setEndpointUrl] = useState<string>(
    parsedEndpointUrl ?? ''
  );
  const [sdlUrl, setSdlUrl] = useState<string>(parsedEndpointUrl ?? '');
  const [headers, setHeaders] = useState<[string, string][]>(
    parsedHeaders ? Object.entries(parsedHeaders) : []
  );
  const [query, setQuery] = useState<string>(initialQuery);
  const [variables, setVariables] = useState<string>(initialVariables);

  const [schema] = useState<GraphQLSchema | undefined>();

  // const [getApiSdl, { data: sdl, isFetching: isSdlFetching }] =
  //   useLazyGetGraphqlApiSdlQuery();
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

    if (query || variables) {
      const body: { query?: string; variables?: unknown } = {};

      if (query) {
        body.query = query;
      }

      if (variables) {
        body.variables = JSON.parse(variables);
      }

      if (!endpointUrl) {
        newUrl += EMPTY_ENDPOINT_URL_SYMBOL;
      }

      newUrl += `/${window.btoa(JSON.stringify(body))}`;
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
  }, [endpointUrl, headers, pathname, i18n.language.length, query, variables]);

  return (
    <div className="flow">
      <form
        className="flow"
        onSubmit={async (event) => {
          event.preventDefault();

          const url = `${window.location.pathname}${window.location.search}`;
          const delocalizedUrl = removeLocaleFromUrl(url, locales);

          await getApiResponse(JSON.stringify(delocalizedUrl.slice(1))).catch(
            () => console.error('Failed to fetch data')
          );
        }}
      >
        <Typography>Set up your request to a GraphQL API</Typography>
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

        <Box display="flex" flexDirection={upSm ? 'row' : 'column'} gap={2}>
          <EndpointUrlInput
            endpointUrl={sdlUrl}
            onEndpointUrlChange={(newSdlUrl) => {
              setSdlUrl(
                newSdlUrl.endsWith('?sdl') ? newSdlUrl : `${newSdlUrl}?sdl`
              );
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

        <TextVariablesInput
          title="headers"
          disabled={isFetching}
          variables={headers}
          onVariablesChange={(newHeaders) => {
            setHeaders(newHeaders);
          }}
        />

        <QueryEditor query={query} onQueryChange={setQuery} schema={schema} />

        <BodyInput
          body={variables}
          onBodyChange={setVariables}
          namespace={false}
          variable={true}
        />
      </form>
      <ApiResponseViewer response={data} loading={isFetching} />
    </div>
  );
}
