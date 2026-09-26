export const uiPages = {
    login: '/',
    inventory: '/inventory.html',
    cart: '/cart.html',
    checkoutInfo: '/checkout-step-one.html',
    checkoutOverview: '/checkout-step-two.html',
    checkoutComplete: '/checkout-complete.html',
} as const;

export type UiPage = keyof typeof uiPages;