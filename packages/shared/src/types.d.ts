export interface IconVariant {
    file: string;
    type: 'logo' | 'wordmark' | 'mark' | 'icon';
    variant: string;
    background: 'light' | 'dark';
}
export interface BrandMeta {
    name: string;
    slug: string;
    category: string;
    tags: string[];
    website: string;
    colors: {
        primary: string;
        secondary?: string;
    };
    license: string;
    variants: IconVariant[];
}
//# sourceMappingURL=types.d.ts.map