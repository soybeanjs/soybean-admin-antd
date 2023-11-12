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
    themeScheme: 'light',
    themeColor,
    otherColor: {
      info,
      success,
      warning,
      error
    },
    isCustomizeInfoColor: false,
    layout: {
      mode: 'vertical',
      scrollMode: 'content'
    },
    page: {
      animate: true
    },
    header: {
      height: 56,
      breadcrumb: {
        visible: true,
        showIcon: true
      }
    },
    tab: {
      visible: true,
      height: 44,
      mode: 'chrome'
    },
    fixedHeaderAndTab: true,
    sider: {
      inverted: false,
      width: 220,
      collapsedWidth: 64,
      mixWidth: 90,
      mixCollapsedWidth: 64,
      mixChildMenuWidth: 200
    },
    menu: {
      horizontalPosition: 'flex-start'
    },
    footer: {
      visible: true,
      fixed: false,
      height: 48,
      right: true
    }
  };

  return themeSettings;
}

/**
 * create theme token
 * @param darkMode is dark mode
 */
export function createThemeToken() {
  const paletteColors = createThemePaletteColors({
    primary: '#646cff',
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  });

  const themeTokens: App.Theme.ThemeToken = {
    colors: {
      ...paletteColors,
      nprogress: paletteColors.primary,
      container: 'rgb(255, 255, 255)',
      layout: 'rgb(247, 250, 252)',
      inverted: 'rgb(0, 20, 40)',
      base_text: 'rgb(31, 31, 31)'
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
      container: 'rgb(28, 28, 28)',
      layout: 'rgb(18, 18, 18)',
      base_text: 'rgb(224, 224, 224)'
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
  const styles: string[] = [];

  function removeVarPrefix(value: string) {
    return value.replace('var(', '').replace(')', '');
  }

  function removeRgbPrefix(value: string) {
    return value.replace('rgb(', '').replace(')', '');
  }

  for (const [key, tokenValues] of Object.entries(themeVars)) {
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
      let cssVarsKey = removeVarPrefix(tokenValue);
      let cssValue = tokens[key][tokenKey];

      if (key === 'colors') {
        cssVarsKey = removeRgbPrefix(cssVarsKey);
        const { r, g, b } = getRgbOfColor(cssValue);
        cssValue = `${r} ${g} ${b}`;
      }

      styles.push(`${cssVarsKey}: ${cssValue}`);
    }
  }

  const styleStr = styles.join(';');

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
