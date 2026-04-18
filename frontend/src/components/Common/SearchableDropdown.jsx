import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

const SearchableDropdown = ({ options, onSelect, placeholder, label, value, error, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`relative space-y-2 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} ref={dropdownRef}>
            {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>}
            
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-slate-50 border transition-all px-4 py-3 rounded-2xl flex items-center justify-between ${
                    disabled ? 'cursor-not-allowed border-slate-200' :
                    error ? 'border-red-300 ring-4 ring-red-50 cursor-pointer' : 
                    'border-slate-200 hover:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 cursor-pointer'
                }`}
            >
                <span className={`text-sm ${value ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-[70] w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                autoFocus
                                className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-0 placeholder:text-slate-400"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => handleSelect(option)}
                                    className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between hover:bg-blue-50 transition-colors ${
                                        value === option ? 'bg-blue-50/50 text-blue-700 font-bold' : 'text-slate-600 font-medium'
                                    }`}
                                >
                                    {option}
                                    {value === option && <Check className="w-4 h-4 text-blue-600" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-400 text-xs italic font-medium">
                                No matching results found
                            </div>
                        )}
                    </div>
                </div>
            )}
            {error && <p className="text-[10px] font-bold text-red-500 mt-1 pl-1">{error}</p>}
        </div>
    );
};

export default SearchableDropdown;
