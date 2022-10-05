import {
 Directive,
  forwardRef,
  ElementRef,
  HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'goa-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDirective),
      multi: true,
    }
  ]
})

export class InputDirective implements ControlValueAccessor {
  private _value = "";

  onChange: any = () => { };
  onTouched: any = () => { };

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      this.onTouched();
      this.elementRef.nativeElement.value = val;
    }
  }

  writeValue(value: string) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  constructor(private elementRef: ElementRef) { }

  @HostListener('_change', ['$event.detail.value'])
  listenForValueChange(value: string) {
    this.value = value;
  }
}
