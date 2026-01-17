import { getToken } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface BookParams {
  [key: string]: string | number | boolean;
}

interface BookData {
  [key: string]: any;
}

export const bookService = {
  // Get all books with pagination and filtering
  async getBooks(params: BookParams = {}) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();
      const response = await fetch(`${API_BASE_URL}/books?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  // Get book by ID
  async getBookById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch book');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  },

  // Create book
  async createBook(bookData: BookData) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create book');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  // Update book
  async updateBook(id: string, bookData: BookData) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update book');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  // Delete book
  async deleteBook(id: string) {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete book');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  // Get book statistics
  async getBookStats() {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_BASE_URL}/books/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch book statistics');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching book statistics:', error);
      throw error;
    }
  },
};