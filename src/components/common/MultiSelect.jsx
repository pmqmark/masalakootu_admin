
import { useState, useRef, useEffect } from "react";
import * as Icons from "react-icons/tb";

const MultiSelect = ({
  className,
  label,
  options,
  placeholder,
  isSelected,
  isMulti = false,
  onChange
}) => {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState(isSelected ? [isSelected] : []);
  const [bool, setBool] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef(null);

  const selectedHandle = (option) => {
    const { value } = option;
    if (!isMulti) {
      setSelected([option]);
      setBool(false);
      setValue("");
      setFilteredOptions(options);
    } else {
      setSelected((prevSelected) => [...prevSelected, option]);
      setBool(false);
      setValue("");
      setFilteredOptions(options);
    }
    const selectedValues = selected?.map(item => item?.value)
    onChange(isMulti ? [...selectedValues, value] : [value])
  };

  const inputClickHandle = () => {
    setBool(!bool);
    if (filteredOptions.length === 0) {
      setFilteredOptions(options);
    }
  };

  const changeHandler = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    const filtered = options?.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setBool(false);
    }
  };

  const removeTagHandle = (tag) => {
    setSelected(selected.filter((item) => item?.value !== tag));
    setFilteredOptions(options);
  };

  const clearAllHandle = () => {
    setSelected([]);
    setFilteredOptions(options);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      className={`multi_select input_field ${className ? className : ""}`}
      ref={inputRef}
    >
      {label ? <label>{label}</label> : ""}
      <div className="selected_tags">
        {isMulti && selected.map((select, key) => (
          <span
            key={key}
            className={`${!isMulti ? "selected_tag single" : "selected_tag"}`}
          >
            {select.label}
            {!isMulti ? (
              ""
            ) : (
              <Icons.TbX
                className="remove_tags"
                onClick={() => removeTagHandle(select.value)}
              />
            )}
          </span>
        ))}
      </div>
      <div className="multi_input">
        {!isMulti && selected.length === 0 ? (
          <input
            type="text"
            className={bool ? "active" : ""}
            placeholder={placeholder}
            value={value}
            onChange={changeHandler}
            onClick={inputClickHandle}
          />
        ) : isMulti ? (
          <input
            type="text"
            className={bool ? "active" : ""}
            placeholder={placeholder}
            value={value}
            onChange={changeHandler}
            onClick={inputClickHandle}
          />
        ) : (
          <span className="default_select">{selected.label}</span>
        )}
        <Icons.TbChevronDown className="chevron_down" />
        {selected.length !== 0 ? (
          <Icons.TbX className="remove_tags" onClick={clearAllHandle} />
        ) : null}
      </div>
      <ul className={`select_dropdown ${bool ? "block" : "hidden"}`}>
        {filteredOptions.map((option, key) => {
          const isOptionSelected = selected?.map(item => item.value).includes(option.value);
          return (
            <li
              key={key}
              className={`select_dropdown_item ${isOptionSelected ? "disabled" : ""
                }`}
              onClick={() => !isOptionSelected && selectedHandle(option)}
            >
              <button>{option.label}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MultiSelect;
