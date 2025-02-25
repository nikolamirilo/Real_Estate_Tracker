import React, { useState } from 'react';
import { Offer } from './MapView';

interface FilterProps {
  onFilter: (filteredData: Offer[]) => void;
  data: Offer[];
}

const Filter = ({ onFilter, data }: FilterProps) => {
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

  const handleFilter = () => {
    let filteredData = [...data];

    // Filter by price range
    if (minPrice !== '') {
      filteredData = filteredData.filter((item) => Number(item.price) >= minPrice);
    }
    if (maxPrice !== '') {
      filteredData = filteredData.filter((item) => Number(item.price) <= maxPrice);
    }

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by price
    if (sortOrder) {
      filteredData.sort((a, b) => {
        const priceA = Number(a.price);
        const priceB = Number(b.price);
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    // Pass the filtered and sorted data back to the parent component
    onFilter(filteredData);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price Range</label>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            placeholder="Min Price (optional)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Max Price (optional)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Search Details</label>
        <input
          type="text"
          placeholder="Search by details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Sort by Price</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | '')}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
        >
          <option value="">No Sorting</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      <button
        onClick={handleFilter}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;