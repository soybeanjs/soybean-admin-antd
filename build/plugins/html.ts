import type { Plugin } from 'vite';

export function setupHtmlPlugin(buildTime: string) {
  const plugin: Plugin = {
    name: 'html-plugin',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ buildTime }) });
    },
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>\n    <meta name="buildTime" content="${buildTime}">`);
    }
  };

  return plugin;
}
