import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(items: any[], query: string): any[] {
        if (!query) {
            return items;
        }
        return items.filter((el: any) => {
            return JSON.stringify(el).toLowerCase().includes(query.toLowerCase());
        });
    }
}
