import { app, dialog } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import { nanoid } from 'nanoid'
import yaml from 'js-yaml';
import { pushStore } from './store';
import openapiTS, { astToString } from "openapi-typescript";

interface OpenAPI {
  info: {
    title: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const sendFile = async () => {
  const nid = nanoid();
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'OpenAPI Files', extensions: ['yaml', 'yml', 'json'] }
    ]
  });

  if (filePaths.length === 0) return null;

  const filePath = filePaths[0];
  const fileData = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const fileExtension = path.extname(filePath).toLowerCase();
  const tmpPath = path.resolve(app.getPath('userData'), 'openapiTemp');
  const sourcePath = path.resolve(tmpPath, `${nid}.json`);
  const targetPath = path.resolve(tmpPath, `${nid}.d.ts`);

  let parsedData: any;
  try {
    if (fileExtension === '.json') {
      parsedData = JSON.parse(fileData.toString());
    } else if (fileExtension === '.yaml' || fileExtension === '.yml') {
      parsedData = yaml.load(fileData.toString()) as OpenAPI;
    } else {
      throw new Error('Unsupported file format');
    }
    await fs.ensureDir(tmpPath);
    fs.writeJsonSync(sourcePath, parsedData);

    const ast = await openapiTS(parsedData);
    const contents = astToString(ast);

    fs.writeJsonSync(targetPath, contents);

    const name = parsedData?.info?.title || nid;
    pushStore({
      id: name,
    })
    return {
      name,
    };
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error('Failed to parse OpenAPI specification');
  }
};
