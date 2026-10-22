import type { ComponentProps } from 'react';

import { IntentLink } from './intent-link';

function FauxLink({
  children,
  ...delegated
}: ComponentProps<typeof IntentLink>) {
  return (
    <IntentLink {...delegated}>
      <span className="absolute inset-0" />
      {children}
    </IntentLink>
  );
}

export { FauxLink };
