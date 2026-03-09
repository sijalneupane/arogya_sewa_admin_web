import { useState, useEffect } from 'react';
import { SearchableDropdown, TObjectDropdownOption } from '@luciodale/react-searchable-dropdown';
import '@luciodale/react-searchable-dropdown/dist/assets/single-style.css';
import './searchable-select.css';

export interface SelectOption extends TObjectDropdownOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  hasError?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  loading = false,
  hasError = false,
}: SearchableSelectProps) {
  const selectedOption = value ? options.find((opt) => opt.value === value) : undefined;

  const [searchQuery, setSearchQuery] = useState(selectedOption?.label ?? '');

  useEffect(() => {
    if (value === null) {
      setSearchQuery('');
    }
  }, [value]);

  const handleSetValue = (newValue: SelectOption | string | undefined) => {
    if (typeof newValue === 'string') {
      onChange(newValue || null);
    } else if (newValue?.value) {
      onChange(newValue.value);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="w-full">
      <SearchableDropdown
        options={options}
        value={selectedOption}
        setValue={handleSetValue}
        searchOptionKeys={['label']}
        placeholder={placeholder}
        disabled={disabled || loading}
        createNewOptionIfNoMatch={false}
        dropdownOptionNoMatchLabel="No options found"
        searchQuery={searchQuery}
        onSearchQueryChange={(q) => setSearchQuery(q ?? '')}
        classNameSearchableDropdownContainer={`searchable-dropdown-container`}
        classNameSearchQueryInput={`searchable-dropdown-search-input ${hasError ? 'has-error' : ''}`}
        classNameDropdownOptions="searchable-dropdown-options"
        classNameDropdownOption="searchable-dropdown-option"
        classNameDropdownOptionFocused="searchable-dropdown-option-focused"
        classNameDropdownOptionSelected="searchable-dropdown-option-selected"
        classNameDropdownOptionDisabled="searchable-dropdown-option-disabled"
        classNameDropdownOptionLabel="searchable-dropdown-option-label"
        classNameDropdownOptionLabelFocused="searchable-dropdown-option-label-highlight"
        classNameTriggerIcon="searchable-dropdown-trigger-icon"
        classNameDisabled="searchable-dropdown-trigger-disabled"
        offset={5}
      />
    </div>
  );
}
