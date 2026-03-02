'use client';

import { useContext, useEffect, useId, useRef } from 'react';

import { SheetStackContext } from './sheet-stack';

export function useSheetLayer(open: boolean, onClose: () => void) {
  const context = useContext(SheetStackContext);
  const id = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!(context && open)) {
      return;
    }

    context.register({ id, onClose: () => onCloseRef.current() });

    return () => {
      context.unregister(id);
    };
  }, [context, id, open]);

  return { id };
}
