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
    }
}