import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ngbootstrap-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {

    @Input() public collectionSize: number;
    @Input() public page: number;
    @Input() public pageSize: number;
    @Input() public lastPageloaded: number;
    @Input() public currentLi: HTMLElement;
    @Output('handlePagination') public click = new EventEmitter();

    constructor() { }

    public handlePageChange(currentPage): void {
        this.lastPageloaded = currentPage - 1;
        this.click.emit({
            name: 'currentPage',
            lastPageloaded: this.lastPageloaded
        });
    }

    public getNextSetOfItems(): void {
        this.lastPageloaded = this.lastPageloaded + 1;
        this.click.emit({
            name: 'next',
            lastPageloaded: this.lastPageloaded
        });
    }

    public getPreviousSetOfItems(): void {
        this.lastPageloaded = this.lastPageloaded - 1;
        this.click.emit({
            name: 'previous',
            lastPageloaded: this.lastPageloaded
        });
    }

    public ngOnChanges(change: SimpleChanges): void {
        const { currentValue, firstChange } = change?.currentLi;

        if (currentValue && !firstChange) {
            const next: string = 'Next';
            const previous: string = 'Previous';

            if (currentValue.getAttribute("aria-label") === next ||
                currentValue.parentElement.getAttribute("aria-label") === next) {
                this.getNextSetOfItems();
            }

            if (currentValue.getAttribute("aria-label") === previous ||
                currentValue.parentElement.getAttribute("aria-label") === previous) {
                this.getPreviousSetOfItems();
            }
        }
    }
}
