/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react'

type Category = {
    id: string;
    name: string;
    createdAt: Date;
}

type Categories = Category[]

const ManageCategories = ({ categories: initialCategories = [] }: { categories?: Categories }) => {
  const [categories, setCategories] = useState<Categories>(initialCategories)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingName, setEditingName] = useState('')
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({})
  const [error, setError] = useState<string | null>(null)

  const createCategory = async (categoryData: { name: string }) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    
    return response.json();
  };

  const updateCategory = async (id: string, categoryData: { name: string }) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    return response.json();
  };

  const deleteCategory = async (id: string) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
    
    return response.json();
  };

  // Helper function to set loading state
  const setLoading = (key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  };

  // Helper function to handle errors
  const handleError = (error: any, defaultMessage: string) => {
    const errorMessage = error?.message || defaultMessage;
    setError(errorMessage);
    console.error('Category operation error:', error);
    
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setLoading('add', true);
    setError(null);

    try {
      // Create category in database
      const newCategoryFromDB = await createCategory({ name: newCategoryName.trim() });
      
      // Add to local state with data from database
      const newCategory: Category = {
        id: newCategoryFromDB.category.id,
        name: newCategoryFromDB.category.name,
        createdAt: new Date(newCategoryFromDB.category.createdAt)
      };
      
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setIsAddingNew(false);
    } catch (error) {
      handleError(error, 'Failed to add category');
    } finally {
      setLoading('add', false);
    }
  };

  // Start editing
  const handleStartEdit = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingName.trim() || !editingId) return;

    setLoading(`edit-${editingId}`, true);
    setError(null);

    try {
      // Update category in database
      const updatedCategoryFromDB = await updateCategory(editingId, { name: editingName.trim() });
    //   console.log(updatedCategoryFromDB)
      // Update local state
      setCategories(categories.map(cat => 
        cat.id === editingId 
          ? { ...cat, name: updatedCategoryFromDB.category.name }
          : cat
      ));
      
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      handleError(error, 'Failed to update category');
    } finally {
      setLoading(`edit-${editingId}`, false);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    setLoading(`delete-${id}`, true);
    setError(null);

    try {
      // Delete from database
      await deleteCategory(id);
      
      // Remove from local state
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      handleError(error, 'Failed to delete category');
    } finally {
      setLoading(`delete-${id}`, false);
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className='min-h-screen mt-16 bg-gray-50'>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Manage Categories</h1>
              <p className="mt-2 text-lg text-gray-600">
                {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
              </p>
            </div>
            <button
              onClick={() => setIsAddingNew(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Category
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Add New Category Form */}
        {isAddingNew && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Category</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                autoFocus
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || loadingStates.add}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loadingStates.add ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loadingStates.add ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false)
                  setNewCategoryName('')
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first category</p>
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Category
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === category.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            autoFocus
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(category.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === category.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleSaveEdit}
                              disabled={!editingName.trim() || loadingStates[`edit-${category.id}`]}
                              className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors p-1"
                              title="Save changes"
                            >
                              {loadingStates[`edit-${category.id}`] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                              title="Cancel editing"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(category)}
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                              title="Edit category"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              disabled={loadingStates[`delete-${category.id}`]}
                              className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors p-1"
                              title="Delete category"
                            >
                              {loadingStates[`delete-${category.id}`] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ManageCategories