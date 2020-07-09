import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'bootstrap-alert',
    templateUrl: './bootstrap-alert.component.html',
    styleUrls: ['./bootstrap-alert.component.scss']
})
export class BootstrapAlertComponent implements OnInit {

    @Input() public className: string;
    @Output('handleClick') public click = new EventEmitter();
    public contextualClasses: string;

    constructor() { }
    
    public getAlertClasses(): void {
        let classes: string = 'alert alert-';
        classes += this.className;
        this.contextualClasses = classes;
    }

    public doClick(): void {
        this.click.emit(true);
    }

    public ngOnInit(): void {
        this.getAlertClasses();
    }
}
