import { useRef, useEffect } from 'react';
import { JSONEditor, JSONEditorPropsOptional } from 'vanilla-jsoneditor';

const CustomJsonEditor: React.FC<JSONEditorPropsOptional> = (props) => {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    if (!refContainer.current) return;
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {},
    });

    return () => {
      if (refEditor.current) {
        void refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (refEditor.current) {
      void refEditor.current.updateProps(props);
    }
  }, [props]);

  return <div ref={refContainer} />;
};

export default CustomJsonEditor;
