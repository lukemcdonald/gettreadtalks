import AuthStatus from "@/components/layout/site-header/auth-status";
import Link from "next/link";

function SiteHeader() {
  return (
    <header className="text-center mb-12 sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <h1 className="text-2xl">
        <Link href="/">
          <span className="text-red-600 font-extrabold">TREAD</span>
          <span className="text-black font-medium">Talks</span>
        </Link>
      </h1>
      <AuthStatus />
    </header>
  );
}

export default SiteHeader;
