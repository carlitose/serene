interface ParsedUrl {
  path: string;
  host: string;
  fullUrl: string;
}

export function parseUrl(url: string): ParsedUrl {
  try {
    const urlObj = new URL(url);
    return {
      path: urlObj.pathname,
      host: urlObj.host,
      fullUrl: url,
    };
  } catch {
    return {
      path: url,
      host: '',
      fullUrl: url,
    };
  }
}

export function isInstagramUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.host.includes('instagram.com');
  } catch {
    return false;
  }
}
