import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pageditems',
    pure: false
})
export class PagingPipe implements PipeTransform {
    transform(collections: any[], value: any): any {
        if (value === undefined || value === '') return collections;

        return collections.slice(value.startIndex, value.endIndex + 1)

        //return collections.filter(function (collection) {
        //    for (let property in collection) {
        //        if (collection[property] === null) {
        //            continue;
        //        }
        //        if (collection[property].toString().toLowerCase().includes(value.toLowerCase())) {
        //            return true;
        //        }
        //    }
        //    return false;
        //});
    }
}

