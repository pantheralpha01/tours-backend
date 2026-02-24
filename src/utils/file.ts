import fs from "fs";
import path from "path";

export const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const writeTempFile = (dir: string, filename: string, data: Buffer | string) => {
  ensureDir(dir);
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, data);
  return filepath;
};
