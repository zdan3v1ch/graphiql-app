import { useEffect, useRef, useState } from 'react';
import { basicSetup, EditorView } from 'codemirror';
import { GraphQLSchema } from 'graphql';
import { graphql } from 'cm6-graphql';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

interface Props {
  query: string;
  onQueryChange: (query: string) => void;
  schema?: GraphQLSchema;
}

const QueryEditor: React.FC<Props> = ({ query, onQueryChange, schema }) => {
  const editorRef = useRef(null);
  const [doc, setDoc] = useState(query);
  const [isVisible, setIsVisible] = useState<boolean>(!!query);

  useEffect(() => {
    const viewInstance = new EditorView({
      doc: query,
      extensions: [
        basicSetup,
        graphql(schema),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const doc: { toString: () => string } = update.state.doc;
            const value = doc.toString();

            setDoc(value);
          }
        }),
      ],
      parent: editorRef.current as unknown as Element,
    });

    return () => {
      viewInstance.destroy();
    };
  }, [schema, query]);

  return (
    <Stack spacing={2}>
      <Box display="flex" gap={1} alignItems="center">
        <Typography component="h2" variant="h5">
          GraphQL query
        </Typography>
        <IconButton
          onClick={() => {
            setIsVisible((isVisible) => !isVisible);
          }}
        >
          {isVisible ? <ArrowDropUp /> : <ArrowDropDown />}
        </IconButton>
      </Box>
      <div
        ref={editorRef}
        onBlur={() => {
          onQueryChange(doc);
        }}
        style={{
          display: isVisible ? 'block' : 'none',
          height: '400px',
          border: '1px solid',
          borderRadius: '0.25rem',
          overflow: 'hidden',
          overflowY: 'auto',
          fontSize: '14px',
        }}
      />
    </Stack>
  );
};

export default QueryEditor;
