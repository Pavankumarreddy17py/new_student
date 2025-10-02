// pavankumarreddy17py/new_student/new_student-5dd13c6c821a0a0acaddaf6bb02e8aacbb5e6068/src/components/marks/SubjectInput.tsx

import React from 'react';

interface SubjectInputProps {
  label: string;
  name: string;
  internalValue: number | ''; // Separate value for internal marks
  externalValue: number | ''; // Separate value for external marks
  onChange: (name: string, field: 'internal' | 'external', value: number | '') => void;
  maxInternal: number; // Max for internal
  maxExternal: number; // Max for external
  isLab?: boolean;
}

const SubjectInput: React.FC<SubjectInputProps> = ({ 
  label, 
  name, 
  internalValue, 
  externalValue, 
  onChange, 
  maxInternal, 
  maxExternal, 
  isLab = false 
}) => {
  
  // New handler to enforce max limit
  const createChangeHandler = (field: 'internal' | 'external', max: number) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let newValue: number | '' = rawValue === '' ? '' : Number(rawValue);

    // Enforce max limit here
    if (typeof newValue === 'number' && newValue > max) {
        newValue = max; // Cap the value at max
    }
    
    // Ensure value is non-negative
    if (typeof newValue === 'number' && newValue < 0) {
        newValue = 0;
    }

    onChange(name, field, newValue);
  };
  
  const handleInternalChange = createChangeHandler('internal', maxInternal);
  const handleExternalChange = createChangeHandler('external', maxExternal);

  const totalMax = maxInternal + maxExternal;
  const totalValue = (typeof internalValue === 'number' ? internalValue : 0) + 
                     (typeof externalValue === 'number' ? externalValue : 0);
  
  return (
    <div className={`p-4 rounded-lg border ${isLab ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between"> 
        <label htmlFor={`${name}-internal`} className="text-sm font-medium mb-2 md:mb-0 md:w-1/2">
          {label} <span className="text-gray-500 text-sm">(Total: {totalValue}/{totalMax})</span>
        </label>
        
        <div className="w-full md:w-1/2 flex gap-4">
          {/* Internal Marks Input */}
          <div className="flex-1">
            <label htmlFor={`${name}-internal`} className="block text-xs text-gray-500 mb-1">Internal (Max: {maxInternal})</label>
            <input
              type="number"
              id={`${name}-internal`}
              name={`${name}-internal`}
              min={0}
              max={maxInternal}
              value={internalValue}
              onChange={handleInternalChange}
              className="form-input py-2 text-center w-full"
              placeholder="Int. marks"
            />
          </div>

          {/* External Marks Input */}
          <div className="flex-1">
            <label htmlFor={`${name}-external`} className="block text-xs text-gray-500 mb-1">External (Max: {maxExternal})</label>
            <input
              type="number"
              id={`${name}-external`}
              name={`${name}-external`}
              min={0}
              max={maxExternal}
              value={externalValue}
              onChange={handleExternalChange}
              className="form-input py-2 text-center w-full"
              placeholder="Ext. marks"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectInput;