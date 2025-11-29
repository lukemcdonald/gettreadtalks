import betterAuth from './betterAuth/convex.config';
import resend from '@convex-dev/resend/convex.config';
import { defineApp } from 'convex/server';

const app = defineApp();

app.use(betterAuth);
app.use(resend);

export default app;
