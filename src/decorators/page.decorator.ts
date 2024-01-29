import { Render, applyDecorators } from '@nestjs/common';

export function Page(pageName: string) {
  return applyDecorators(Render(`pages/${pageName}`));
}
