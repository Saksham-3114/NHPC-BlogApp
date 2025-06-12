import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface CategoryInputProps {
  value: string
  onChange: (value: string) => void
  onAdd: () => void
  existingCategories: string[]
  disabled?: boolean
}

// Predefined category options
const PREDEFINED_CATEGORIES = [
  "Hydropower",
  "Renewable",
  "Solar",
  "Wind",
  "Construction",
  "Engineering",
  "Transmission",
  "Environment",
  "Sustainability",
  "CSR",
  "Careers",
  "Recruitment",
  "Reports",
  "Policies",
  "Tenders",
  "Electrical",
  "IT",
  "Mechanical",
  "Public Relations"
]

export default function CategoryInput({ 
  value, 
  onChange, 
  onAdd, 
  existingCategories,
  disabled = false 
}: CategoryInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter options based on input value
  useEffect(() => {
    if (value.trim()) {
      const filtered = PREDEFINED_CATEGORIES.filter(category =>
        category.toLowerCase().includes(value.toLowerCase()) &&
        !existingCategories.includes(category)
      )
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(
        PREDEFINED_CATEGORIES.filter(category => 
          !existingCategories.includes(category)
        )
      )
    }
  }, [value, existingCategories])

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true)
  }

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setIsOpen(true)
  }

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onAdd()
      setIsOpen(false)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  // Handle add button click
 

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative flex-1 min-w-fit">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Category (type or select)"
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="pr-8"
          />
          
          {/* Dropdown arrow */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  {value.trim() ? `"${value}" - Press Enter to add as new category` : 'No categories available'}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}