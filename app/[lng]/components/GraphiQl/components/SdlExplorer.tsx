import { Stack, Typography } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { printSchema, GraphQLSchema } from 'graphql';
import { graphql } from 'cm6-graphql';
import { useTranslation } from 'react-i18next';

import { Namespaces } from '@/app/i18n/data/i18n.enum';

interface Props {
  schema?: GraphQLSchema;
}

const SdlExplorer: React.FC<Props> = ({ schema }) => {
  const { t } = useTranslation(Namespaces.GRAPHQL);

  const renderSchema = () => {
    if (!schema) {
      return <div>{t('sdlExplorerPrompt')}</div>;
    }

    return (
      <div
        style={{
          border: '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: '0.25rem',
          overflow: 'hidden',
        }}
        data-testid="sdl-explorer"
      >
        <CodeMirror
          readOnly
          value={printSchema(schema)}
          height="20rem"
          extensions={[graphql()]}
        />
      </div>
    );
  };

  return (
    <Stack spacing={2}>
      <Typography component="h2" variant="h5">
        {t('sdlExplorerTitle')}
      </Typography>
      {renderSchema()}
    </Stack>
  );
};

export default SdlExplorer;
