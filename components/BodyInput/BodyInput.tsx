'use client';

import { useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

import JsonEditor from '@/components/JsonEditor/JsonEditor';

interface Props {
  body: string;
  onBodyChange: (body: string) => void;
  title: string;
  prompt?: string;
}

const BodyInput: React.FC<Props> = ({ body, onBodyChange, title, prompt }) => {
  const [isVisible, setIsVisible] = useState<boolean>(!!body);
  const [bodyValue, setBodyValue] = useState<string>(body);

  return (
    <Stack spacing={2}>
      <Box display="flex" gap={1} alignItems="center">
        <Typography component="h2" variant="h5">
          {title}
        </Typography>
        <IconButton
          onClick={() => {
            setIsVisible((isVisible) => !isVisible);
          }}
        >
          {isVisible ? <ArrowDropUp /> : <ArrowDropDown />}
        </IconButton>
      </Box>
      {isVisible && (
        <>
          {!!prompt && <Typography>{prompt}</Typography>}
          <JsonEditor
            value={body}
            onChange={setBodyValue}
            onBlur={() => onBodyChange(bodyValue)}
            lintSyntax
            height="20rem"
          />
        </>
      )}
    </Stack>
  );
};

export default BodyInput;
