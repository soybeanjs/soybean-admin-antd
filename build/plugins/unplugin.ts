import process from 'node:process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import type { PluginOption } from 'vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import svgLoader from 'vite-svg-loader';

export function setupUnplugin(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;

  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');

  /** The name of the local icon collection */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

  const plugins: PluginOption[] = [
    Icons({
      compiler: 'vue3',
      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, svg =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      scale: 1,
      defaultClass: 'inline-block'
    }),
    Components({
      dts: 'src/typings/components.d.ts',
      dtsTsx: false,
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        }),
        IconsResolver({ customCollections: [collectionName], componentPrefix: VITE_ICON_PREFIX })
      ]
    }),
    svgLoader({
      // Only ?component imports become Vue components; existing SVG URLs keep working.
      defaultImport: 'url',
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: { overrides: { removeViewBox: false } }
          },
          {
            name: 'prefixIds',
            params: {
              // Different files may use the same gradient, clip-path or filter IDs.
              prefix: (_node: unknown, info: { path?: string }) => {
                const relativePath = path.relative(localIconPath, info.path || '').split(path.sep).join('/');
                return `local-${createHash('sha256').update(relativePath).digest('hex').slice(0, 12)}`;
              }
            }
          },
          {
            name: 'scope-svg-instance-ids',
            fn: root => {
              const ids = new Set<string>();

              function collectIds(node: SvgAstNode) {
                if (node.type === 'element' && node.attributes?.id) ids.add(node.attributes.id);
                node.children?.forEach(collectIds);
              }

              collectIds(root);

              const scopedId = (id: string) => `($attrs['data-svg-id'] || 'svg') + '-' + ${JSON.stringify(id)}`;

              function bindReferences(value: string, pattern: RegExp, idGroup: number) {
                const parts: string[] = [];
                let offset = 0;

                for (const match of value.matchAll(pattern)) {
                  const id = match[idGroup];
                  if (!ids.has(id)) continue;
                  const start = match.index + match[0].indexOf(`#${id}`) + 1;
                  parts.push(JSON.stringify(value.slice(offset, start)), `(${scopedId(id)})`);
                  offset = start + id.length;
                }

                if (!parts.length) return undefined;
                parts.push(JSON.stringify(value.slice(offset)));
                return parts.join(' + ');
              }

              return {
                element: {
                  enter(node) {
                    for (const [name, value] of Object.entries(node.attributes)) {
                      let expression: string | undefined;

                      if (name === 'id') {
                        expression = scopedId(value);
                      } else if ((name === 'href' || name === 'xlink:href') && ids.has(value.slice(1))) {
                        if (value.startsWith('#')) expression = `'#' + (${scopedId(value.slice(1))})`;
                      } else {
                        expression = bindReferences(value, /url\(\s*(['"]?)#([^'"\s)]+)\1\s*\)/g, 2);
                      }

                      if (expression) {
                        node.attributes[`:${name}`] = expression;
                        delete node.attributes[name];
                      }
                    }

                    if (node.name === 'style') {
                      const css = node.children.map(child => ('value' in child ? child.value : '')).join('');
                      const expression = bindReferences(css, /#([A-Za-z_][\w-]*)/g, 1);
                      if (expression) {
                        node.attributes['v-text'] = expression;
                        node.children = [];
                      }
                    }
                  }
                }
              };
            }
          }
        ]
      }
    })
  ];

  return plugins;
}


interface SvgAstNode {
  type: string;
  attributes?: Record<string, string>;
  children?: SvgAstNode[];
}
