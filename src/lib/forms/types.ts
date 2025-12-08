type FormOperation = 'creating' | 'updating' | 'archiving' | 'unarchiving' | 'deleting';

/**
 * Form operation status.
 * Tracks what operation the form is currently performing.
 */
export type FormStatus = 'idle' | FormOperation;
