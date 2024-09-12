'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { HTTP_METHOD } from 'next/dist/server/web/http';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import { Session } from 'next-auth';
import { toast, ToastContainer } from 'react-toastify';

import { useLazyGetRestfulApiResponseQuery } from '@/lib/services/apiResponse';

import useGetAllSearchParams from '@/app/[lng]/hooks/useGetAllSearchParams';
import HttpMethodSelector from '@/components/HttpMethodSelector/HttpMethodSelector';
import EndpointUrlInput from '@/components/EndpointUrlInput/EndpointUrlInput';
import TextVariablesInput from '@/components/TextVariablesInput/TextVariablesInput';
import BodyInput from '@/components/BodyInput/BodyInput';
import ApiResponseViewer from '@/components/ApiResponseViewer/ApiResponseViewer';

import { parseRestfulClientUrl, removeLocaleFromUrl } from '@/app/utils';
import { validateRequestData, variableSubstitute } from './utils';
import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';
import { locales } from '@/app/i18n/data/i18n.constants';
import { Store } from '@/lib/localStorage/localStorage';
import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { rtkQueryErrorSchema } from '@/app/model';

export function RestClient({ session }: { session: Session | null }) {
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const { t, i18n } = useTranslation(Namespaces.CLIENTS);
  const pathname = usePathname();
  const delocalizedPathname = removeLocaleFromUrl(pathname, locales);
  const searchParamsString = useGetAllSearchParams();
  const clientUrl = `${delocalizedPathname}?${searchParamsString}`;

  const requestData = parseRestfulClientUrl(clientUrl.slice(1));

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

  const [getApiResponse, { data, isFetching, error }] =
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
      newUrl += `/${window.btoa(encodeURI(endpointUrl))}`;
    } else {
      newUrl += '/';
    }

    if (bodyForUrl) {
      if (!endpointUrl) {
        newUrl += EMPTY_ENDPOINT_URL_SYMBOL;
      }

      newUrl += `/${window.btoa(encodeURI(bodyForUrl))}`;
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

  return (
    <div className="flow">
      <Typography variant="h1">{t('restClient')}</Typography>

      <form
        className="flow"
        onSubmit={async (event) => {
          event.preventDefault();

          const url = `${window.location.pathname}${window.location.search}`;
          const delocalizedUrl = removeLocaleFromUrl(url, locales);
          Store.addRequest(delocalizedUrl, session?.user?.email);
          await getApiResponse(JSON.stringify(delocalizedUrl.slice(1))).catch(
            () => console.error(t('responseError'))
          );
        }}
      >
        <div>{t('requestPrompt')}</div>
        <Box display="flex" flexDirection={upSm ? 'row' : 'column'} gap={2}>
          <HttpMethodSelector
            method={method}
            onMethodChange={(newMethod) => {
              setMethod(newMethod);
            }}
            selectProps={{ disabled: isFetching }}
          />
          <EndpointUrlInput
            endpointUrl={endpointUrl}
            onEndpointUrlChange={(newEndpointUrl) => {
              setEndpointUrl(newEndpointUrl);
            }}
            textFieldProps={{
              fullWidth: true,
              disabled: isFetching,
              label: t('endpointUrlLabel'),
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
        <TextVariablesInput
          title="headers"
          disabled={isFetching}
          variables={headers}
          onVariablesChange={(newHeaders) => {
            setHeaders(newHeaders);
          }}
        />
        <BodyInput
          body={bodyForInput}
          onBodyChange={onBodyChange}
          title={t('body')}
          prompt={t('bodyPrompt')}
        />
        <TextVariablesInput
          title="variables"
          disabled={isFetching}
          variables={variables}
          onVariablesChange={onVariablesChange}
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
