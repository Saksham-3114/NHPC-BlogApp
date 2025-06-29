/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useMemo } from 'react'
import { createBlogAction, editBlogAction } from '@/app/actions/editorAction'
import { toast } from 'sonner'
import { X, Upload, Plus, FileText, Tag, Image as ImageIcon } from 'lucide-react'

import Editor from '@/components/editor/editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as z from "zod"

type data = {
  title: string,
  category: string,
  summary: string,
  content: string,
  tags: string[],
  featureImage: string,
  username: string,
  postId: string,
}

const BlogFormSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters long")
    .trim(),
  category: z.string()
    .min(1, "Category is required"),
  summary: z.string()
    .min(10, "Summary must be at least 10 characters")
    .max(300, "Summary must be at most 300 characters"),
  tags: z.array(z.string())
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed"),
  content: z.string()
    .min(1, "Content is required")
})

// Default empty editor value for Novel
export const defaultValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: []
    }
  ]
}

// Function to convert HTML string to Novel/TipTap JSON format
const htmlToNovelContent = (html: string) => {
  if (!html || html.trim() === '') {
    return defaultValue;
  }
  
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const content: any[] = [];
    
    const processNode = (node: Node): any => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          return {
            type: 'text',
            text: text
          };
        }
        return null;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        
        switch (tagName) {
          case 'p':
            const pContent: any[] = [];
            element.childNodes.forEach(child => {
              const processed = processNode(child);
              if (processed) {
                if (Array.isArray(processed)) {
                  pContent.push(...processed);
                } else {
                  pContent.push(processed);
                }
              }
            });
            return {
              type: 'paragraph',
              content: pContent.length > 0 ? pContent : []
            };
            
          case 'h1':
            return {
              type: 'heading',
              attrs: { level: 1, class: 'text-4xl font-bold' },
              content: [{ type: 'text', text: element.textContent || '' }]
            };
            
          case 'h2':
            return {
              type: 'heading',
              attrs: { level: 2, class: 'text-2xl font-bold'  },
              content: [{ type: 'text', text: element.textContent || '' }]
            };
            
          case 'h3':
            return {
              type: 'heading',
              attrs: { level: 3, class: 'text-xl font-bold' },
              content: [{ type: 'text', text: element.textContent || '' }]
            };
            
          case 'strong':
          case 'b':
            return {
              type: 'text',
              text: element.textContent || '',
              marks: [{ type: 'bold' }]
            };
            
          case 'em':
          case 'i':
            return {
              type: 'text',
              text: element.textContent || '',
              marks: [{ type: 'italic' }]
            };
            
          case 'ul':
            const ulItems: any[] = [];
            element.querySelectorAll('li').forEach(li => {
              ulItems.push({
                type: 'listItem',
                content: [{
                  type: 'paragraph',
                  content: [{ type: 'text', text: li.textContent || '' }]
                }]
              });
            });
            return {
              type: 'bulletList',
              content: ulItems
            };
            
          case 'ol':
            const olItems: any[] = [];
            element.querySelectorAll('li').forEach(li => {
              olItems.push({
                type: 'listItem',
                content: [{
                  type: 'paragraph',
                  content: [{ type: 'text', text: li.textContent || '' }]
                }]
              });
            });
            return {
              type: 'orderedList',
              content: olItems
            };
            
          case 'blockquote':
            return {
              type: 'blockquote',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: element.textContent || '' }]
              }]
            };
            
          case 'br':
            return {
              type: 'hardBreak'
            };

            case 'a':
  return {
    type: 'text',
    text: element.textContent || '',
    marks: [{ 
      type: 'link', 
      attrs: { href: element.getAttribute('href') || '' }
    }]
  };

case 'img':
  return {
    type: 'image',
    attrs: {
      src: element.getAttribute('src') || '',
      alt: element.getAttribute('alt') || ''
    }
  };
            
          default:
            const text = element.textContent?.trim();
            if (text) {
              return {
                type: 'text',
                text: text
              };
            }
            return null;
        }
      }
      
      return null;
    };
    tempDiv.childNodes.forEach(node => {
      const processed = processNode(node);
      if (processed) {
        content.push(processed);
      }
    });
    if (content.length === 0) {
      return defaultValue;
    }
    
    return {
      type: 'doc',
      content: content
    };
    
  } catch (error) {
    console.error('Error parsing HTML to Novel content:', error);
    return defaultValue;
  }
}

type Post = {
  title: string;
  summary: string | null;
  tags: string[];
  content: string;
  image: string;
  id: string;
  createdAt: Date;
  authorId: string;
  published: 'true' | 'false' | 'reject';
  categoryId: string;
}

interface ContentFormProps {
  username: string;
  categories?: Array<{ id: string; name: string }>;
  post: Post | null;
}

