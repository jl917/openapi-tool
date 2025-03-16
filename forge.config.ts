import { utils } from '@electron-forge/core';
import * as os from 'os';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { RsbuildPlugin } from './plugins/electron-forge-plugin-rsbuild';
import MakerDMG from './plugins/maker-dmg';
import { productName, name } from './package.json';

const isMac = os.platform() === 'darwin';
const isPublish = process.argv[1].endsWith('publish.js');
const mode = process.env.MODE;

const config: ForgeConfig = {
  // buildIdentifier: mode,
  packagerConfig: {
    name,
    executableName: productName,
    asar: true,
    appBundleId: utils.fromBuildIdentifier({
      dev: 'io.github.jl917.dev',
      beta: 'io.github.jl917.beta',
      production: 'io.github.jl917',
    }) as any,
    icon: isMac
      ? `src/renderer/public/${productName}.ico`
      : `src/renderer/public/${productName}.icns'`,
  },
  rebuildConfig: {},
  makers: [
    new MakerDMG({ icon: `src/renderer/public/${productName}.icns` } as any),
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: `https://jl917eapp-beta.netlify.app/${productName}.ico`,
        setupIcon: `src/renderer/public/${productName}.ico`,
      },
    },
  ],
  publishers:
    isPublish && mode === 'dev'
      ? []
      : [
          {
            name: '@electron-forge/publisher-github',
            config: {
              authToken: process.env.GH_TOKEN,
              repository: {
                owner: 'jl917',
                name: productName,
              },
              prerelease: true,
            },
          },
        ],
  plugins: [
    ...(isPublish
      ? [
          {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
          },
        ]
      : []),
    new RsbuildPlugin({
      build: [
        {
          entry: 'src/main/main.ts',
          config: 'rsbuild.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/preload.ts',
          config: 'rsbuild.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'rsbuild.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
