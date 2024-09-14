import { useEffect } from 'react';

import { locales } from '@/app/i18n/data/i18n.constants';
import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';
import { isValidJsonString } from '@/app/utils';

function useUpdateUrl(
  endpointUrl: string,
  headers: [string, string][],
  pathname: string,
  i18nLanguageLength: number,
  query: string,
  variables: string
) {
  useEffect(() => {
    const localePattern = locales.join('|');
    const regex = new RegExp(`^/(${localePattern})/(.*)`);

    // check if pathname starts with locale
    let newUrl = regex.test(pathname)
      ? pathname.slice(0, 1 + i18nLanguageLength + 1) // if yes then add locale and slashes after and before it to the new url
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
  }, [endpointUrl, headers, pathname, i18nLanguageLength, query, variables]);
}

export default useUpdateUrl;
