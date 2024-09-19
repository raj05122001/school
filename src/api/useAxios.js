import { useState, useEffect } from 'react';
import axiosAPIInstance from './axiosAPIInstance';

const useAxios = ({ url, method, body = null, headers = null, depandancy = [] }) => {
  const [key, setKey] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    setloading(true)
    axiosAPIInstance[method](url, JSON.parse(headers), JSON.parse(body))
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  const reFetch = () => {
    setKey(key + 1);
  }

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers, key, ...depandancy]);

  return { response, error, loading, reFetch: reFetch, setloading };
};

export default useAxios;
