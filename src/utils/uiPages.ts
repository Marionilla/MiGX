export const uiPages = {
    login: '/',
    inventory: '/inventory.html',
    cart: '/cart.html',
} as const;

export type UiPage = keyof typeof uiPages;