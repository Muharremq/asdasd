import React, { useState } from 'react';
import { ProductFilter as FilterType } from '../../types';
import { mockCategories } from '../../services/mockData';
import Button from '../ui/Button';
import { SlidersHorizontal, X } from 'lucide-react';

interface ProductFilterProps {
  onFilterChange: (filter: FilterType) => void;
  activeFilters: FilterType;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange, activeFilters }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterType>(activeFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'number' ? (value ? parseFloat(value) : undefined) : value;
    
    setLocalFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleCategoryChange = (category: string) => {
    setLocalFilters(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
    if (window.innerWidth < 768) {
      setIsFilterVisible(false);
    }
  };

  const handleClear = () => {
    const emptyFilters: FilterType = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="w-full">
      <div className="md:hidden mb-4">
        <Button
          onClick={toggleFilter}
          variant="outline"
          className="flex items-center w-full justify-center"
        >
          <SlidersHorizontal size={18} className="mr-2" />
          {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className={`${isFilterVisible ? 'block' : 'hidden'} md:block bg-white p-4 rounded-lg shadow-md sticky top-20`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button
            onClick={handleClear}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={localFilters.search || ''}
                onChange={handleInputChange}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Categories</h4>
              <div className="space-y-2">
                {mockCategories.map(category => (
                  <div key={category} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-1 text-sm rounded-full mr-2 ${
                        localFilters.category === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                      {localFilters.category === category && (
                        <X size={14} className="inline ml-1" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Price Range</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={localFilters.minPrice || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={localFilters.maxPrice || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                name="sortBy"
                value={localFilters.sortBy || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Relevance</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Sort Order */}
            {localFilters.sortBy && (
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  id="sortOrder"
                  name="sortOrder"
                  value={localFilters.sortOrder || 'asc'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
            >
              Apply Filters
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFilter;