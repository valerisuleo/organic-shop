import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'bootstrap-list',
    templateUrl: './bootstrap-list.component.html',
    styleUrls: ['./bootstrap-list.component.scss']
})
export class BootstrapListComponent implements OnChanges {
    @Input() props: any;
    @Output('handleSelectedLi') click = new EventEmitter();

    list: any[] = [];
    propertyKey: string;

    constructor() { }

    toggleActiveClass(current): void {
        this.list
            .filter(el => el != current)
            .forEach(item => item.isActive = false);
        current.isActive = !current.isActive;
        this.click.emit(current);
    }

    ngOnChanges(change: SimpleChanges): void {
        const { currentValue, firstChange } = change.props;
        if (currentValue && !firstChange) {
            const { list, key } = currentValue;
            this.list = list;
            this.propertyKey = key;
        }
    }
}


