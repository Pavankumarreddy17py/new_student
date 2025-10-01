import React from 'react';

interface SubjectInputProps {
  label: string;
  name: string;
  value: number | '';
  onChange: (name: string, value: number) => void;
  max: number;
  isLab?: boolean;
}

const SubjectInput: React.FC<SubjectInputProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  max, 
  isLab = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? '' : Number(e.target.value);
    onChange(name, newValue as number);
  };
  
  return (
    <div className={`p-4 rounded-lg border ${isLab ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <label htmlFor={name} className="text-sm font-medium mb-2 md:mb-0">
          {label} <span className="text-gray-500 text-sm">(Max: {max})</span>
        </label>
        
        <div className="w-full md:w-32">
          <input
            type="number"
            id={name}
            name={name}
            min={9}
            max={max}
            value={value}
            onChange={handleChange}
            className="form-input py-2 text-center"
            placeholder="Enter marks"
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectInput;