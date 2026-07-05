import React from 'react';
import { Search } from 'lucide-react';
import Input from './Input';

const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  className = '',
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full md:max-w-xs ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={Search}
      />
    </form>
  );
};

export default SearchBar;
