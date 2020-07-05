import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

    data = [];

    constructor() { }

    ngOnInit(): void {
        const ls = localStorage.getItem(JSON.parse('bucket'));
        console.log(ls);
        
        const { data } = history.state;
        // localStorage.setItem('bucket', JSON.stringify(data));

        // console.log(data);
        
    }

}
