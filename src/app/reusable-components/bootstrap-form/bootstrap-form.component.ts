import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'bootstrap-form',
    templateUrl: './bootstrap-form.component.html',
    styleUrls: ['./bootstrap-form.component.scss']
})
export class BootstrapFormComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Output('handleSubmit') ngSubmit = new EventEmitter();

    inputs = [];
    selects = [];
    checkbox = [];
    isSubmitted: boolean = false;

    constructor() { }

    formMaker(array) {
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

    formPartials(array) {
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

    submit() {
        this.ngSubmit.emit(this.isSubmitted = true);
    }

    ngOnInit(): void {
    }

}

// import formModule
// implement reactive form logic
// hookup form with formGroup and formContainer