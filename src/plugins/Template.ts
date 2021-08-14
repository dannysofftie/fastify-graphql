import * as ejs from 'ejs';
import { readFileSync } from 'fs';
import { minify } from 'html-minifier';
import { join } from 'path';

interface ITemplatePaths {
  template: 'create-account' | 'reset-password' | '404-page';
}

const rootPath = join(__dirname, '..', '..', 'templates/');

const templates = {
  'create-account': 'emails/accounts/new-account.ejs',
  'reset-password': 'emails/accounts/password-reset.ejs',
  '404-page': '404.ejs',
};

export interface ICompileTemplate {
  /**
   * Compile .ejs file, specified path and data
   *
   * @memberof ITemplate
   */
  compileEjs: (template: ITemplatePaths) => (data?: any) => string;
}

export const compileEjs = (template: ITemplatePaths): ((data: any) => string) => {
  const text = readFileSync(rootPath + templates[template.template], 'utf-8');

  const fn = (data: any) => {
    const html = ejs.compile(text)({ ...data, rootPath });

    return minify(html, { collapseWhitespace: true });
  };

  return fn;
};
