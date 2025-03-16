import { defineConfig } from '@rsbuild/core';
import path from 'path';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { getDefine } from './build/utils';

export default defineConfig({
  source: {
    define: getDefine(),
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@preload': path.resolve(__dirname, './src/preload'),
    },
  },
  tools: {
    rspack(config, { appendPlugins }) {
      if (process.env.RSDOCTOR) {
        appendPlugins(
          new RsdoctorRspackPlugin({
            disableClientServer: true,
            mode: 'brief',
            reportDir: './.rsdoctor/preload',
          })
        );
      }
    },
  },
});
