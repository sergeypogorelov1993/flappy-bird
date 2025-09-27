import { defineConfig } from 'vite';

const repoBasePath = '/flappy-bird/';

export default defineConfig(() => ({
  base: process.env.GITHUB_PAGES === 'true' ? repoBasePath : '/',
  test: {
    globals: true,
    environment: 'jsdom'
  }
}));
