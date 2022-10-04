// import {
//  Directive,
//   OnInit,
//   forwardRef,
//   HostBinding,
//   ChangeDetectionStrategy,
//   Input,
//   Output,
//   EventEmitter,
//   ElementRef,
//   HostListener
// } from '@angular/core';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
//
// @Directive({
//   selector: 'goa-input',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => InputDirective),
//       multi: true,
//     }
//   ]
// })
//
// export class InputDirective implements ControlValueAccessor {
//   onChange: any = () => {
//     console.log("in the onChange")
//   };
//   onTouched: any = () => {
//     console.log("in the onTouched")
//   };
//
//   private _value: string = "";
//
//   get value(): string {
//     console.log("getting val", this._value)
//     return this._value;
//   }
//
//   set value(val: string) {
//     console.log("setting value", val)
//     if (val !== this._value) {
//       this._value = val;
//       this.onChange(this._value);
//       this.onTouched();
//       this.elementRef.nativeElement.value = val;
//     }
//   }
//
//   writeValue(value: string) {
//     console.log("writeValue")
//     if (value) {
//       this.value = value;
//     }
//   }
//
//   registerOnChange(fn: () => void) {
//     console.log("registerOnChange")
//     this.onChange = fn;
//   }
//
//   registerOnTouched(fn: () => void) {
//     console.log("registerOnTouched")
//     this.onTouched = fn;
//   }
//
//   constructor(private elementRef: ElementRef) {
//     console.log("int he contrasdfsadf")
//   }
//
//   @HostListener('_change', ['$event.detail'])
//   listenForValueChange(value: string) {
//     console.log("@HostListener", value)
//     this.value = value;
//   }
// }
