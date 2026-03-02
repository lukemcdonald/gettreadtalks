'use client';

import { useContext } from 'react';

import { SheetStackContext } from './sheet-stack';

export function useSheetStack() {
  return useContext(SheetStackContext);
}
