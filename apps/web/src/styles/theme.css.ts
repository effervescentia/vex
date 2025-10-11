import { themeContract } from '@bltx/web';
import { createTheme, createThemeContract } from '@vanilla-extract/css';

export const theme = {
  ...themeContract,
  ...createThemeContract({}),
};

export const themeClass = createTheme(theme, {
  space: {
    none: '0',
    small: '4px',
    medium: '8px',
    large: '16px',
  },
});
