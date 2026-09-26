export const PASSWORD = 'secret_sauce';

export type UserKey = 'standard' | 'locked' | 'problem';

export interface DemoUser { username: string; password: string; }
export const USERS: Record<UserKey, DemoUser> = {
    standard: { username: 'standard_user', password: PASSWORD },
    locked: { username: 'locked_out_user', password: PASSWORD },
    problem: { username: 'problem_user', password: PASSWORD },
};

export function userByKey(key: string): DemoUser {
    const user = (USERS as Record<string, DemoUser>)[key];
    if (!user) throw new Error(`Unknown user key "${key}". Valid: ${Object.keys(USERS).join(', ')}`);
    return user;
}

export const LOGIN_ERRORS = {
    lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
    invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
    usernameRequired: 'Epic sadface: Username is required',
    passwordRequired: 'Epic sadface: Password is required',
} as const;