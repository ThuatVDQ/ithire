import React, { useState } from "react";
import Select from "react-select";

export default function ToggleSelect({ options, value, onChange }) {
  const [lastSelected, setLastSelected] = useState(null);

  const handleChange = (selectedOption) => {
    if (selectedOption && selectedOption.value === lastSelected) {
      setLastSelected(null);
      onChange(null);
    } else {
      setLastSelected(selectedOption ? selectedOption.value : null);
      onChange(selectedOption);
    }
  };

  return <Select options={options} value={value} onChange={handleChange} />;
}
