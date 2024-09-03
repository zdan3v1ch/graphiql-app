'use client'

import { TextField } from "@mui/material";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";

export default function EndpointInput() {
  const router = useRouter();
  const params = useParams();
  const [endpoint, setEndpoint] = useState(params.method[1] ? atob(decodeURIComponent(params.method[1])) : '');
  const currentPathname = usePathname();
  const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newURL = event.target.value;
    if (endpoint) {
      router.push(
        currentPathname.replace(`/${params.method[1]}`, `/${btoa(newURL)}`)
      );
    } else {
      router.push(
        currentPathname.concat(`/${btoa(newURL)}`)
      );
    }
    setEndpoint(newURL);
  },
  [currentPathname, endpoint, params.method, router]);
  return (
  <TextField value={endpoint} variant="outlined" onChange={handleOnChange} />)
}