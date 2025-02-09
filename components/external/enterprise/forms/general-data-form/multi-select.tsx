import { Control, Controller, FieldError, Merge } from "react-hook-form";
import Select, {
  components,
  DropdownIndicatorProps,
  GroupBase,
  MultiValueProps,
} from "react-select";

interface Option {
  id: number; // mudado de value para id
  label: string;
}

interface GroupedOption {
  label: string;
  options: Option[];
}

type SelectOptions = Option[] | GroupedOption[];

interface MultiSelectProps {
  control: Control<any>;
  name: string;
  options: SelectOptions;
  placeholder: string;
  error?: Merge<FieldError, (FieldError | undefined)[]> | undefined;
}

const DropdownIndicator = (
  props: DropdownIndicatorProps<Option, true, GroupBase<Option>>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 6L0.669872 0L9.33013 0L5 6Z" fill="#A7B6CD" />
      </svg>
    </components.DropdownIndicator>
  );
};

const MultiValue = (
  props: MultiValueProps<Option, true, GroupBase<Option>>
) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    props.removeProps.onClick?.(event as any);
  };

  return (
    <components.MultiValue {...props}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#EBEDED",
          border: "1px solid #A5B5C1",
          borderRadius: "15px",
          padding: "4px 8px",
          margin: "2px",
        }}
      >
        <span style={{ color: "#747D8C", marginRight: "8px" }}>
          {props.children}
        </span>
        <button
          onClick={handleClick}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 0,
            fontSize: "14px",
            color: "#747D8C",
          }}
        >
          ×
        </button>
      </div>
    </components.MultiValue>
  );
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  control,
  name,
  options,
  placeholder,
  error,
}) => {
  const isGroupedOptions = (opts: SelectOptions): opts is GroupedOption[] => {
    return opts.length > 0 && "options" in opts[0];
  };

  const getAllOptions = (opts: SelectOptions): Option[] => {
    if (isGroupedOptions(opts)) {
      return opts.flatMap((group) => group.options);
    }
    return opts;
  };

  const formatSelectedValue = (option: Option) => ({
    ...option,
    value: option.id,
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col">
          <Select<Option, true, GroupBase<Option>>
            {...field}
            isMulti
            options={options}
            components={{ DropdownIndicator, MultiValue }}
            placeholder={placeholder}
            onChange={(selectedOptions) => {
              const values = selectedOptions
                ? selectedOptions.map((opt) => opt.id)
                : [];
              field.onChange(values);
            }}
            value={getAllOptions(options)
              .filter((option) => field.value?.includes(option.id))
              .map(formatSelectedValue)}
            formatOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id.toString()}
            styles={{
              placeholder: (base) => ({
                ...base,
                fontSize: "14px",
                color: "#747D8C",
              }),
              option: (base) => ({
                ...base,
                fontSize: "14px",
                color: "#747D8C",
              }),
              group: (base) => ({
                ...base,
                paddingTop: 0,
                paddingBottom: 0,
              }),
              groupHeading: (base) => ({
                ...base,
                fontSize: "14px",
                fontWeight: "600",
                color: "#2292EA",
                textTransform: "none",
                paddingLeft: "12px",
                marginBottom: "4px",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "transparent",
                border: "none",
              }),
              multiValueLabel: (base) => ({
                ...base,
                padding: 0,
              }),
              multiValueRemove: (base) => ({
                ...base,
                display: "none",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: "38px",
                borderColor: state.isFocused
                  ? "#A5B5C1"
                  : error
                    ? "red"
                    : "#A5B5C1",
                "&:hover": {
                  borderColor: "#A5B5C1",
                },
                boxShadow: state.isFocused
                  ? error
                    ? "0 0 0 1px red"
                    : "0 0 0 1px #A5B5C1"
                  : "none",
              }),
              menuPortal: (defaultStyles) => ({
                ...defaultStyles,
                zIndex: 1100,
                pointerEvents: "all",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#A7B6CD",
                "&:hover": {
                  color: "#A7B6CD",
                },
              }),
              indicatorSeparator: () => ({
                display: "none",
              }),
            }}
          />
          {error && "message" in error && typeof error.message === "string" && (
            <p className="mt-1 text-sm text-red-400">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default MultiSelect;
