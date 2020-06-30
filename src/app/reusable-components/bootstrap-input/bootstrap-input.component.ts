import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'bootstrap-input',
    templateUrl: './bootstrap-input.component.html',
    styleUrls: ['./bootstrap-input.component.scss']
})
export class BootstrapInputComponent implements OnInit {

    @Input() name: any;
    @Input() type: any;
    @Input() label: any;
    @Input() formGroup: any;

    constructor() { }

    ngOnInit(): void {
    }

}
