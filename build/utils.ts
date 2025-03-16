import { loadEnv } from '@rsbuild/core';

export const mode = process.env.MODE;

export const getDefine = () => {
  const { publicVars, rawPublicVars } = loadEnv({
    prefixes: ['RSBUILD_'],
    mode,
  });

  return {
    ...rawPublicVars,
    ...publicVars,
  };
};
