import usersJson from './users.json';

export interface DemoUser {
    readonly username: string;
    readonly password: string;
}

/** User catalog is stored in users.json (single source of truth). */
export type UserKey = keyof typeof usersJson;
export const USERS = usersJson;

export function userByKey(key: string): DemoUser {
    const user = (USERS as Record<string, DemoUser>)[key];
    if (!user) {
        throw new Error(
            `Unknown user key "${key}". Valid: ${Object.keys(USERS).join(', ')}`,
        );
    }
    return user;
}

/** Roles that get a saved storageState in auth.setup.ts (sourced from users.json). */
export type Role = 'standard' | 'problem';
export interface AuthUser {
    readonly role: Role;
    readonly username: string;
    readonly password: string;
}
export const authUsers: readonly AuthUser[] = [
    { role: 'standard', ...usersJson.standard },
    { role: 'problem', ...usersJson.problem },
];

/** Exact SauceDemo login error copy (asserted verbatim) — kept in code, not data. */
export const LOGIN_ERRORS = {
    lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
    invalidCredentials:
        'Epic sadface: Username and password do not match any user in this service',
    usernameRequired: 'Epic sadface: Username is required',
    passwordRequired: 'Epic sadface: Password is required',
} as const;