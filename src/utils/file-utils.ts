import { Response } from 'express';
import * as path from 'path';

export function sendToHTML(res: Response, fileName: string) {
  return res.sendFile(path.join(__dirname, '..', '..', 'public', fileName));
}
