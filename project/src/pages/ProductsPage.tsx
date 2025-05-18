import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductFilter as FilterType, Product } from '../types';
import { productApi } from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize filters from URL search params
  const getInitialFilters = (): FilterType => {
    const filters: FilterType = {};
    
    if (searchParams.has('search')) {
      filters.search = searchParams.get('search') || undefined;
    }
    
    if (searchParams.has('category')) {
      filters.category = searchParams.get('category') || undefined;
    }
    
    if (searchParams.has('minPrice')) {
      const minPrice = searchParams.get('minPrice');
      filters.minPrice = minPrice ? parseFloat(minPrice) : undefined;
    }
    
    if (searchParams.has('maxPrice')) {
      const maxPrice = searchParams.get('maxPrice');
      filters.maxPrice = maxPrice ? parseFloat(maxPrice) : undefined;
    }
    
    if (searchParams.has('sortBy')) {
      filters.sortBy = searchParams.get('sortBy') as FilterType['sortBy'] || undefined;
    }
    
    if (searchParams.has('sortOrder')) {
      filters.sortOrder = searchParams.get('sortOrder') as FilterType['sortOrder'] || undefined;
    }
    
    return filters;
  };
  
  const [filters, setFilters] = useState<FilterType>(getInitialFilters());
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getProducts(filters);
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters]);
  
  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    
    // Update URL with new filters
    const newSearchParams = new URLSearchParams();
    
    if (newFilters.search) {
      newSearchParams.set('search', newFilters.search);
    }
    
    if (newFilters.category) {
      newSearchParams.set('category', newFilters.category);
    }
    
    if (newFilters.minPrice !== undefined) {
      newSearchParams.set('minPrice', newFilters.minPrice.toString());
    }
    
    if (newFilters.maxPrice !== undefined) {
      newSearchParams.set('maxPrice', newFilters.maxPrice.toString());
    }
    
    if (newFilters.sortBy) {
      newSearchParams.set('sortBy', newFilters.sortBy);
    }
    
    if (newFilters.sortOrder) {
      newSearchParams.set('sortOrder', newFilters.sortOrder);
    }
    
    setSearchParams(newSearchParams);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <ProductFilter 
              onFilterChange={handleFilterChange} 
              activeFilters={filters}
            />
          </div>
          
          <div className="w-full md:w-3/4">
            <ProductGrid 
              products={products} 
              loading={loading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;