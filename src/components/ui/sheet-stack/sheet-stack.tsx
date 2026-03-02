'use client';

import type { ReactNode } from 'react';

import { createContext, useEffect, useState } from 'react';

export interface SheetLayer {
  id: string;
  onClose: () => void;
}

export interface SheetStackContextValue {
  layers: SheetLayer[];
  register: (layer: SheetLayer) => void;
  unregister: (id: string) => void;
}

export const SheetStackContext = createContext<SheetStackContextValue | null>(null);

const TRANSITION = 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)';

export function SheetStack({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<SheetLayer[]>([]);

  function register(layer: SheetLayer) {
    setLayers((prev) => [...prev, layer]);
  }

  function unregister(id: string) {
    setLayers((prev) => {
      const index = prev.findIndex((l) => l.id === id);
      if (index === -1) {
        return prev;
      }

      const layersAbove = prev.slice(index + 1);
      for (const layer of layersAbove) {
        layer.onClose();
      }

      return prev.slice(0, index);
    });
  }

  useEffect(() => {
    const tracked: HTMLElement[] = [];

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const marker = document.querySelector(`[data-sheet-layer-id="${layer.id}"]`);
      const viewport = marker?.closest('[data-slot="sheet-viewport"]') as HTMLElement | null;
      const backdrop = viewport?.previousElementSibling as HTMLElement | null;
      const depthFromTop = layers.length - 1 - i;

      if (viewport) {
        tracked.push(viewport);

        if (depthFromTop > 0) {
          viewport.style.transition = TRANSITION;
          viewport.style.transform = `scale(${1 - depthFromTop * 0.03}) translateX(-${depthFromTop * 16}px)`;
          viewport.style.transformOrigin = 'right center';
          viewport.style.pointerEvents = 'none';
        } else {
          viewport.style.transition = TRANSITION;
          viewport.style.transform = '';
          viewport.style.transformOrigin = '';
          viewport.style.pointerEvents = '';
        }
      }

      if (backdrop && depthFromTop > 0) {
        tracked.push(backdrop);
        backdrop.style.opacity = '0';
        backdrop.style.pointerEvents = 'none';
      }
    }

    return () => {
      for (const el of tracked) {
        el.style.transition = '';
        el.style.transform = '';
        el.style.transformOrigin = '';
        el.style.pointerEvents = '';
        el.style.opacity = '';
      }
    };
  }, [layers]);

  return <SheetStackContext value={{ layers, register, unregister }}>{children}</SheetStackContext>;
}
