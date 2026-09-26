import { uiPages, type UiPage } from './uiPages';

export function buildUrl(page: UiPage, params?: Record<string, string>): string {
    const path = uiPages[page];
    if (!params || Object.keys(params).length === 0) {
        return path;
    }

    const query = new URLSearchParams(params).toString();

    return `${path}?${query}`;
}