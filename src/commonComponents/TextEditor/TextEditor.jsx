import React, { useRef, useMemo, useCallback } from 'react';
import JoditEditor, { Jodit } from 'jodit-react';

const TextEditor = ({ text, onChange }) => {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    toolbar: true,
    toolbarSticky: false,
    toolbarAdaptive: false,
    buttons: [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'eraser',
      '|',
      'ul',
      'ol',
      '|',
      'font',
      'fontsize',
      'brush',
      '|',
      'align',
      'undo',
      'redo',
    ],
    removeButtons: ['file', 'video'],
    defaultFont: 'Arial',
    defaultFontSizePoints: '14',
    controls: {
    fontsize: {
      list: Jodit.atom(['8px','10px', '12px', '14px', '16px', '18px', '20px', '24px', '36px','40px'])
    }
  },
    style: {
      fontFamily: 'Arial',
      color: '#333333',
      maxHeight:350
    },
  }), []);

  const handleChange = useCallback((newContent) => {
    onChange(newContent);
  }, [onChange]);

  return (
    <JoditEditor
      ref={editor}
      value={text}
      onChange={handleChange}
      config={config}
    />
  );
};

export default TextEditor;
