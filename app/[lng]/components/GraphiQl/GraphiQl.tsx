'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { buildClientSchema, GraphQLSchema } from 'graphql';
import { Typography, Box, useMediaQuery } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  useLazyGetGraphqlApiResponseQuery,
  useLazyGetGraphqlApiSdlQuery,
} from '@/lib/services/apiResponse';

import useGetAllSearchParams from '../../hooks/useGetAllSearchParams';
import EndpointUrlInput from '@/components/EndpointUrlInput/EndpointUrlInput';
import TextVariablesInput from '@/components/TextVariablesInput/TextVariablesInput';
import BodyInput from '@/components/BodyInput/BodyInput';
import ApiResponseViewer from '@/components/ApiResponseViewer/ApiResponseViewer';
import GraphqlQueryInput from './components/GraphqlQueryInput';
import SdlExplorer from './components/SdlExplorer';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import {
  isValidJsonString,
  parseGraphiQlUrl,
  removeLocaleFromUrl,
} from '@/app/utils';
import { parseGraphqlBody } from './utils';
import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';
import { locales } from '@/app/i18n/data/i18n.constants';
import { rtkQueryErrorSchema } from '@/app/model';

export function GraphiQl() {
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const { t, i18n } = useTranslation([Namespaces.CLIENTS, Namespaces.GRAPHQL]);
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
  const [sdlUrl, setSdlUrl] = useState<string>(
    parsedEndpointUrl ? `${parsedEndpointUrl}?sdl` : ''
  );
  const [headers, setHeaders] = useState<[string, string][]>(
    parsedHeaders ? Object.entries(parsedHeaders) : []
  );
  const [query, setQuery] = useState<string>(initialQuery);
  const [variables, setVariables] = useState<string>(initialVariables);

  const [schema, setSchema] = useState<GraphQLSchema | undefined>();

  const [getApiSdl, { data: sdl, isFetching: isSdlFetching, error: sdlError }] =
    useLazyGetGraphqlApiSdlQuery();
  const [getApiResponse, { data, isFetching, error }] =
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
        if (isValidJsonString(variables)) {
          body.variables = JSON.parse(variables);
        } else {
          body.variables = {};
        }
      }

      if (!endpointUrl) {
        newUrl += EMPTY_ENDPOINT_URL_SYMBOL;
      }

      newUrl += `/${window.btoa(encodeURI(JSON.stringify(body)))}`;
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

  useEffect(() => {
    if (sdl) {
      setSchema(buildClientSchema(sdl.data));
    }
  }, [sdl]);

  useEffect(() => {
    if (error) {
      const { data: rtkQueryError } = rtkQueryErrorSchema.safeParse(error);
      const errorMessage = rtkQueryError
        ? rtkQueryError.data.error
        : 'Unexpected error';
      const status = rtkQueryError ? rtkQueryError.status : 'Unknown status';
      const message = `${status}: ${errorMessage}`;

      toast.error(message);
    }
  }, [error]);

  useEffect(() => {
    if (sdlError) {
      const { data: rtkQueryError } = rtkQueryErrorSchema.safeParse(sdlError);
      const errorMessage = rtkQueryError
        ? rtkQueryError.data.error
        : 'Unexpected error';
      const status = rtkQueryError ? rtkQueryError.status : 'Unknown status';
      const message = `${status}: ${errorMessage}`;

      toast.error(message);
    }
  }, [sdlError]);

  return (
    <div className="flow">
      <Typography variant="h1">{t('graphiQl')}</Typography>

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
        <Typography>{t('queryPrompt')}</Typography>

        <Box display="flex" flexDirection={upSm ? 'row' : 'column'} gap={2}>
          <EndpointUrlInput
            endpointUrl={endpointUrl}
            onEndpointUrlChange={(newEndpointUrl) => {
              setEndpointUrl(newEndpointUrl);
              setSdlUrl(`${newEndpointUrl}?sdl`);
            }}
            textFieldProps={{
              fullWidth: true,
              disabled: isFetching,
              label: t('endpointUrlGraphql', { ns: Namespaces.GRAPHQL }),
            }}
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
              setSdlUrl(newSdlUrl);
            }}
            textFieldProps={{
              fullWidth: true,
              disabled: isFetching,
              label: t('sdlUrlGraphql', { ns: Namespaces.GRAPHQL }),
            }}
          />
          <LoadingButton
            variant="contained"
            color="primary"
            endIcon={<DownloadIcon />}
            loading={isSdlFetching}
            loadingPosition="end"
            sx={{ flexShrink: 0 }}
            onClick={async () => {
              await getApiSdl(sdlUrl).catch(() =>
                console.error('Failed to fetch data')
              );
            }}
          >
            Load
          </LoadingButton>
        </Box>

        <SdlExplorer schema={schema} />

        <TextVariablesInput
          title="headers"
          disabled={isFetching}
          variables={headers}
          onVariablesChange={(newHeaders) => {
            setHeaders(newHeaders);
          }}
        />

        <GraphqlQueryInput
          query={query}
          onQueryChange={setQuery}
          schema={schema}
        />

        <BodyInput
          body={variables}
          onBodyChange={setVariables}
          title={t('variablesGraphql', { ns: Namespaces.GRAPHQL })}
          prompt={t('variablesGraphqlPrompt', { ns: Namespaces.GRAPHQL })}
        />
      </form>
      <ApiResponseViewer response={data} loading={isFetching} />
      <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
        position="top-center"
        theme="colored"
      />
    </div>
  );
}
