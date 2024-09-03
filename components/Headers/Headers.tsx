'use client'

import { Namespaces } from "@/app/i18n/data/i18n.enum";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface IHeaders {
  key: string;
  value: string;
}

export default function Headers() {
  const [headers, setHeaders] = useState<IHeaders[]>([]);
  const { t } = useTranslation(Namespaces.CLIENTS);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )
  const handleOnClick = useCallback(() => {
    setHeaders((headers) => {
      headers.push({key:'', value: ''});
      return headers});
  } ,[]);
  const handleOnChange = useCallback((index: number, property: keyof IHeaders ) =>(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>  {
    setHeaders((headers) => {
      headers[index][property]=event.target.value;
      return headers});
    
    router.push(pathname + '?' + createQueryString(headers[index].key, event.target.value))
  },[createQueryString, headers, pathname, router]);

  return (
      <Stack direction="row" spacing={2}>
        <Typography>{t('headers')}</Typography>
        <Button onClick={handleOnClick}>{t('add')}</Button>
        {headers.map((header, index)=>
        <Stack key={`${header.key}+${index}`} direction="row" spacing={2}>
          <TextField value={header.key} variant="outlined" onChange={handleOnChange(index, "key")} />
          <TextField value={header.value} variant="outlined" onChange={handleOnChange(index, "value")} />
        </Stack>
      )}
      </Stack>
  )
}