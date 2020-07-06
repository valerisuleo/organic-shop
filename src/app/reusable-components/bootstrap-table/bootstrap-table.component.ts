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

    public getAlertClasses(): void {
        let classes: string = 'table ';
        if (this.className) {
            classes += this.className;
            this.contextualClasses = classes;
        } else {
            this.contextualClasses = classes;
        }
    }

    ngOnInit(): void {
        this.getAlertClasses();

    }

}
