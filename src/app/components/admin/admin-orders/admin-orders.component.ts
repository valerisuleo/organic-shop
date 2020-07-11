import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IOrder, IThLabel } from '../interfaces';
import { OrderByDirection } from '@firebase/firestore-types';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { faArrowUp, faArrowDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'admin-orders',
    templateUrl: './admin-orders.component.html',
    styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

    public th: IThLabel[] = [];
    public orders: IOrder[] = [];

    private isUp: boolean = true;
    public faArrow: IconDefinition = faArrowUp;
    private destroyed$: Subject<boolean> = new Subject();

    constructor(private service: DataService) { }


    public thMaker(): void {
        const labels = ['Customers', 'Date', ''];
        const sortColPath = ['userInfo.userName', 'userInfo.timeStamp.seconds', ''];

        this.th = labels.map((item, i) => {
            return {
                label: item,
                sortPath: sortColPath[i],
                isVisible: i === 0 ? true : false
            }
        });
    }

    public getOrders(): void {
        const collection = 'ordersPlaced';
        this.service.getAll(collection)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                this.orders = response;
                this.onSort();
            });
    }

    public onSort(currentCol?: IThLabel): void {
        if (currentCol) {
            this.th.forEach(element => element.isVisible = false);
            currentCol.isVisible = true;
        };

        this.isUp = !this.isUp;

        const sortColPath = currentCol ? currentCol.sortPath : 'userInfo.userName';
        const sortColOrder: OrderByDirection = this.isUp ? "desc" : "asc";
        this.faArrow = this.isUp ? faArrowDown : faArrowUp;

        const sorted: IOrder[] = _.orderBy(this.orders, sortColPath, sortColOrder);
        this.orders = sorted;
    }

    public ngOnInit(): void {
        this.thMaker();
        this.getOrders();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
