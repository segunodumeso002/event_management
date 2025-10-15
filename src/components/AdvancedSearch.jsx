import { useState } from 'react';

const initialFilters = {
  keyword: '',
  category: '',
  location: '',
  dateFrom: '',
  dateTo: '',
  priceMin: '',
  priceMax: '',
  sortBy: 'date'
};

const AdvancedSearch = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onReset();
  };

  return (
    <div className="advanced-search glass-card">
      <h3>🔍 Advanced Search</h3>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-row">
          <input
            type="text"
            name="keyword"
            placeholder="Search events..."
            value={filters.keyword}
            onChange={handleInputChange}
            className="search-input"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="search-select"
          >
            <option value="">All Categories</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="networking">Networking</option>
            <option value="social">Social</option>
            <option value="sports">Sports</option>
            <option value="music">Music</option>
            <option value="business">Business</option>
            <option value="religion">Religion</option>
          </select>
        </div>

        <div className="search-row">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleInputChange}
            className="search-input"
          />
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="search-select"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        <div className="search-row">
          <div className="date-range">
            <label>From:</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
          <div className="date-range">
            <label>To:</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="search-row">
          <div className="price-range">
            <label>Price Range:</label>
            <input
              type="number"
              name="priceMin"
              placeholder="Min $"
              value={filters.priceMin}
              onChange={handleInputChange}
              className="search-input"
            />
            <input
              type="number"
              name="priceMax"
              placeholder="Max $"
              value={filters.priceMax}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="search-buttons">
          <button type="submit" className="btn btn-primary">
            Search Events
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;