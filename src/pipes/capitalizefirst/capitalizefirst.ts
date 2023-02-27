import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'capitalizefirst',
})
export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    if (value === null) return 'NA';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
