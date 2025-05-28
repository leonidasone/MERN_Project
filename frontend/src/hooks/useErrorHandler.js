import { useState } from 'react'

export const useErrorHandler = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAsync = async (asyncFunction) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await asyncFunction()
      return result
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      console.error('API Error:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 400:
          return 'Bad Request: Please check your input and try again.'
        case 401:
          return 'Unauthorized: Please log in to continue.'
        case 403:
          return 'Forbidden: You do not have permission to perform this action.'
        case 404:
          return 'Not Found: The requested resource could not be found.'
        case 500:
          return 'Server Error: Please try again later or contact support.'
        default:
          return error.response.data?.message || 'An unexpected error occurred.'
      }
    } else if (error.request) {
      // Network error
      return 'Network Error: Please check your internet connection and try again.'
    } else {
      // Other error
      return error.message || 'An unexpected error occurred.'
    }
  }

  const clearError = () => setError(null)

  return {
    error,
    isLoading,
    handleAsync,
    clearError
  }
}

export default useErrorHandler
