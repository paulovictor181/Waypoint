
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, ChangeEvent } from 'react';

interface InputProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

const SearchField: React.FC<InputProps> = ({ initialValue = '', onChange }) => {
    const [value, setValue] = useState<string>(initialValue);
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };
    
    return (
        <div className="flex bg-white w-96 border border-slate-400 rounded-lg justify-between items-center">
            <input className='w-full h-full px-4 py-1 focus:outline-none text-lg text-slate-300' type="text" value={value} onChange={handleChange} />
            <FontAwesomeIcon className='text-slate-300 mx-4 my-1' icon={faMagnifyingGlass} />
        </div>
    );
};

export default SearchField;