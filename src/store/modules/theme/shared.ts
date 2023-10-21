import { theme as antdTheme } from 'ant-design-vue';
import type { ConfigProviderProps } from 'ant-design-vue';
import { getColorPalette } from '@sa/color-palette';
import { getRgbOfColor } from '@sa/utils';
import { themeVars } from '@/theme/vars';

const DARK_CLASS = 'dark';

/**
 * init theme settings
 * @param darkMode is dark mode
 */
export function initThemeSettings(colors: App.Theme.ThemeTokenColor) {
  const { primary: themeColor, info, success, warning, error } = colors;

  const themeSettings: App.Theme.ThemeSetting = {
    colorScheme: 'light',
    themeColor,
    otherColor: {
      info,
      success,
      warning,
      error
    }
  };

  return themeSettings;
}

/**
 * create theme token
 * @param darkMode is dark mode
 */
export function createThemeToken() {
  const themeTokens: App.Theme.ThemeToken = {
    colors: {
      ...createThemePaletteColors({
        primary: '#646cff',
        info: '#2080f0',
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d'
      }),
      container: 'rgba(255, 255, 255, 0.8)',
      layout: 'rgba(247, 250, 252, 1)',
      base_text: 'rgba(0, 0, 0, 0.88)'
    },
    boxShadow: {
      header: '0 1px 2px rgb(0, 21, 41, 0.08)',
      sider: '2px 0 8px 0 rgb(29, 35, 41, 0.05)',
      tab: '0 1px 2px rgb(0, 21, 41, 0.08)'
    }
  };

  const darkThemeTokens: App.Theme.ThemeToken = {
    colors: {
      ...themeTokens.colors,
      container: 'rgb(33, 33, 33)',
      layout: 'rgb(18, 18, 18)',
      base_text: 'rgba(255, 255, 255, 0.88)'
    },
    boxShadow: {
      ...themeTokens.boxShadow
    }
  };

  return {
    themeTokens,
    darkThemeTokens
  };
}

/**
 * create theme palette colors
 * @param colors theme colors
 */
function createThemePaletteColors(colors: Record<App.Theme.ThemeColorKey, string>) {
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[];
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor;

  colorKeys.forEach(key => {
    const { palettes, main } = getColorPalette(colors[key], key);

    colorPaletteVar[key] = main.hexcode;

    palettes.forEach(item => {
      colorPaletteVar[`${key}-${item.number}`] = item.hexcode;
    });
  });

  return colorPaletteVar;
}

/**
 * get css var by tokens
 * @param tokens theme base tokens
 */
function getCssVarByTokens(tokens: App.Theme.BaseToken) {
  const style: string[] = [];

  function removeVarPrefix(value: string) {
    return value.replace('var(', '').replace(')', '');
  }

  function removeRgbPrefix(value: string) {
    return value.replace('rgb(', '').replace(')', '');
  }

  for (const item of Object.entries(themeVars)) {
    const [tokenKey, vars] = item;

    for (const varsItem of Object.entries(vars)) {
      const [key, value] = varsItem;

      let varsKey = removeVarPrefix(value);
      let varsValue = tokens[tokenKey][key];

      if (tokenKey === 'colors') {
        varsKey = removeRgbPrefix(varsKey);
        const { r, g, b } = getRgbOfColor(varsValue);
        varsValue = `${r}, ${g}, ${b}`;
      }

      style.push(`${varsKey}: ${varsValue}`);
    }
  }

  const styleStr = style.join(';');

  return styleStr;
}

/**
 * add theme vars to html
 * @param tokens
 */
export function setupThemeVarsToHtml(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  const cssVarStr = getCssVarByTokens(tokens);
  const darkCssVarStr = getCssVarByTokens(darkTokens);

  const css = `
    html {
      ${cssVarStr}
    }
  `;

  const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVarStr}
    `;

  const style = document.createElement('style');

  style.innerText = css + darkCss;

  document.head.appendChild(style);
}

/**
 * toggle css dark mode
 * @param darkMode
 */
export function toggleCssDarkMode(darkMode = false) {
  function addDarkClass() {
    document.documentElement.classList.add(DARK_CLASS);
  }

  function removeDarkClass() {
    document.documentElement.classList.remove(DARK_CLASS);
  }

  if (darkMode) {
    addDarkClass();
  } else {
    removeDarkClass();
  }
}

/**
 * get antd theme
 */
export function getAntdTheme(themeColor: string, otherColor: App.Theme.OtherColor, isDark: boolean) {
  const { defaultAlgorithm, darkAlgorithm } = antdTheme;

  const { info, success, warning, error } = otherColor;

  const theme: ConfigProviderProps['theme'] = {
    token: {
      colorPrimary: themeColor,
      colorInfo: info,
      colorSuccess: success,
      colorWarning: warning,
      colorError: error
    },
    algorithm: [isDark ? darkAlgorithm : defaultAlgorithm]
  };

  return theme;
}
