export interface Product {
    readonly id: string;
    readonly name: string;
    readonly price: number;
}

export const PRODUCTS = {
    backpack: { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', price: 29.99 },
    bikeLight: { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', price: 9.99 },
    boltTshirt: { id: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
    fleeceJacket: { id: 'sauce-labs-fleece-jacket', name: 'Sauce Labs Fleece Jacket', price: 49.99 },
    onesie: { id: 'sauce-labs-onesie', name: 'Sauce Labs Onesie', price: 7.99 },
} as const satisfies Record<string, Product>;

export const ALL_PRODUCTS: readonly Product[] = Object.values(PRODUCTS);

export function productByName(name: string): Product {
    const found = ALL_PRODUCTS.find((p) => p.name === name);
    if (!found) {
        throw new Error(
            `Unknown product "${name}". Known: ${ALL_PRODUCTS.map((p) => p.name).join(', ')}`,
        );
    }
    return found;
}