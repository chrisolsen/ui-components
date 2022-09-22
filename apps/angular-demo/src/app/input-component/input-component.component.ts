import { Component } from '@angular/core';
import { format } from "date-fns";
import {NgForm} from '@angular/forms';

export class Book{
    title: string
    constructor(title: string) {
      this.title = title;
    }
}

@Component({
  selector: 'abgov-input-component',
  templateUrl: './input-component.component.html',
  styleUrls: ['./input-component.component.css']
})
export class InputComponentComponent {
  constructor() { }

  book: Book=new Book("");
  name = '';
  date = new Date();
  formatDate = format(this.date, "yyyy-MM-dd");
  time = format(this.date, "HH:mm:ss");
  dateTime = format(this.date, "yyyy-MM-dd HH:mm")
  minDate = format(this.date, "yyyy-MM-dd");
  maxDate = format(this.getDateWithMonthOffset(1), "yyyy-MM-dd");

  // foobinding = new FormControl('');

  getDateWithMonthOffset(offset: number) {
    const d = new Date();
    d.setMonth(d.getMonth() + offset);
    return d;
  }

  onInputChangeEvent(event: any) {
    console.log('onEvent', event.detail);
  }

  handleTrailingIconClick() {
    console.log('handleTrailingIconClick');
  }

  onSubmit(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }
}
