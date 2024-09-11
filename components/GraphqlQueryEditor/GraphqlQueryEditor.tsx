import CodeMirror from '@uiw/react-codemirror';
import { GraphQLSchema } from 'graphql';
import { graphql } from 'cm6-graphql';

import styles from './GraphqlQueryEditor.module.css';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  schema?: GraphQLSchema;
  onBlur?: (event: React.FocusEvent) => void;
  height?: string;
  maxHeight?: string;
}

const JsonEditor: React.FC<Props> = ({
  value,
  onChange,
  schema,
  onBlur,
  height,
  maxHeight,
}) => {
  return (
    <div className={styles.editorContainer}>
      <CodeMirror
        className={styles.editor}
        value={value}
        height={height}
        maxHeight={maxHeight}
        extensions={[graphql(schema)]}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default JsonEditor;
