// src/lib/accessibility/themeUtils.js

export const saveTheme = (theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
};

export const loadTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'light';
  }
  return 'light';
};

export const saveContrast = (contrast) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('contrast', contrast);
  }
};

export const loadContrast = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('contrast') || 'normal';
  }
  return 'normal';
};

export const saveFontSize = (size) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('font-size', size);
  }
};

export const loadFontSize = () => {
  if (typeof window !== 'undefined') {
    return parseFloat(localStorage.getItem('font-size')) || 1;
  }
  return 1;
};
