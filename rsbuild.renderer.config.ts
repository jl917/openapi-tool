import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'path';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { getDefine, mode } from './build/utils';
import { version } from './package.json';

export default defineConfig(() => {
  return {
    html: {
      template: './index.html',
    },
    server: {
      publicDir: {
        name: './src/renderer/public',
      },
    },
    source: {
      entry: {
        index: 'src/renderer/index.tsx',
      },
      define: {
        ...getDefine(),
        WEB_VERSION: JSON.stringify(
          `${mode === 'dev' ? 'dev-' : ''}${version}`
        ),
      },
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@renderer': path.resolve(__dirname, './src/renderer'),
      },
    },
    plugins: [pluginReact()],
    tools: {
      rspack(config, { appendPlugins }) {
        if (process.env.RSDOCTOR) {
          appendPlugins(
            new RsdoctorRspackPlugin({
              disableClientServer: true,
              mode: 'brief',
              reportDir: './.rsdoctor/renderer',
            })
          );
        }
      },
    },
  };
});