export default function EditContentForm({ username, categories = [], post }: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    category: post?.categoryId || '',
    summary: post?.summary || '',
    content: post?.content || '',
  })
  const [tags, setTags] = useState<string[]>(post?.tags as string[] || [])
  const [tagInput, setTagInput] = useState('')
  const [featureImage, setFeatureImage] = useState(post?.image || '')
  const [imagePreview, setImagePreview] = useState<string | null>(post?.image || null)
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})


  const initialEditorValue = useMemo(() => {
    if (post?.content) {
      return htmlToNovelContent(post.content);
    }
    return defaultValue;
  }, [post?.content]);

  // Handle feature image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (response.ok) {
          // Handle successful upload if needed
          // const result = await response.json();
        }
      } catch (error) {
        toast.error('Failed to upload image');
        return;
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFeatureImage(e.target?.result as string);
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove feature image
  const removeImage = () => {
    setFeatureImage('')
    setImagePreview(null)
  }

  // Add tag
  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Validate form data
  const validateFormData = () => {
    try {
      const validationData = {
        title: formData.title.trim(),
        category: formData.category,
        summary: formData.summary.trim(),
        tags,
        content: formData.content,
        featureImage
      }
      
      BlogFormSchema.parse(validationData)
      setErrors({})
      return true
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        e.errors.forEach((error) => {
          const field = error.path[0] as string
          fieldErrors[field] = error.message
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateFormData()) {
      toast.error('Please fix the validation errors')
      return
    }

    setPending(true)

    try {
      const submitData: data = {
        title: formData.title.trim(),
        category: formData.category,
        summary: formData.summary.trim(),
        content: formData.content,
        tags: tags,
        featureImage: featureImage,
        username: username,
        postId: post?.id as string
      }

      const result = await editBlogAction(submitData)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Blog edited successfully!")
      }
    } catch (error) {
      toast.error('Failed to edit blog. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50/30'>
      <div className='mx-auto max-w-4xl px-4 py-12'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='text-3xl font-light text-gray-900 tracking-tight'>Edit Blog Post</h1>
          <p className='mt-3 text-gray-600 font-light'></p>
        </div>

        {/* Form Container */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8 lg:p-12'>
          <div className='space-y-10'>
            
            {/* Title Section */}
            <div className='space-y-3'>
              <div className='flex items-center gap-2 mb-4'>
                <FileText className="w-5 h-5 text-gray-400" />
                <Label className="text-base font-medium text-gray-900">Title</Label>
                <span className='text-red-400'>*</span>
              </div>
              <Input
                type='text'
                placeholder='What would you like to write about?'
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`text-lg h-12 border-0 border-b-2 rounded-none bg-transparent px-0 focus:ring-0 transition-colors ${
                  errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm font-light">{errors.title}</p>}
            </div>

            {/* Category & Feature Image Row */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
              
              {/* Category */}
              <div className='space-y-3'>
                <Label className="text-base font-medium text-gray-900 flex items-center gap-2">
                  Category <span className='text-red-400'>*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className={`h-12 border-2 rounded-lg ${errors.category ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}>
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm font-light">{errors.category}</p>}
              </div>

              {/* Feature Image */}
              <div className='space-y-3'>
                <Label className="text-base font-medium text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  Feature Image
                </Label>
                
                {!imagePreview ? (
                  <div 
                    onClick={() => document.getElementById('featureImage')?.click()}
                    className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-light">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">Max 5MB • JPG, PNG, WebP</span>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Feature image preview"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <Input
                  id="featureImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Summary */}
            <div className='space-y-3'>
              <Label className="text-base font-medium text-gray-900">Summary <span className='text-red-400'>*</span></Label>
              <Textarea
                placeholder='Write a compelling summary that captures the essence of your post...'
                value={formData.summary}
                onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                rows={4}
                maxLength={300}
                className={`resize-none border-2 rounded-lg ${errors.summary ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`}
              />
              <div className="flex justify-between items-center">
                {errors.summary ? (
                  <p className="text-red-500 text-sm font-light">{errors.summary}</p>
                ) : (
                  <span className="text-sm text-gray-500 font-light">This will appear in blog previews and search results</span>
                )}
                <span className={`text-sm font-light ${formData.summary.length > 270 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.summary.length}/300
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Tag className="w-5 h-5 text-gray-400" />
                <Label className="text-base font-medium text-gray-900">Tags</Label>
                <span className='text-red-400'>*</span>
              </div>
              
              <div className="flex gap-3">
                <Input
                  type='text'
                  placeholder='Type a tag and press Enter...'
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 h-11 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 10}
                  variant="outline"
                  className="h-11 px-4 border-2 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Display Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-light border border-blue-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm">
                {errors.tags ? (
                  <p className="text-red-500 font-light">{errors.tags}</p>
                ) : (
                  <span className="text-gray-500 font-light">Add relevant tags to help readers discover your content</span>
                )}
                <span className="text-gray-400 font-light">{tags.length}/10</span>
              </div>
            </div>

            {/* Content Editor */}
            <div className='space-y-4'>
              <Label className="text-base font-medium text-gray-900">Content <span className='text-red-400'>*</span></Label>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors">
                <Editor 
                  initialValue={initialEditorValue} 
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))} 
                />
              </div>
              {errors.content && <p className="text-red-500 text-sm font-light">{errors.content}</p>}
            </div>
          </div>
          
          {/* Submit Section */}
          <div className='mt-12 pt-8 border-t border-gray-100'>
            <div className='flex flex-col sm:flex-row gap-4 justify-between items-center'>
              <p className='text-sm text-gray-500 font-light'>
                Your post will be reviewed before publication
              </p>
              <Button 
                onClick={handleSubmit} 
                disabled={pending}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 h-auto text-base font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50"
              >
                {pending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  'Submit for Review'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}