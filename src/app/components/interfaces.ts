export interface IProduct {
    count?: number;
    isOpen?: boolean;
    quantity?: number;
    category: string;
    id?: string;
    imageUrl: string;
    // inStock: number;
    price: number;
    seqN: number;
    title: string;
}

export interface ICategoryMenu {
    categoryName: string;
    isActive: boolean;
    id: string;
    cssClass?: string;
    collectionSize: number;
}

export interface IListGroup {
    list: any[];
    key: string;
    isAsync?: boolean;
}

export interface ICategory {
    name: string;
    id: string;
}

export interface IBucketMap {
    name: string;
    quantity: number;
}

export interface IPagination {
    name: string;
    lastPageloaded: number;
}