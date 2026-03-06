'use client';

import { useContext, useEffect, useId, useRef } from 'react';

import { SheetStackContext } from './sheet-stack';

export function useSheetLayer(open: boolean, onClose: () => void) {
  const context = useContext(SheetStackContext);
  const contextRef = useRef(context);
  const onCloseRef = useRef(onClose);
  const id = useId();

  contextRef.current = context;
  onCloseRef.current = onClose;

  useEffect(() => {
    const ctx = contextRef.current;

    if (!(ctx && open)) {
      return;
    }

    ctx.register({
      id,
      onClose: () => onCloseRef.current(),
    });

    return () => {
      ctx.unregister(id);
    };
  }, [id, open]);

  return { id };
}
