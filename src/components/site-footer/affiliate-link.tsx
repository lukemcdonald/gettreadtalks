export function AffiliateLink() {
  return (
    <div className="relative">
      <a
        aria-label="Glory To The Holy One book by Jeff Lippincott & R.C. Sproul (affiliate link)"
        className="block"
        href="https://www.ligonier.org/store/glory-to-the-holy-one-hardcover"
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-teal-600 to-teal-800">
          {/* Decorative swirls/patterns background */}
          <div className="absolute inset-0 opacity-20">
            <div className="-left-4 -top-4 absolute size-32 rounded-full bg-white/30 blur-2xl" />
            <div className="-right-4 -bottom-4 absolute size-40 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute top-8 right-8 size-24 rounded-full bg-white/25 blur-xl" />
          </div>
          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-center p-4 text-center text-white">
            <p className="mb-3 font-medium text-xs">JEFF LIPPINCOTT & R.C. SPROUL</p>
            <p className="font-bold text-2xl italic leading-tight">Glory To The Holy One</p>
          </div>
          {/* Affiliate badge */}
          <div className="absolute right-2 bottom-2 rounded bg-foreground px-2 py-1 font-medium text-background text-xs">
            Affiliate
          </div>
        </div>
      </a>
    </div>
  );
}
