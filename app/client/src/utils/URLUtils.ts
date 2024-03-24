export function convertObjectToQueryParams(object: Record<string, any>): string {
  if (!!object) {
    const paramArray: string[] = Object.entries(object).map(([key, value]) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    });
    return `?${paramArray.join('&')}`;
  } else {
    return '';
  }
}
