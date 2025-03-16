import { dialog } from 'electron';
import path from 'path';
import fs from 'fs';

export const sendFile = async () => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
  });

  if (filePaths.length === 0) return null;
  console.log(filePaths)
  const filePath = filePaths[0];
  const fileData = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  // 파일 이름과 Base64 인코딩된 데이터 전송
  return { fileName, fileData: fileData.toString('base64') };
};
