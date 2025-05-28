import CreatableSelect from "react-select/creatable";
import { useState, useEffect } from "react";

export interface OptionType {
  id: number;
  value: string;
  label: string;
}

const SearchSelectBox = ({
  selectedTag,
  onTagChange,
}: {
  selectedTag?: OptionType;
  onTagChange: (tag: OptionType | null) => void;
}) => {
  const initialOptions: OptionType[] = [
    { id: 2, value: "maritama", label: "TOEIC 600点" },
    { id: 3, value: "hakutou", label: "TOEIC 730点" },
    { id: 4, value: "momo", label: "TOEIC 900点" },
    { id: 1, value: "momo", label: "英検3級" },
    { id: 6, value: "example6", label: "サンプル選択肢6" },
    { id: 7, value: "example7", label: "サンプル選択肢7" },
    { id: 8, value: "example8", label: "サンプル選択肢8" },
    { id: 9, value: "example9", label: "サンプル選択肢9" },
    { id: 10, value: "example10", label: "サンプル選択肢10" },
    { id: 11, value: "example11", label: "サンプル選択肢11" },
    { id: 12, value: "example12", label: "サンプル選択肢12" },
  ];

  const [options, setOptions] = useState<OptionType[]>(initialOptions);
  const [selectedValue, setSelectedValue] = useState<OptionType | null>(
    selectedTag || null
  );

  useEffect(() => {
    setSelectedValue(selectedTag || null);
  }, [selectedTag]);

  const handleChange = (option: OptionType | null) => {
    setSelectedValue(option);
    onTagChange(option);
  };

  const handleCreate = (inputValue: string) => {
    const newOption: OptionType = {
      id: Date.now(), // 任意のユニークIDを生成（本来はDB由来のIDが望ましい）
      value: inputValue,
      label: inputValue,
    };
    setOptions((prev) => [...prev, newOption]);
    setSelectedValue(newOption);
    onTagChange(newOption);
  };

  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      minHeight: "36px",          // 高さを抑える
      height: "36px",
      fontSize: "11px",
      padding: "0px",
      border: "none",
    }),
    menu: (styles: any) => ({
      ...styles,
      fontSize: "11px",
      overflowY: "auto",
      zIndex: 9999,
    }),
    option: (styles: any, { isSelected, isFocused }: any) => ({
      ...styles,
      fontSize: "11px",
      backgroundColor: isFocused ? "#f0f0f0" : isSelected ? "#d0d0d0" : "#fff",
    }),
    placeholder: (styles: any) => ({
      ...styles,
      fontSize: "11px",
    }),
  };

  return (
    <div style={{ width: "250px", margin: "20px", zIndex: 1000 }}>
      <CreatableSelect
        instanceId="search-select-box"
        isClearable
        value={selectedValue}
        options={options}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder="単語帳を設定できます"
        isSearchable
        styles={customStyles}
        components={{ IndicatorSeparator: () => null }}
        menuPortalTarget={document.body} // overflow隠し対策
        formatCreateLabel={(inputValue) => `新規作成 : ${inputValue}`}
      />
    </div>
  );
};

export default SearchSelectBox;
