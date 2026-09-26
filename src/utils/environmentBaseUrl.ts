export type EnvName = 'qa4' | 'dev4';

interface EnvUrls {
    readonly home: string;
}

const environmentBaseUrl: Record<EnvName, EnvUrls> = {
    qa4: { home: 'https://www.saucedemo.com' },
    dev4: { home: 'https://www.saucedemo.com' },
};

export default environmentBaseUrl;