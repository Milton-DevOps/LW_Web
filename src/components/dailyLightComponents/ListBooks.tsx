'use client';

import React, { useState, useEffect } from 'react';
import { colors } from '@/constants/colors';
import { bookService } from '@/services/bookService';
import { getUser } from '@/services/authService';
import { Button, Input } from '@/components';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  status: string;
  pages?: number;
  downloads: number;
  uploadedBy?: {
    firstName: string;
    lastName: string;
  };
}

interface EditingBook extends Book {
  publishedDate?: string;
  devotionalDate?: string;
}

const ListBooks: React.FC = () => {
  const colorScheme = colors;
  const user = getUser();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<EditingBook | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getBooks({
        status: filterStatus === 'all' ? '' : filterStatus,
        department: user?.department,
      });

      if (response.success) {
        setBooks(response.books);
      } else {
        setError(response.message || 'Failed to fetch books');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching books');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingId(book._id);
    setEditingData(book as EditingBook);
  };

  const handleSaveEdit = async () => {
    if (!editingData) return;

    try {
      setLoading(true);
      const response = await bookService.updateBook(editingData._id, editingData);

      if (response.success) {
        setBooks(books.map(b => b._id === editingData._id ? response.book : b));
        setEditingId(null);
        setEditingData(null);
      } else {
        setError(response.message || 'Failed to update book');
      }
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating the book');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await bookService.deleteBook(bookId);

      if (response.success) {
        setBooks(books.filter(b => b._id !== bookId));
      } else {
        setError(response.message || 'Failed to delete book');
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the book');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">Manage Books</h1>
        <p style={{ color: colorScheme.textSecondary }} className="mt-2">
          View, edit, and manage your department books
        </p>
      </div>

      {error && (
        <div
          className="p-4 rounded-lg border-l-4"
          style={{
            backgroundColor: '#f8d7da',
            borderColor: '#dc3545',
            color: '#721c24',
          }}
        >
          ✗ {error}
        </div>
      )}

      {/* Filters */}
      <div
        className="p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:flex gap-4"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setSearchTerm('');
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
          aria-label="Filter books by status"
        >
          <option value="all">All Books</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {loading && !editingId ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p>Loading books...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div
          className="p-8 rounded-lg text-center"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <p style={{ color: colorScheme.textSecondary }}>No books found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((book) =>
            editingId === book._id && editingData ? (
              // Edit Mode
              <div
                key={book._id}
                className="p-6 rounded-lg shadow-md"
                style={{ backgroundColor: colorScheme.surface }}
              >
                <h3 className="text-lg font-bold mb-4">Edit Book</h3>
                <div className="space-y-4">
                  <Input
                    type="text"
                    value={editingData.title}
                    onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                    placeholder="Title"
                    fullWidth
                  />
                  <Input
                    type="text"
                    value={editingData.author}
                    onChange={(e) => setEditingData({ ...editingData, author: e.target.value })}
                    placeholder="Author"
                    fullWidth
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingData.description || ''}
                      onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                      placeholder="Description"
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    />
                  </div>
                  <label htmlFor="status-select" className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    id="status-select"
                    value={editingData.status}
                    onChange={(e) => setEditingData({ ...editingData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    aria-label="Book status"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleSaveEdit}
                      variant="primary"
                      disabled={loading}
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingId(null);
                        setEditingData(null);
                      }}
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <div
                key={book._id}
                className="p-6 rounded-lg shadow-md border-l-4"
                style={{
                  backgroundColor: colorScheme.surface,
                  borderColor: book.status === 'published' ? colors.primary : '#ffc107',
                }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{book.title}</h3>
                    <p style={{ color: colorScheme.textSecondary }} className="text-sm">
                      by {book.author}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: book.status === 'published' ? colors.primary : '#ffc107',
                          color: '#fff',
                        }}
                      >
                        {book.status === 'published' ? '✓ Published' : '◯ Draft'}
                      </span>
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: colorScheme.border,
                          color: colorScheme.text,
                        }}
                      >
                        {book.category}
                      </span>
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: colorScheme.border,
                          color: colorScheme.text,
                        }}
                      >
                        ISBN: {book.isbn}
                      </span>
                    </div>
                    {book.description && (
                      <p className="mt-2 text-sm" style={{ color: colorScheme.textSecondary }}>
                        {book.description.substring(0, 100)}
                        {book.description.length > 100 ? '...' : ''}
                      </p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs" style={{ color: colorScheme.textSecondary }}>
                      <span>📄 {book.pages || 'N/A'} pages</span>
                      <span>⬇️ {book.downloads} downloads</span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      onClick={() => handleEdit(book)}
                      variant="primary"
                      className="flex-1 md:flex-none"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(book._id)}
                      variant="secondary"
                      className="flex-1 md:flex-none"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ListBooks;
