import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'bootstrap-table',
    templateUrl: './bootstrap-table.component.html',
    styleUrls: ['./bootstrap-table.component.scss']
})
export class BootstrapTableComponent implements OnInit {

    @Input() public className: string;
    public contextualClasses: string;
    
    constructor() { }

    public getTableClasses(): void {
        let classes: string = 'table ';
        classes += this.className;
        this.contextualClasses = classes;
    }

    public ngOnInit(): void {
        this.getTableClasses();
    }

}
