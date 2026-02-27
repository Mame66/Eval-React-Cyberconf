import { useState, useEffect } from 'react';
import { getConferences } from '../services/api';

const useConferences = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConferences = () => {
    setLoading(true);
    setError('');
    getConferences()
      .then((data) => setConferences(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  return { conferences, loading, error, refetch: fetchConferences };
};

export default useConferences;
