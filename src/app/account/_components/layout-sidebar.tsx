import Image from 'next/image';
import Link from 'next/link';

const mockUser = {
  image: 'https://avatars.githubusercontent.com/u/299173',
  name: 'Luke McDonald',
  email: 'thelukemcdonald@gmail.com',
};

export function LayoutSidebar() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <figure>
          <Image
            alt={mockUser.name}
            className="shrink-0 rounded-full"
            height={100}
            src={mockUser.image}
            width={48}
          />
        </figure>
        <p className="flex flex-col truncate">
          <span className="text-muted-foreground text-xs">Signed in as</span>
          <span className="font-semibold text-foreground text-sm">{mockUser.email}</span>
        </p>
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/account">Settings</Link>
        <Link href="/account/favorites">Favorites</Link>
        <Link href="/account/finished">Finished</Link>
      </nav>
    </div>
  );
}
