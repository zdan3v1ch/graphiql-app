import { useEffect } from 'react';
import { HTTP_METHOD } from 'next/dist/server/web/http';

import { locales } from '@/app/i18n/data/i18n.constants';
import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';

function useUpdateUrl(
  method: HTTP_METHOD,
  endpointUrl: string,
  headers: [string, string][],
  pathname: string,
  i18nLanguageLength: number,
  bodyForUrl: string
) {
  useEffect(() => {
    const localePattern = locales.join('|');
    const regex = new RegExp(`^/(${localePattern})/(.*)`);

    // check if pathname starts with locale
    let newUrl = regex.test(pathname)
      ? pathname.slice(0, 1 + i18nLanguageLength + 1) // if yes then add locale and slashes after and before it to the new url
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
  }, [method, endpointUrl, headers, pathname, i18nLanguageLength, bodyForUrl]);
}

export default useUpdateUrl;
