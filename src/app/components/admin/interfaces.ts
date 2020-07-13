export interface IOrder {
    id: string;
    bucket: {
        numberOfItems: number;
        totalAmount: number;
        pruductsInBucket: []
    }
    userInfo: {
        city: string;
        id: string;
        lineOne: string;
        lineTwo: string;
        userName: string;
        timeStamp: any;
    }
}

export interface IThLabel {
    label: string;
    sortPath: string;
    isVisible: boolean;
}
