'use client';

import type { ReactNode } from 'react';
import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';
import type { ParsedSheetParam, SheetAction, SheetEntity } from './types';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CreateClipSheet, EditClipSheet } from '@/features/clips/components';
import { CreateCollectionSheet, EditCollectionSheet } from '@/features/collections/components';
import { CreateSpeakerSheet, EditSpeakerSheet } from '@/features/speakers/components';
import { CreateTalkSheet, EditTalkSheet } from '@/features/talks/components';
import { CreateTopicSheet, EditTopicSheet } from '@/features/topics/components';
import { getEntityForEdit, getFormOptions } from './queries';
import { parseSheetParam, useSheet } from './use-sheet';

interface FormOptions {
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'imageUrl' | 'role'>[];
  collections: Pick<Collection, '_id' | 'slug' | 'title'>[];
  talks: Pick<Talk, '_id' | 'title'>[];
}

type EntityData = Talk | Speaker | Clip | Collection | Topic | null;

interface SheetRendererProps {
  entity: SheetEntity;
  action: SheetAction;
  entityData: EntityData;
  formOptions: FormOptions | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function renderTalkSheet(props: SheetRendererProps): ReactNode {
  const { action, entityData, formOptions, isOpen, onOpenChange, onSuccess } = props;

  if (action === 'new') {
    return (
      <CreateTalkSheet
        collections={formOptions?.collections ?? []}
        onOpenChange={onOpenChange}
        onTalkCreated={onSuccess}
        open={isOpen}
        speakers={formOptions?.speakers ?? []}
      />
    );
  }

  if (entityData) {
    return (
      <EditTalkSheet
        collections={formOptions?.collections ?? []}
        onOpenChange={onOpenChange}
        onTalkUpdated={onSuccess}
        open={isOpen}
        speakers={formOptions?.speakers ?? []}
        talk={entityData as Talk}
      />
    );
  }

  return null;
}

function renderSpeakerSheet(props: SheetRendererProps): ReactNode {
  const { action, entityData, isOpen, onOpenChange, onSuccess } = props;

  if (action === 'new') {
    return (
      <CreateSpeakerSheet onOpenChange={onOpenChange} onSpeakerCreated={onSuccess} open={isOpen} />
    );
  }

  if (entityData) {
    return (
      <EditSpeakerSheet
        onOpenChange={onOpenChange}
        onSpeakerUpdated={onSuccess}
        open={isOpen}
        speaker={entityData as Speaker}
      />
    );
  }

  return null;
}

function renderClipSheet(props: SheetRendererProps): ReactNode {
  const { action, entityData, formOptions, isOpen, onOpenChange, onSuccess } = props;

  if (action === 'new') {
    return (
      <CreateClipSheet
        onClipCreated={onSuccess}
        onOpenChange={onOpenChange}
        open={isOpen}
        speakers={formOptions?.speakers ?? []}
        talks={formOptions?.talks ?? []}
      />
    );
  }

  if (entityData) {
    return (
      <EditClipSheet
        clip={entityData as Clip}
        onClipUpdated={onSuccess}
        onOpenChange={onOpenChange}
        open={isOpen}
        speakers={formOptions?.speakers ?? []}
        talks={formOptions?.talks ?? []}
      />
    );
  }

  return null;
}

function renderCollectionSheet(props: SheetRendererProps): ReactNode {
  const { action, entityData, isOpen, onOpenChange, onSuccess } = props;

  if (action === 'new') {
    return (
      <CreateCollectionSheet
        onCollectionCreated={onSuccess}
        onOpenChange={onOpenChange}
        open={isOpen}
      />
    );
  }

  if (entityData) {
    return (
      <EditCollectionSheet
        collection={entityData as Collection}
        onCollectionUpdated={onSuccess}
        onOpenChange={onOpenChange}
        open={isOpen}
      />
    );
  }

  return null;
}

function renderTopicSheet(props: SheetRendererProps): ReactNode {
  const { action, entityData, isOpen, onOpenChange, onSuccess } = props;

  if (action === 'new') {
    return (
      <CreateTopicSheet onOpenChange={onOpenChange} onTopicCreated={onSuccess} open={isOpen} />
    );
  }

  if (entityData) {
    return (
      <EditTopicSheet
        onOpenChange={onOpenChange}
        onTopicUpdated={onSuccess}
        open={isOpen}
        topic={entityData as Topic}
      />
    );
  }

  return null;
}

function renderSheet(props: SheetRendererProps): ReactNode {
  switch (props.entity) {
    case 'talk':
      return renderTalkSheet(props);
    case 'speaker':
      return renderSpeakerSheet(props);
    case 'clip':
      return renderClipSheet(props);
    case 'collection':
      return renderCollectionSheet(props);
    case 'topic':
      return renderTopicSheet(props);
    default:
      return null;
  }
}

function needsFormOptions(entity: string): boolean {
  return entity === 'talk' || entity === 'clip';
}

/** Renders nothing until data is fetched client-side to avoid hydration mismatches. */
export function SheetRouter() {
  const router = useRouter();
  const { sheetParam, sheetParamRaw, closeSheet } = useSheet();
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [entityData, setEntityData] = useState<EntityData>(null);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!sheetParamRaw) {
      setIsReady(false);
      setIsOpen(false);
      setEntityData(null);
      setFormOptions(null);
      return;
    }

    const parsed = parseSheetParam(sheetParamRaw);
    if (!parsed) {
      setIsReady(false);
      return;
    }

    let cancelled = false;

    async function loadSheetData(param: ParsedSheetParam) {
      try {
        const promises: Promise<unknown>[] = [];

        if (needsFormOptions(param.entity)) {
          promises.push(getFormOptions());
        } else {
          promises.push(Promise.resolve(null));
        }

        if (param.action === 'edit' && param.id) {
          promises.push(getEntityForEdit(param.entity, param.id));
        } else {
          promises.push(Promise.resolve(null));
        }

        const [options, entity] = await Promise.all(promises);

        if (cancelled) {
          return;
        }

        setFormOptions(options as FormOptions | null);
        setEntityData(entity as EntityData);
        setIsReady(true);
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to load sheet data:', error);
      }
    }

    loadSheetData(parsed);

    return () => {
      cancelled = true;
    };
  }, [sheetParamRaw]);

  if (!(sheetParam && isReady)) {
    return null;
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      closeSheet();
    }
  }

  function handleSuccess() {
    closeSheet();
    router.refresh();
  }

  return renderSheet({
    entity: sheetParam.entity,
    action: sheetParam.action,
    entityData,
    formOptions,
    isOpen,
    onOpenChange: handleOpenChange,
    onSuccess: handleSuccess,
  });
}
