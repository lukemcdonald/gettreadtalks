export function logAnalytics(action: string, payload?: unknown) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  if (payload === undefined) {
    console.log(`[analytics]: ${action}`);

    return;
  }

  console.log(`[analytics]: ${action}`, payload);
}
