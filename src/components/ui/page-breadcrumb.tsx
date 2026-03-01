import { Link } from '@/components/ui/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/primitives/breadcrumb';

interface BreadcrumbSegment {
  href?: string;
  label: string;
}

interface PageBreadcrumbProps {
  segments: (BreadcrumbSegment | false | null | undefined)[];
}

/**
 * Renders a breadcrumb trail from a flat list of segments.
 * The last segment is always rendered as the current page.
 * Falsy entries are filtered out, supporting conditional segments.
 */
export function PageBreadcrumb({ segments }: PageBreadcrumbProps) {
  const resolved = segments.filter((segment): segment is BreadcrumbSegment => !!segment);

  if (resolved.length === 0) {
    return null;
  }

  const [current, ...ancestors] = [...resolved].reverse();
  const links = ancestors.reverse();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.flatMap((segment) => [
          <BreadcrumbItem key={segment.href ?? segment.label}>
            {segment.href ? (
              <BreadcrumbLink render={<Link href={segment.href} />}>{segment.label}</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{segment.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>,
          <BreadcrumbSeparator key={`sep-${segment.href ?? segment.label}`} />,
        ])}

        <BreadcrumbItem>
          <BreadcrumbPage>{current.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
