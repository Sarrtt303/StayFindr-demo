import { useState, useEffect, useCallback } from 'react';

export const useListings = (initialFilters = {}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const buildQueryParams = (params) => {
    const query = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== '') {
        query.append(key, params[key]);
      }
    }
    return query.toString();
  };

  const fetchListings = useCallback(async (filters = {}, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = reset ? 1 : page;
      const combinedFilters = { ...initialFilters, ...filters, page: currentPage };
      const query = buildQueryParams(combinedFilters);

      const res = await fetch(`/api/listings?${query}`);
      if (!res.ok) throw new Error('Failed to fetch listings');

      const data = await res.json();

      const newListings = data.listings || [];
      const total = data.totalCount || 0;

      setListings(prev => reset ? newListings : [...prev, ...newListings]);
      setTotalCount(total);
      setHasMore((currentPage * (filters.limit || 12)) < total);

      if (!reset) {
        setPage(prev => prev + 1);
      } else {
        setPage(2);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [initialFilters, page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchListings();
    }
  };

  const refetch = (newFilters = {}) => {
    setPage(1);
    fetchListings(newFilters, true);
  };

  useEffect(() => {
    fetchListings({}, true);
  }, []);

  return {
    listings,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    refetch,
  };
};
