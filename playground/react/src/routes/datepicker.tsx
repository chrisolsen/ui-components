import {GoADatePicker, GoAFormItem} from "@abgov/react-components";
import {useState} from "react";

export function Datepicker() {
  const [value, setValue] = useState<Date>(new Date(2024,3,26));
  function onChange(name: string, value: Date) {
    console.log("onChange is triggered ", name, value);
    setValue(value);
  }
  return (
    <GoAFormItem label="Item">
      <GoADatePicker onChange={onChange} name="item" value={value}></GoADatePicker>
    </GoAFormItem>
  )
}
