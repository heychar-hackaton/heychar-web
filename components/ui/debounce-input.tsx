import _ from 'lodash';
import React from 'react';

import { Input } from './input';

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  initialValue?: string;
  onChange: (value: string) => void;
  debounce?: number;
  inputClassName?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export function DebouncedInput({
  initialValue = '',
  onChange,
  debounce = 400,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = React.useState(initialValue);

  const debouncedOnChange = React.useMemo(
    () => _.debounce((newValue: string) => onChange(newValue), debounce),
    [debounce, onChange]
  );

  React.useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedOnChange(newValue);
  };

  return <Input {...props} onChange={handleChange} value={value} />;
}
