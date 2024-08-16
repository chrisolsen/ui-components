import * as React from "react";
import {
  DropdownItemMountType,
  GoABlock,
  GoAButton,
  GoADropdown,
  GoADropdownItem, GoAFormItem,
} from "@abgov/react-components";

import { useState } from "react";

export default function Dropdown() {
  function noop(_name: string, _value: string | string[]) {
    // do nothing
  }

  const provinces: string[] = [
    "BC",
    "Alberta",
    "Saskatchewan",
    "Manitoba",
    "Ontario",
    "Quebec",
  ];

  const cities: Record<string, string[]> = {
    BC: ["Vancouver", "Kelowna", "Fernie"],
    Alberta: ["Edmonton", "Calgary"],
    Saskatchewan: ["Regina", "Saskatoon"],
    Manitoba: ["Winnipeg"],
    Ontario: ["Toronto", "Ottawa"],
    Quebec: ["Montreal", "Quebec City"],
  };

  const [pcities, setPcities] = useState<string[]>([]);

  function selectProvince(_name: string, value: string | string[]) {
    if (typeof value === "string") setPcities(cities[value]);
  }

  const [selectedColor, setSelectedColor] = useState("green");

  type Color = {
    value: string;
    mount: DropdownItemMountType;
  }

  const [colors, setColors] = useState<Color[]>([
    { value: "red", mount: "append" },
    { value: "green", mount: "append" },
    { value: "blue", mount: "append" },
  ])

  function onChange(name: string, value: string | string[]) {
    console.log(name, value)
    setSelectedColor(value as string);
  }

  function addColors(mount: DropdownItemMountType) {
    const newColors = [{ value: "cyan", mount: mount }, { value: "violet", mount: mount }];
    if (mount === "prepend") {
      newColors.reverse();
    }
    setColors([...colors, ...newColors])
  }

  return (
    <>
      <h1>Dropdown</h1>

      <GoAFormItem label="Append items">
        {selectedColor}
        <GoADropdown onChange={onChange} value={selectedColor}>
          {colors.map(c =>
            <GoADropdownItem label={c.value} value={c.value} mountType={c.mount} />
          )}
        </GoADropdown>
      </GoAFormItem>

      <GoABlock>
        <GoAButton onClick={() => addColors("append")}>Append colors</GoAButton>
        <GoAButton onClick={() => addColors("prepend")}>Prepend colors</GoAButton>
        <GoAButton onClick={() => addColors("reset")}>Reset/add colors</GoAButton>
      </GoABlock>

      <h2>Default</h2>
      <h4>Not Filterable</h4>
      <div style={{ width: "80%", border: "2px solid red" }}>
        <GoAFormItem label="Item" requirement="required">
          <GoADropdown name="item" onChange={onChange} width="100%">
            <GoADropdownItem value="red" label="Red" />
            <GoADropdownItem value="green" label="Green" />
            <GoADropdownItem value="blue" label="Blue" />
          </GoADropdown>
        </GoAFormItem>
      </div>
      <GoADropdown value={selectedColor} name="colors" placeholder="Select a color" onChange={onChange}>
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="value" value="blue" label="Blue" />
      </GoADropdown>

      <h4>Filterable</h4>
      <GoADropdown
        filterable
        name="colors"
        placeholder="Select a color"
        onChange={noop}
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="value" value="blue" label="Blue" />
      </GoADropdown>

      <h2>Disabled</h2>

      <h4>Not Filterable</h4>
      <GoADropdown
        name="colors"
        placeholder="Select a color"
        onChange={noop}
        disabled={true}
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="value" value="blue" label="Blue" />
      </GoADropdown>

      <h4>Filterable</h4>
      <GoADropdown
        name="colors"
        filterable
        placeholder="Select a color"
        onChange={noop}
        disabled={true}
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="value" value="blue" label="Blue" />
      </GoADropdown>

      <h2>
        Reactive Binding
        <GoAButton onClick={() => setSelectedColor("red")} type="tertiary">
          Change to red
        </GoAButton>
      </h2>
      <h4>Filterable</h4>
      <div>Selected Color: {selectedColor}</div>
      <br />
      <GoADropdown
        name="colors"
        placeholder="Select a color"
        onChange={onChange}
        value={selectedColor}
        filterable
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="value" value="blue" label="Blue" />
      </GoADropdown>

      <h4>Not Filterable</h4>
      <GoADropdown
        name="colors"
        placeholder="Select a color"
        onChange={onChange}
        value={selectedColor}
        filterable
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="value" value="blue" label="Blue" />
      </GoADropdown>

      <h2>Native</h2>
      <h4>Not Filterable</h4>
      <GoADropdown
        name="colors-native"
        placeholder="Select a user"
        value="green"
        native={true}
        onChange={noop}
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="blue" value="blue" label="Blue" />
      </GoADropdown>

      <h4>Filterable</h4>
      <GoADropdown
        name="colors-native"
        placeholder="Select a user"
        value="green"
        native={true}
        filterable
        onChange={noop}
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="blue" value="blue" label="Blue" />
      </GoADropdown>

      <h2>Error</h2>
      <h4>Not Filterable</h4>
      <GoADropdown
        name="colors2"
        placeholder="Select a user"
        error={true}
        value="green"
        onChange={noop}
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="blue" value="blue" label="Blue" />
      </GoADropdown>
      <h4>Filterable</h4>

      <GoADropdown
        name="colors2"
        placeholder="Select a user"
        error={true}
        filterable
        value="green"
        onChange={noop}
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="blue" value="blue" label="Blue" />
      </GoADropdown>

      <h2>Dynamic</h2>
      <h4>Not Filterable</h4>
      <GoADropdown name="province" onChange={selectProvince}>
        {provinces.map((p) => (
          <GoADropdownItem key={p} value={p} label={p} />
        ))}
      </GoADropdown>

      <GoADropdown name="city" onChange={noop} placeholder="City">
        {pcities.map((p) => (
          <GoADropdownItem key={p} value={p} label={p} />
        ))}
      </GoADropdown>

      <h4>Filterable</h4>
      <GoADropdown name="province" filterable onChange={selectProvince}>
        {provinces.map((p) => (
          <GoADropdownItem key={p} value={p} label={p} />
        ))}
      </GoADropdown>

      <GoADropdown name="city" filterable onChange={noop} placeholder="City">
        {pcities.map((p) => (
          <GoADropdownItem key={p} value={p} label={p} />
        ))}
      </GoADropdown>

      <h2>Aria Label</h2>
      <h4>Not Filterable</h4>
      <GoADropdown
        name="aria"
        placeholder="Select a user"
        value="blue"
        onChange={noop}
        ariaLabel="Some random aria label"
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="blue" value="blue" label="Blue" />
      </GoADropdown>

      <h4>Filterable</h4>
      <GoADropdown
        name="aria"
        placeholder="Select a user"
        value="blue"
        filterable
        onChange={noop}
        ariaLabel="Some random aria label"
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="blue" value="blue" label="Blue" />
      </GoADropdown>

      <h2>Margin Spacing</h2>
      <h4>Not Filterable</h4>
      <GoADropdown
        name="colors"
        placeholder="Select a user"
        value="blue"
        onChange={noop}
        mt="m"
        mb="xs"
        ml="xl"
        mr="2xl"
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="blue" value="blue" label="Blue" />
      </GoADropdown>

      <h4>Filterable</h4>
      <GoADropdown
        name="colors"
        placeholder="Select a user"
        value="blue"
        onChange={noop}
        mt="m"
        mb="xs"
        ml="xl"
        mr="2xl"
        filterable
      >
        <GoADropdownItem key="red" value="red" label="Red" />
        <GoADropdownItem key="green" value="green" label="Green" />
        <GoADropdownItem key="blue" value="blue" label="Blue" />
      </GoADropdown>

      <div style={{
        height: "calc(100vh - 22rem)",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 3fr 1fr",
        gridTemplateRows: "1fr 3fr 1fr",
        gridTemplateAreas: `
        "topleft . topright"
        ". center ."
        "bottomleft . bottomright"
      `,
      }}>
        <div style={{
          gridArea: "topleft"
        }}>
          <GoADropdown name="item" onChange={onChange}>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
          </GoADropdown>
        </div>
        <div style={{
          gridArea: "topright",
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <GoADropdown name="item" onChange={onChange}>
            <GoADropdownItem value="red" label="RedRedRedRedRedRedRedRedRedRedRedRed"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
          </GoADropdown>
        </div>
        <div style={{
          gridArea: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <GoADropdown name="item" onChange={onChange}>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
          </GoADropdown>
        </div>
        <div style={{
          gridArea: "bottomleft",
          display: "flex",
          alignItems: "flex-end",
        }}>
          <GoADropdown name="item" onChange={onChange}>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
          </GoADropdown>
        </div>
        <div style={{
          gridArea: "bottomright",
          display: "flex",
          alignItems: "flex-end",
        }}>
          <GoADropdown name="item" onChange={onChange}>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
            <GoADropdownItem value="red" label="Red"></GoADropdownItem>
            <GoADropdownItem value="green" label="Green"></GoADropdownItem>
            <GoADropdownItem value="blue" label="Blue"></GoADropdownItem>
          </GoADropdown>
        </div>
      </div>


    </>
  );
}
