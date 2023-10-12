import { getColorPaletteFamily } from './palette';
import { getColorName } from './name';
import type { ColorPalette, ColorPaletteNumber, ColorPaletteItem, ColorPaletteFamily } from './type';
import defaultPalettes from './json/palette.json';

/**
 * get color palette by provided color and color name
 * @param color the provided color
 * @param colorName color name
 */
export function getColorPalette(color: string, colorName: string) {
  const colorPaletteFamily = getColorPaletteFamily(color, colorName);

  const colorMap = new Map<ColorPaletteNumber, ColorPaletteItem>();

  colorPaletteFamily.palettes.forEach(palette => {
    colorMap.set(palette.number, palette);
  });

  const mainColor = colorMap.get(500) as ColorPaletteItem;
  const matchColor = colorPaletteFamily.palettes.find(palette => palette.hexcode === color) as ColorPaletteItem;

  const colorPalette: ColorPalette = {
    ...colorPaletteFamily,
    colorMap,
    main: mainColor,
    match: matchColor
  };

  return colorPalette;
}

export default getColorPalette;

/**
 * the builtin color palettes
 */
const colorPalettes = defaultPalettes as ColorPaletteFamily[];

export { getColorName, colorPalettes };

export type { ColorPalette, ColorPaletteNumber, ColorPaletteItem, ColorPaletteFamily };
