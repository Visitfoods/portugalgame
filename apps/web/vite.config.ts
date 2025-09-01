import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// Avoid strict TS type issues on CI while keeping HTTPS in local dev.
const makeServer = () => {
  const server: any = { host: true, port: 5173 };
  // Enable HTTPS only in dev environment
  if (process.env.VERCEL !== '1') server.https = true;
  return server;
};

export default defineConfig({
  plugins: [mkcert()],
  server: makeServer(),
  preview: { port: 5173 }
})
