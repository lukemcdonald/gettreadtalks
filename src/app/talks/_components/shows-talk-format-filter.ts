import { parseTalkFormat } from '@/convex/model/talks/validators';

export function showsTalkFormatFilter(args: {
  format?: string | null;
  visible: boolean;
}) {
  return args.visible || parseTalkFormat(args.format) !== undefined;
}
