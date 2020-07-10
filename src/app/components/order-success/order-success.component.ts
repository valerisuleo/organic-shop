import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'order-success',
    templateUrl: './order-success.component.html',
    styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {

    constructor(private router: Router) { }

    public handleClick(isClicked: boolean): void {
        if (isClicked) {
            this.router.navigate(['/products']);
        }
    }

    public ngOnInit(): void {
    }

}
