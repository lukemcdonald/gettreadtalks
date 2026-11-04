export const STUDY_TEMPLATE_HEADINGS = [
  'Main points',
  'Key passages',
  'Questions',
  'Next step',
] as const;

export const STUDY_TEMPLATE = `## Main points

### Point title
One or two sentences. Include plain-text references like Romans 8:28.

## Key passages

### Romans 8:28
One-line note on why this passage matters.

## Questions

- One personal question a group could also discuss.

## Next step

One short prompt toward obedience.`;

function escapeRegExp(value: string) {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

export function getMissingStudyTemplateHeadings(body: string): string[] {
  return STUDY_TEMPLATE_HEADINGS.filter(
    (heading) =>
      !new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, 'imu').test(body)
  );
}
