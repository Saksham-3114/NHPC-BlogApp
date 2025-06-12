'use client'

import { useState } from 'react'
import { createBlogAction } from '@/app/actions/editorAction'
import { toast } from 'sonner'

import Editor from '@/components/editor/editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CategoryDisplay from '@/app/(root)/component/catDisplay'
import * as z from "zod"
import CategoryInput from '@/app/(root)/component/catInput'

const BlogFormSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters long")
    .trim(),
  categories: z.array(z.string())
    .min(1, "At least one category is required")
    .max(5, "Maximum 5 categories allowed"),
  content: z.string()
    .min(1, "Content is required")
})



export const defaultValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
      type: 'text',
      text: "Press '/' for Options or Write something...."
    }
      ]
    }
  ]
}
 
export default function ContentForm({username}:{username:string}) {
  const [titleerrors, settitleErrors] = useState('');
  const [contenterrors, setcontentErrors] = useState('');
  const [categoryerrors, setcategoryErrors] = useState('');
  const validateFormData = () => {
  try {
    const formData = {
      title: title.trim(),
      categories,
      content,
      categoryInput: input
    }
    
    BlogFormSchema.parse(formData) // This validates the data
    settitleErrors('');
    setcontentErrors('');
    setcategoryErrors('');
    return true
  } catch (e) {
    // Handle validation errors
    console.log(e)
    return false
  }
}


  // console.log(username)
  const [title, setTitle] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [input,setInput] = useState('');
  const [content, setContent] = useState<string>('')
  const [pending, setPending] = useState(false)

 const addCategory = () => {
    if (input.trim() && !categories.includes(input.trim())) {
      setCategories([...categories, input.trim()]);
      setInput('');
    } 
  };

  const removeCategory = () => {
    setCategories(categories.filter((c) => c !== input.trim()));
    setInput('');
  };


  async function handleSubmit() {
    // validate the data
    if (!validateFormData()) {
      settitleErrors('Title is Required and must be atmost 100 characters long')
      setcategoryErrors('Atleast 1 and Atmost 5 categories allowed')
      setcontentErrors('Content Required')
      return // Stop if validation fails
  }

    setPending(true)

    const result = await createBlogAction({ title, categories, content, username })

    if (result?.error) {
      toast.error(result.error)
    }
    toast.success("Blog Submitted Successfully")
    setPending(false)
  }

  return (
    <div className='mt-6 flex max-w-2xl flex-col gap-4'>
      <div className='flex gap-4'>
        <Input
          type='text'
          placeholder='Title'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        
        <CategoryInput
          value={input}
          onChange={(value) => setInput(value)}
          onAdd={addCategory}
          existingCategories={categories}
          disabled={pending}
        />
         <Button onClick={addCategory} className="bg-blue-500 hover:bg-blue-300 cursor-pointer text-white px-3 py-1 rounded">
          Add
        </Button>
         <Button onClick={removeCategory} className="bg-red-500 hover:bg-red-300 cursor-pointer text-white px-3 py-1 rounded">
          Remove
        </Button>
      </div>
      {titleerrors && (
  <p className="text-red-500 text-sm ">{titleerrors}</p>
)}
        <CategoryDisplay categories={categories}/>
         {categoryerrors && (
  <p className="text-red-500 text-sm">{categoryerrors}</p>
)}

      <Editor initialValue={defaultValue} onChange={setContent} />
       {contenterrors && (
  <p className="text-red-500 text-sm">{contenterrors}</p>
)}
      <Button onClick={handleSubmit} disabled={pending}>
        {pending ? 'Submitting...' : 'Create'}
      </Button>
    </div>
  )
}