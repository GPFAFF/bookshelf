import { useEffect, useReducer } from 'react';
import { client } from './api-client'

const useAsync = () => {
  const bookReducer = (state, action) => {
    switch (action.type) {
      case 'idle':
        return {
          ...state,
          status: 'idle',
        }
      case 'loading':
        return {
          ...state,
          loading: true,
          query: action.query,
          queried: action.queried,
          status: 'loading'
        }
      case 'success':
        return {
          ...state,
          loading: false,
          data: action.data,
          query: '',
          queried: false,
          status: 'success'
        }
      case 'error':
        return {
          error: action.error,
          status: 'error'
        }
      default: {
        return state;
      }
    }
  }

  const initialState = {
    data: null,
    query: '',
    queried: false,
    status: 'idle',
    error: null,
  }

  const [reducerState, dispatch] = useReducer(bookReducer, initialState);
  const { data, query, queried, status, error } = reducerState;

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  useEffect(() => {
    if (!queried) return;
    const getData = async () => {

      const response = await client(`books?query=${encodeURIComponent(query)}`);
      console.log(response);
      !response.status
        ? dispatch({ type: 'success', data: response })
        : dispatch({ type: 'error', error: response.message })
    }
    getData();
  }, [query, queried])


  return {
    data,
    dispatch,
    error,
    isError,
    isLoading,
    isSuccess,
    status,
  }
}

export { useAsync }