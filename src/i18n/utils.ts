import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    // path is usually something like "/", "/about", "/gallery"
    const cleanedPath = path.replace(/^\//, ''); // remove leading slash
    
    // Handle root path
    if (cleanedPath === '') {
      return `/${l}/`;
    }
    
    // For other paths, we simply prefix with the language
    // e.g., "/about" -> "/es/about"
    return `/${l}/${cleanedPath}`;
  }
}

export function getRouteWithoutLang(url: URL) {
  const pathname = url.pathname;
  return pathname.replace(/^\/(es|en)/, '') || '/';
}
