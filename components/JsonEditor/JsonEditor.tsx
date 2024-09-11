import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { Diagnostic, linter } from '@codemirror/lint';
import { EditorView } from 'codemirror';

import { validateJson } from './utils';

import styles from './JsonEditor.module.css';

interface Props {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (event: React.FocusEvent) => void;
  lintSyntax?: boolean;
  readOnly?: boolean;
  height?: string;
  maxHeight?: string;
}

const JsonEditor: React.FC<Props> = ({
  value,
  onChange,
  onBlur,
  readOnly,
  lintSyntax,
  height,
  maxHeight,
}) => {
  const extensions: Extension[] = [json()];

  if (lintSyntax) {
    const jsonLinter = linter((view: EditorView): Diagnostic[] => {
      const doc: { toString: () => string } = view.state.doc;

      return validateJson(doc.toString());
    });

    extensions.push(jsonLinter);
  }

  return (
    <div data-disabled={readOnly} className={styles.editorContainer}>
      <CodeMirror
        className={styles.editor}
        value={value}
        height={height}
        maxHeight={maxHeight}
        extensions={extensions}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
      />
    </div>
  );
};

export default JsonEditor;
