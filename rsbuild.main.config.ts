import { defineConfig } from '@rsbuild/core';
import path from 'path';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { getDefine, mode } from './build/utils';
import { version } from './package.json';

export default defineConfig({
  source: {
    define: {
      ...getDefine(),
      MAIN_VERSION: JSON.stringify(`${mode === 'dev' ? 'dev-' : ''}${version}`),
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@main': path.resolve(__dirname, './src/main'),
    },
  },
  tools: {
    rspack(config, { appendPlugins }) {
      const newConfig = { ...config };
      newConfig.resolve.extensions = [...newConfig.resolve.extensions, '.node'];
      if (process.env.RSDOCTOR) {
        appendPlugins(
          new RsdoctorRspackPlugin({
            disableClientServer: true,
            mode: 'brief',
            reportDir: './.rsdoctor/main',
          })
        );
      }
      return newConfig;
    },
  },
});
