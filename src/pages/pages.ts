export const uiPages = {
    login: '/',
    inventory: '/inventory.html',
} as const;

export type UiPage = keyof typeof uiPages;