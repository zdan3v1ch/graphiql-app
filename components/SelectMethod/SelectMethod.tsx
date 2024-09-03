'use client'

import { Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { useCallback } from "react";
import { RESTmethods } from "@/components/SelectMethod/selectMethod.constants"
import { useParams, usePathname, useRouter } from "next/navigation";

export function SelectMethod() {
  const router = useRouter();
  const params = useParams();
  const currentMethod = params.method[0];
  const currentPathname = usePathname();
  const handleOnChange = useCallback((event: SelectChangeEvent<string>) => {
    const newMethod = event.target.value;
    router.push(
      currentPathname.replace(`/${currentMethod}`, `/${newMethod}`)
    );
  },
  [currentMethod, currentPathname, router]);
  return (
    <Select
    onChange={handleOnChange}
    value={currentMethod}
    variant="outlined"
    sx={{ color: 'white', minWidth: 120 }}
  >
  {RESTmethods.map((method) => {
    return (<MenuItem key={method} value={method}>
      {method}
    </MenuItem>)
  })}
  </Select>
  )
}