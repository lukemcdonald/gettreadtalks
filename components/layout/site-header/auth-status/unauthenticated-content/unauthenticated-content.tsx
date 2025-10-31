import Link from 'next/link';

import { Badge, Button } from '@/components/ui';

function UnauthenticatedContent() {
  return (
    <div className="inline-flex items-center gap-3">
      <Badge variant="warning">Not logged in</Badge>
      <Link href="/login">
        <Button variant="primary" size="sm">
          Login
        </Button>
      </Link>
    </div>
  );
}

export default UnauthenticatedContent;
