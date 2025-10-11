import { usePlugins } from '@bltx/plop';
import type { NodePlopAPI } from 'plop';

export default function (plop: NodePlopAPI) {
  usePlugins(plop);

  // REMOVE_ON_INIT
  plop.setGenerator('init', {
    description: 'initialize repository by rewriting key files',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'project name',
      },
    ],
    actions: [
      {
        type: 'modify',
        path: 'plopfile.ts',
        pattern: /\s+\/\/ REMOVE_ON_INIT.*REMOVE_ON_INIT/ms,
        template: '',
      },
      {
        type: 'modify',
        path: 'package.json',
        pattern: /"app"/,
        template: '"{{kebabCase name}}"',
      },
      {
        type: 'modify',
        path: 'package.json',
        pattern: /^\s+"init":.*\n/m,
        template: '',
      },
      {
        type: 'modify',
        path: 'apps/api/package.json',
        pattern: /"@app\/api"/,
        template: '"@{{kebabCase name}}/api"',
      },
      {
        type: 'modify',
        path: 'apps/web/package.json',
        pattern: /"@app\/api"/,
        template: '"@{{kebabCase name}}/api"',
      },
      {
        type: 'modify',
        path: 'apps/web/package.json',
        pattern: /"@app\/web"/,
        template: '"@{{kebabCase name}}/web"',
      },
      {
        type: 'modify',
        path: 'apps/web/index.html',
        pattern: /<title>App<\/title>/,
        template: '<title>{{titleCase name}}</title>',
      },
      {
        type: 'modify',
        path: 'README.md',
        pattern: /^.*$/s,
        template: '# {{kebabCase name}}\n',
      },
    ],
  });
  // REMOVE_ON_INIT
}
