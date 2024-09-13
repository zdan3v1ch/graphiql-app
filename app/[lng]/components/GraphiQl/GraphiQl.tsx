'use client';

import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { buildClientSchema, GraphQLSchema } from 'graphql';
import { Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import { ToastContainer, toast } from 'react-toastify';

import {
  useLazyGetGraphqlApiResponseQuery,
  useLazyGetGraphqlApiSdlQuery,
} from '@/lib/services/apiResponse';
import { Store } from '@/lib/localStorage/localStorage';

import useClientInitialParams from '../../hooks/useClientInitialParams';
import useUpdateUrl from './hooks/useUpdateUrl';
import EndpointUrlInput from '@/components/EndpointUrlInput/EndpointUrlInput';
import TextVariablesInput from '@/components/TextVariablesInput/TextVariablesInput';
import BodyInput from '@/components/BodyInput/BodyInput';
import ApiResponseViewer from '@/components/ApiResponseViewer/ApiResponseViewer';
import GraphqlQueryInput from './components/GraphqlQueryInput';
import SdlExplorer from './components/SdlExplorer';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { parseGraphiQlUrl, removeLocaleFromUrl } from '@/app/utils';
import { parseGraphqlBody } from './utils';
import { locales } from '@/app/i18n/data/i18n.constants';
import { rtkQueryErrorSchema } from '@/app/model';

export function GraphiQl({ session }: { session: Session | null }) {
  const [getApiSdl, { data: sdl, isFetching: isSdlFetching, error: sdlError }] =
    useLazyGetGraphqlApiSdlQuery();
  const [getApiResponse, { data, isFetching, error }] =
    useLazyGetGraphqlApiResponseQuery();
  const { upSm, t, i18n, pathname, clientUrl } = useClientInitialParams([
    Namespaces.CLIENTS,
    Namespaces.GRAPHQL,
  ]);

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
    initialVariables = JSON.stringify(bodyJson.variables);
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

  useUpdateUrl(
    endpointUrl,
    headers,
    pathname,
    i18n.language.length,
    query,
    variables
  );

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

          Store.addRequest(delocalizedUrl, session?.user?.email);
          try {
            await getApiResponse(JSON.stringify(delocalizedUrl.slice(1)));
          } catch (error) {
            console.error('Failed to fetch data');
          }
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
            {t('send')}
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
              try {
                await getApiSdl(sdlUrl);
              } catch (error) {
                console.error('Failed to fetch data');
              }
            }}
          >
            {t('load')}
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
        data-testid="toast-container"
      />
    </div>
  );
}
