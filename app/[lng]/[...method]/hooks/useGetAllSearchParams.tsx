'use client';

import { useSearchParams } from 'next/navigation';

function useGetAllSearchParams() {
  const searchParams = useSearchParams();
  const paramsArray: string[] = [];

  searchParams.forEach((value, key) => {
    paramsArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });

  return paramsArray.join('&');
}

export default useGetAllSearchParams;
