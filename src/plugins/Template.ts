import * as ejs from 'ejs';
import { readFileSync } from 'fs';
import { minify } from 'html-minifier';
import { join } from 'path';

interface ITemplatePaths {
    template: 'create-account' | 'reset-password';
}

const rootPath = join(__dirname, '..', '..', 'templates/');

const templates = {
    'create-account': 'emails/accounts/new-account.ejs',
    'reset-password': 'emails/accounts/password-reset.ejs',
};

export interface ICompileTemplate {
    /**
     * Compile .ejs file, specified path and data
     *
     * @memberof ITemplate
     */
    compileEjs: (template: ITemplatePaths) => (data?: unknown) => string;
}

export const compileEjs = (template: ITemplatePaths): ((data: unknown) => string) => {
    const text = readFileSync(rootPath + templates[template.template], 'utf-8');

    const fn = (data: unknown) => {
        const html = ejs.compile(text)(data);

        return minify(html, { collapseWhitespace: true });
    };

    return fn;
};
