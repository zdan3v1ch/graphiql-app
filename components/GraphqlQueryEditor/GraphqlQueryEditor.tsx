import CodeMirror from '@uiw/react-codemirror';
import { GraphQLSchema } from 'graphql';
import { graphql } from 'cm6-graphql';

import styles from './GraphqlQueryEditor.module.css';
import { useEffect, useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  changeValueOnBlur?: boolean;
  schema?: GraphQLSchema;
  height?: string;
  maxHeight?: string;
}

const JsonEditor: React.FC<Props> = ({
  value,
  onChange,
  changeValueOnBlur,
  schema,
  height,
  maxHeight,
}) => {
  const [editorValue, setEditorValue] = useState<string>(value);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [schema]);

  return (
    <div className={styles.editorContainer}>
      <CodeMirror
        key={key}
        className={styles.editor}
        value={value}
        height={height}
        maxHeight={maxHeight}
        extensions={[graphql(schema)]}
        onChange={(value) => {
          changeValueOnBlur ? setEditorValue(value) : onChange(value);
        }}
        onBlur={() => {
          changeValueOnBlur && onChange(editorValue);
        }}
      />
    </div>
  );
};

export default JsonEditor;
