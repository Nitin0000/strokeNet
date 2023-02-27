import { Component, Input } from '@angular/core';
@Component({
  selector: 'no-data',
  templateUrl: 'no-data.html'
})
export class NoDataComponent {
  @Input('title') title;
  @Input('message') message;
  
  constructor() {
    //console.log('Hello NoDataComponent Component');
  }
}
