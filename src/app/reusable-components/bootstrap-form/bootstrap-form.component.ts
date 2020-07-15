import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'bootstrap-form',
    templateUrl: './bootstrap-form.component.html',
    styleUrls: ['./bootstrap-form.component.scss']
})
export class BootstrapFormComponent implements OnInit {

    @Input() public className: string;
    @Input() public label: string;
    @Input() public deleteBtn: boolean;
    @Input() public isLoading: boolean;
    @Input() public formGroup: FormGroup;
    @Output('handleSubmit') public ngSubmit = new EventEmitter();
    @Output('handleDelete') public click = new EventEmitter();
    
    public inputs = [];
    public selects = [];
    public checkbox = [];
    public contextualClasses: string;
    public isSubmitted: boolean = false;

    constructor() { }

    public formMaker(array) {
        let obj = {};
        array.forEach((item) => {
            const key = item.name;
            obj[key] = new FormControl('', [
                item.isRequired ? Validators.required : Validators.nullValidator,
                Validators.minLength(item.minLenght),
            ])
        });
        this.formGroup = new FormGroup(obj);
        this.formPartials(array)
    }

    public formPartials(array) {
        array.forEach((item) => {
            if (item.type !== 'select' && item.type !== 'checkbox') {
                this.inputs.push(item);
            } else if (item.type === 'checkbox') {
                this.checkbox.push(item);
            } else {
                this.selects.push(item);
            }
        });
    }

    public submit(): void {
        this.ngSubmit.emit(this.isSubmitted = true);
    }

    public deleteItem(): void {
        this.click.emit(true)
    }

    public getBtnClasses(): void {
        let classes: string = 'btn ';
        classes += this.className;
        this.contextualClasses = classes;
    }

    ngOnInit(): void {
        this.getBtnClasses();
    }

}

// import formModule
// implement reactive form logic
// hookup form with formGroup and formContainer