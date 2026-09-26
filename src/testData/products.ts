import productsJson from './products.json';

export interface Product {
    readonly id: string;
    readonly name: string;
    readonly price: number;
}

/** Product catalog is stored in products.json (single source of truth). */
export const PRODUCTS = productsJson;
export const ALL_PRODUCTS: readonly Product[] = Object.values(productsJson);

export function productByName(name: string): Product {
    const found = ALL_PRODUCTS.find((p) => p.name === name);
    if (!found) {
        throw new Error(
            `Unknown product "${name}". Known: ${ALL_PRODUCTS.map((p) => p.name).join(', ')}`,
        );
    }
    return found;
}