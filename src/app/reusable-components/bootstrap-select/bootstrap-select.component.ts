import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'bootstrap-select',
    templateUrl: './bootstrap-select.component.html',
    styleUrls: ['./bootstrap-select.component.scss']
})
export class BootstrapSelectComponent implements OnInit {

    @Input() name: any;
    @Input() options: any;
    @Input() optionKey: string;
    @Input() label: any;
    @Input() formGroup: any;

    constructor() { }

    ngOnInit(): void {
        
    }

}
