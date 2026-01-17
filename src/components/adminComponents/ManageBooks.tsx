'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components';
import { colors } from '@/constants/colors';
import { bookService } from '@/services/bookService';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  downloads: number;
  status: 'published' | 'draft' | 'archived';
}

const ManageBooks: React.FC = () => {
  const colorScheme = colors;
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Spirituality',
    downloadUrl: '',
    status: 'published' as 'published' | 'draft' | 'archived',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setFetchLoading(true);
      const response = await bookService.getBooks({ status: 'all', limit: 100 });
      setBooks(response.books || []);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      alert('Failed to fetch books');
    } finally {
      setFetchLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  const handleAddOrEdit = async () => {
    if (!formData.title || !formData.author || !formData.isbn || !formData.category || !formData.downloadUrl) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await bookService.updateBook(editingId, formData);
        alert('Book updated successfully');
        setEditingId(null);
      } else {
        await bookService.createBook(formData);
        alert('Book created successfully');
      }

      await fetchBooks();
      setFormData({ title: '', author: '', isbn: '', category: 'Spirituality', downloadUrl: '', status: 'published' });
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      downloadUrl: '',
      status: book.status,
    });
    setEditingId(book._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        alert('Book deleted successfully');
        await fetchBooks();
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete book');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return '#27ae60';
      case 'draft':
        return '#f39c12';
      case 'archived':
        return '#95a5a6';
      default:
        return '#95a5a6';
    }
  };

  const categories = ['Spirituality', 'Devotional', 'Theology', 'Biography', 'Self-Help'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Manage Books</h1>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ title: '', author: '', isbn: '', category: 'Spirituality', downloadUrl: '', status: 'published' });
          }}
          variant="primary"
          className="w-full sm:w-auto"
        >
          + Add Book
        </Button>
      </div>

      {/* Modal with Blur Background */}
      {showForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setEditingId(null);
              setFormData({ title: '', author: '', isbn: '', category: 'Spirituality', downloadUrl: '', status: 'published' });
            }
          }}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="p-6 rounded-lg shadow-lg space-y-4 w-full max-w-2xl max-h-auto overflow-hidden"
            style={{ backgroundColor: colorScheme.surface }}
          >
          <h2 className="text-xl font-bold">
            {editingId ? 'Edit Book' : 'Add New Book'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Book Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Author Name"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
            <Input
              type="text"
              placeholder="ISBN"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            />
            <select
              title="Book category"
              className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded focus:outline-none focus:border-[#cb4154] transition-colors bg-white text-gray-900"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              title="Book status"
              className="w-full px-4 py-2.5 text-base border-2 border-gray-300 rounded focus:outline-none focus:border-[#cb4154] transition-colors bg-white text-gray-900"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'published' | 'draft' | 'archived',
                })
              }
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex gap-4 mt-6 pt-4 border-t" style={{ borderColor: colorScheme.border }}>
            <Button onClick={handleAddOrEdit} variant="primary" className="flex-1">
              {editingId ? 'Update' : 'Add'}
            </Button>
            <Button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ title: '', author: '', isbn: '', category: 'Spirituality', status: 'published' });
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
        </div>
      )}

      {/* Search Bar */}
      <div>
        <Input
          type="text"
          placeholder="Search books by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Books Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table
          className="w-full border-collapse"
          style={{ backgroundColor: colorScheme.surface }}
        >
          <thead>
            <tr style={{ borderBottom: `1px solid ${colorScheme.border}` }}>
              <th className="px-4 py-3 text-left font-bold">Title</th>
              <th className="px-4 py-3 text-left font-bold">Author</th>
              <th className="px-4 py-3 text-left font-bold">ISBN</th>
              <th className="px-4 py-3 text-left font-bold">Category</th>
              <th className="px-4 py-3 text-left font-bold">Downloads</th>
              <th className="px-4 py-3 text-left font-bold">Status</th>
              <th className="px-4 py-3 text-center font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr
                key={book._id}
                style={{
                  borderBottom: `1px solid ${colorScheme.border}`,
                  backgroundColor: colorScheme.surface,
                }}
                className="hover:opacity-80 transition-opacity"
              >
                <td className="px-4 py-3 font-medium">{book.title}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3 text-sm">{book.isbn}</td>
                <td className="px-4 py-3">{book.category}</td>
                <td className="px-4 py-3 font-medium">{book.downloads}</td>
                <td className="px-4 py-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getStatusColor(book.status) }}
                  >
                    {book.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Button
                      onClick={() => handleEdit(book)}
                      variant="tertiary"
                      size="sm"
                      className="text-xs px-3 py-1"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(book._id)}
                      size="sm"
                      className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <p style={{ color: colorScheme.textSecondary }}>No books found</p>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
