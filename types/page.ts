export type PageItemDataType = {
    id: number;
    name: string;          // e.g. "Privacy & Policy"
    locale: string;        // e.g. "en", "fa", "ps"
    title: string;         // e.g. "Privacy and Policy"
    subtitle: string;      // e.g. "Privacy & Policy"
    content: string;       // HTML content
    image: string | null;  // optional page image
    status: 'active' | 'inactive';
};

export type PageDetailsResponseType = {
    status: string;
    status_code: number;
    success: boolean;

    item: PageItemDataType;

};

export type PageListResponseType = {
    status: string;
    status_code: number;
    success: boolean;
    body: {
        item: PageItemDataType[];
    };
};
