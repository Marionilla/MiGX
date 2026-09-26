import type { Role } from '../testData/base.data';
/** Maps each auth role to its saved storageState file (produced by auth.setup.ts). */
export const authStates: Record<Role, string> = {
    standard: '.auth/standard.json',
    problem: '.auth/problem.json',
};