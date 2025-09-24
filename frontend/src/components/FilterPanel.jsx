import { useState, useEffect } from 'react';
import { Filter, X, Calendar, MapPin, AlertTriangle, Database } from 'lucide-react';

export default function FilterPanel({ onFilterChange, reports = [] }) {
  const [filters, setFilters] = useState({
    location: '',
    eventType: '',
    dateFrom: '',
    dateTo: '',
    source: '',
    verified: ''
  });

  const [isOpen, setIsOpen] = useState(false);

  
  const eventTypes = [...new Set(reports.map(r => r.hazard_type))].filter(Boolean);
  const sources = [...new Set(reports.map(r => r.platform))].filter(Boolean);
  const locations = [...new Set(reports.map(r => `${r.lat}, ${r.lng}`))].filter(Boolean);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      location: '',
      eventType: '',
      dateFrom: '',
      dateTo: '',
      source: '',
      verified: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Filters
        </h2>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn bg-gray-500 text-white hover:bg-gray-600 text-sm px-3 py-1"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn bg-blue-600 text-white hover:bg-blue-700 text-sm px-3 py-1"
          >
            {isOpen ? 'Hide' : 'Show'} Filters
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Locations</option>
              {locations.slice(0, 10).map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Event Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Event Type
            </label>
            <select
              value={filters.eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Event Types</option>
              {eventTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Database className="w-4 h-4 inline mr-1" />
              Source Platform
            </label>
            <select
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Sources</option>
              {sources.map((source, index) => (
                <option key={index} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Status
            </label>
            <select
              value={filters.verified}
              onChange={(e) => handleFilterChange('verified', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Reports</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Only</option>
            </select>
          </div>

          {/* Date From Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date To Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

