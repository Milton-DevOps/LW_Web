'use client';

import React, { useState } from 'react';
import { colors } from '@/constants/colors';
import { bookService } from '@/services/bookService';
import { getUser } from '@/services/authService';
import { Button, Input } from '@/components';
import styles from './AddBooks.module.css';

const AddBooks: React.FC = () => {
  const colorScheme = colors;
  const user = getUser();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    category: 'General',
    pages: '',
    status: 'draft',
    publishedDate: new Date().toISOString().split('T')[0],
    devotionalDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = ['General', 'Devotional', 'Educational', 'Spiritual', 'Biography', 'Other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.title || !formData.author || !formData.isbn || !formData.category) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (formData.category === 'Devotional' && !formData.devotionalDate) {
        setError('Devotional date is required for Devotional books');
        setLoading(false);
        return;
      }

      const bookData = {
        ...formData,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        department: user?.department,
        downloadUrl: 'N/A', // Will be updated later with file upload
        status: formData.status,
      };

      const response = await bookService.createBook(bookData);

      if (response.success) {
        setSuccess(true);
        setFormData({
          title: '',
          author: '',
          description: '',
          isbn: '',
          category: 'General',
          pages: '',
          status: 'draft',
          publishedDate: new Date().toISOString().split('T')[0],
          devotionalDate: '',
        });

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(response.message || 'Failed to create book');
      }
    } catch (err) {
      console.error('Error creating book:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">Add New Book</h1>
        <p style={{ color: colorScheme.textSecondary }} className="mt-2">
          Create and manage books for your department
        </p>
      </div>

      {success && (
        <div
          className="p-4 rounded-lg border-l-4"
          style={{
            backgroundColor: '#d4edda',
            borderColor: '#28a745',
            color: '#155724',
          }}
        >
          ✓ Book created successfully! You can continue adding more books or manage them from the Books section.
        </div>
      )}

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

      <form onSubmit={handleSubmit}>
        <div
          className="p-6 rounded-lg shadow-md space-y-6"
          style={{ backgroundColor: colorScheme.surface }}
        >
          {/* Title */}
          <Input
            label="Book Title *"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            required
            fullWidth
          />

          {/* Author */}
          <Input
            label="Author *"
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            required
            fullWidth
          />

          {/* ISBN */}
          <Input
            label="ISBN *"
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
            required
            fullWidth
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border transition-colors border-gray-300 bg-white text-gray-900"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border transition-colors border-gray-300 bg-white text-gray-900"
            />
          </div>

          {/* Pages */}
          <Input
            label="Number of Pages"
            type="number"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
            placeholder="Enter number of pages"
            fullWidth
          />

          {/* Devotional Date (conditional) */}
          {formData.category === 'Devotional' && (
            <Input
              label="Devotional Date *"
              type="date"
              name="devotionalDate"
              value={formData.devotionalDate}
              onChange={handleChange}
              required
              fullWidth
            />
          )}

          {/* Published Date */}
          <Input
            label="Published Date"
            type="date"
            name="publishedDate"
            value={formData.publishedDate}
            onChange={handleChange}
            fullWidth
          />

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border transition-colors border-gray-300 bg-white text-gray-900"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <p className="text-xs mt-2 text-gray-600">
              Drafts are not visible to members. Publish when ready to share.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating Book...' : 'Create Book'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData({
                  title: '',
                  author: '',
                  description: '',
                  isbn: '',
                  category: 'General',
                  pages: '',
                  status: 'draft',
                  publishedDate: new Date().toISOString().split('T')[0],
                  devotionalDate: '',
                });
                setError(null);
              }}
              className="flex-1"
            >
              Clear
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBooks;
