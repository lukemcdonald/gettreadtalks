export function getClientIp(request: Request) {
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

  if (!ip) {
    console.warn(
      '[client-ip] Could not determine client IP, using anonymous key'
    );

    return 'anonymous';
  }

  return ip;
}
