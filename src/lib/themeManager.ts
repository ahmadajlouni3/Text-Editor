export type Theme = 'light' | 'dark' | 'sepia' | 'high-contrast';

export class ThemeManager {
  private static readonly THEME_KEY = 'textEditor_theme';

  static getTheme(): Theme {
    return (localStorage.getItem(this.THEME_KEY) as Theme) || 'light';
  }

  static setTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  static applyTheme(theme: Theme): void {
    const root = document.documentElement;
    // Remove all existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-sepia', 'theme-high-contrast');
    // Add the new theme class
    root.classList.add(`theme-${theme}`);
    
    // Also set data attribute for better CSS targeting
    root.setAttribute('data-theme', theme);
  }

  static initializeTheme(): void {
    this.applyTheme(this.getTheme());
  }
}
