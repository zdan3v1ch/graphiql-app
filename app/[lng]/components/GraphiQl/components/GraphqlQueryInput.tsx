'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { GraphQLSchema } from 'graphql';

import { Namespaces } from '@/app/i18n/data/i18n.enum';

import GraphqlQueryEditor from '@/components/GraphqlQueryEditor/GraphqlQueryEditor';

interface Props {
  query: string;
  onQueryChange: (query: string) => void;
  schema?: GraphQLSchema;
}

const GraphqlQueryInput: React.FC<Props> = ({
  query,
  onQueryChange,
  schema,
}) => {
  const { t } = useTranslation(Namespaces.GRAPHQL);
  const [isVisible, setIsVisible] = useState<boolean>(!!query);

  return (
    <Stack spacing={2}>
      <Box display="flex" gap={1} alignItems="center">
        <Typography component="h2" variant="h5">
          {t('queryGraphql')}
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
        <GraphqlQueryEditor
          value={query}
          onChange={onQueryChange}
          changeValueOnBlur
          schema={schema}
          height="350px"
        />
      )}
    </Stack>
  );
};

export default GraphqlQueryInput;
