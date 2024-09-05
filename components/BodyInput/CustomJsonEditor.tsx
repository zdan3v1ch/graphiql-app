import { useRef, useEffect } from 'react';
import { JSONEditor, JSONEditorPropsOptional } from 'vanilla-jsoneditor';

const CustomJsonEditor: React.FC<JSONEditorPropsOptional> = (props) => {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<JSONEditor | null>(null);

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current!,
      props: {},
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        void refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // update props
    if (refEditor.current) {
      void refEditor.current.updateProps(props);
    }
  }, [props]);

  return <div ref={refContainer} />;
};

export default CustomJsonEditor;
