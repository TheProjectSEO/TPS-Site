'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type,
  Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Start writing...', 
  className = '',
  minHeight = '400px'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [savedSelection, setSavedSelection] = useState<Range | null>(null)
  const [isToolbarSticky, setIsToolbarSticky] = useState(false)
  const [lastKnownContent, setLastKnownContent] = useState('')

  // Client-side only initialization
  useEffect(() => {
    setIsClient(true)
    setLastKnownContent(value || '')
  }, [])

  // Initialize editor content only on client
  useEffect(() => {
    if (isClient && editorRef.current) {
      try {
        const currentContent = editorRef.current.innerHTML
        const newContent = value || ''
        
        // Only update if content is different and not empty to avoid cursor issues
        if (currentContent !== newContent && newContent !== lastKnownContent) {
          editorRef.current.innerHTML = newContent
          setLastKnownContent(newContent)
        }
      } catch (error) {
        console.warn('Editor content initialization error:', error)
      }
    }
  }, [isClient, value, lastKnownContent])

  // Handle sticky toolbar only on client
  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      if (toolbarRef.current) {
        try {
          const rect = toolbarRef.current.getBoundingClientRect()
          setIsToolbarSticky(rect.top <= 0)
        } catch (error) {
          // Silently handle any measurement errors
          console.warn('Toolbar measurement error:', error)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClient])

  // Save current selection
  const saveSelection = useCallback(() => {
    if (!isClient) return
    
    try {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        setSavedSelection(selection.getRangeAt(0).cloneRange())
      }
    } catch (error) {
      console.warn('Selection save error:', error)
    }
  }, [isClient])

  // Restore saved selection
  const restoreSelection = useCallback(() => {
    if (!isClient || !savedSelection || !editorRef.current) return
    
    try {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedSelection)
        editorRef.current.focus()
      }
    } catch (error) {
      console.warn('Selection restore error:', error)
    }
  }, [isClient, savedSelection])

  // Get selected text
  const getSelectedText = useCallback(() => {
    if (!isClient) return ''
    
    try {
      const selection = window.getSelection()
      return selection ? selection.toString().trim() : ''
    } catch (error) {
      console.warn('Get selection error:', error)
      return ''
    }
  }, [isClient])

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (!isClient || !editorRef.current) return
    
    try {
      const content = editorRef.current.innerHTML
      if (content !== lastKnownContent) {
        setLastKnownContent(content)
        onChange(content)
      }
    } catch (error) {
      console.warn('Content change error:', error)
    }
  }, [isClient, onChange, lastKnownContent])

  // Execute command with proper focus handling
  const execCommand = useCallback((command: string, value?: string) => {
    if (!isClient || !editorRef.current) return
    
    try {
      editorRef.current.focus()
      
      const success = document.execCommand(command, false, value)
      if (!success) {
        console.warn(`Command ${command} failed`)
      }
      
      // Delay content change to ensure DOM updates
      setTimeout(() => handleContentChange(), 10)
    } catch (error) {
      console.error(`Error executing command ${command}:`, error)
    }
  }, [isClient, handleContentChange])

  // Insert HTML at cursor position
  const insertHTML = useCallback((html: string) => {
    if (!isClient || !editorRef.current) return
    
    try {
      editorRef.current.focus()
      
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html
        const fragment = document.createDocumentFragment()
        
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild)
        }
        
        range.insertNode(fragment)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
        
        // Delay content change to ensure DOM updates
        setTimeout(() => handleContentChange(), 10)
      }
    } catch (error) {
      console.error('HTML insertion error:', error)
    }
  }, [isClient, handleContentChange])

  // Handle link insertion
  const handleLinkClick = useCallback(() => {
    if (!isClient) return
    
    const selectedText = getSelectedText()
    
    if (selectedText) {
      saveSelection()
      setLinkText(selectedText)
    } else {
      setLinkText('')
    }
    
    setLinkUrl('')
    setShowLinkDialog(true)
  }, [isClient, getSelectedText, saveSelection])

  // Insert link
  const insertLink = useCallback(() => {
    if (!linkUrl.trim()) return

    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
    const text = linkText.trim() || url
    
    if (savedSelection && linkText) {
      // Replace selected text with link
      restoreSelection()
      const linkHtml = `<a href="${url}" style="color: rgb(59, 130, 246); text-decoration: underline;" target="_blank" rel="noopener noreferrer">${text}</a>`
      insertHTML(linkHtml)
    } else {
      // Insert new link
      const linkHtml = `<a href="${url}" style="color: rgb(59, 130, 246); text-decoration: underline;" target="_blank" rel="noopener noreferrer">${text}</a>&nbsp;`
      insertHTML(linkHtml)
    }
    
    setLinkUrl('')
    setLinkText('')
    setShowLinkDialog(false)
    setSavedSelection(null)
  }, [linkUrl, linkText, savedSelection, restoreSelection, insertHTML])

  // Handle image insertion
  const handleImageClick = useCallback(() => {
    if (!isClient) return
    
    saveSelection()
    setImageUrl('')
    setImageAlt('')
    setShowImageDialog(true)
  }, [isClient, saveSelection])

  // Insert image
  const insertImage = useCallback(() => {
    if (!imageUrl.trim()) return

    const imageHtml = `<img src="${imageUrl}" alt="${imageAlt || ''}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block;" /><p></p>`
    insertHTML(imageHtml)
    
    setImageUrl('')
    setImageAlt('')
    setShowImageDialog(false)
    setSavedSelection(null)
  }, [imageUrl, imageAlt, insertHTML])

  // Format block elements
  const formatBlock = useCallback((tag: string) => {
    execCommand('formatBlock', `<${tag}>`)
  }, [execCommand])

  // Insert lists
  const insertList = useCallback((ordered: boolean) => {
    execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList')
  }, [execCommand])

  // Text formatting commands
  const formatText = useCallback((command: string) => {
    execCommand(command)
  }, [execCommand])

  // Alignment commands
  const alignText = useCallback((alignment: string) => {
    execCommand(alignment)
  }, [execCommand])

  // Color commands
  const setTextColor = useCallback((color: string) => {
    execCommand('foreColor', color)
  }, [execCommand])

  // Insert horizontal rule
  const insertHR = useCallback(() => {
    insertHTML('<hr style="border: none; border-top: 2px solid #e2e8f0; margin: 2em 0;" /><p></p>')
  }, [insertHTML])

  // Insert blockquote
  const insertBlockquote = useCallback(() => {
    const selectedText = getSelectedText()
    if (selectedText) {
      const quoteHtml = `<blockquote style="border-left: 4px solid #e2e8f0; margin: 1em 0; padding-left: 1em; color: #718096; font-style: italic; background-color: #f7fafc;">${selectedText}</blockquote><p></p>`
      insertHTML(quoteHtml)
    } else {
      formatBlock('blockquote')
    }
  }, [getSelectedText, insertHTML, formatBlock])

  // Insert inline code
  const insertInlineCode = useCallback(() => {
    const selectedText = getSelectedText()
    if (selectedText) {
      const codeHtml = `<code style="background-color: rgb(243, 244, 246); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.875em;">${selectedText}</code>`
      insertHTML(codeHtml)
    } else {
      const codeHtml = `<code style="background-color: rgb(243, 244, 246); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.875em;">code</code>`
      insertHTML(codeHtml)
    }
  }, [getSelectedText, insertHTML])

  // Handle key events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isClient) return
    
    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          formatText('bold')
          break
        case 'i':
          e.preventDefault()
          formatText('italic')
          break
        case 'u':
          e.preventDefault()
          formatText('underline')
          break
        case 'z':
          if (e.shiftKey) {
            e.preventDefault()
            execCommand('redo')
          } else {
            e.preventDefault()
            execCommand('undo')
          }
          break
      }
    }
  }, [isClient, formatText, execCommand])

  // Handle editor input with auto-resize
  const handleInput = useCallback((e: React.FormEvent) => {
    if (!isClient || !editorRef.current) return
    
    try {
      // Auto-resize the editor
      const element = editorRef.current
      element.style.height = 'auto'
      element.style.height = Math.max(parseInt(minHeight), element.scrollHeight) + 'px'
      
      handleContentChange()
    } catch (error) {
      console.warn('Input handling error:', error)
    }
  }, [isClient, handleContentChange, minHeight])

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ]

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
        <div className="bg-gray-50 border-b border-gray-200 p-2 h-12"></div>
        <div 
          className="p-4 text-gray-500 italic"
          style={{ minHeight }}
        >
          Loading editor...
        </div>
      </div>
    )
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Sticky Toolbar */}
      <div 
        ref={toolbarRef}
        className={`bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 z-50 transition-all duration-200 ${
          isToolbarSticky ? 'fixed top-0 left-0 right-0 shadow-md' : ''
        }`}
        style={isToolbarSticky ? { position: 'fixed', top: 0, left: 0, right: 0 } : {}}
      >
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('underline')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatBlock('h1')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatBlock('h2')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatBlock('h3')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => alignText('justifyLeft')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => alignText('justifyCenter')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => alignText('justifyRight')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertList(false)}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertList(true)}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('indent')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Increase Indent"
          >
            →
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('outdent')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Decrease Indent"
          >
            ←
          </Button>
        </div>

        {/* Links and Media */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLinkClick}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImageClick}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>

        {/* Other formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertHR}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertBlockquote}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertInlineCode}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Colors */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <Select onValueChange={setTextColor}>
            <SelectTrigger className="w-12 h-8 p-1">
              <Type className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color} value={color}>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-2" 
                      style={{ backgroundColor: color }}
                    />
                    {color}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('undo')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('redo')}
            className="p-1 h-8 w-8 hover:bg-gray-200"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Spacer for sticky toolbar */}
      {isToolbarSticky && <div style={{ height: '52px' }} />}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleContentChange}
        onKeyDown={handleKeyDown}
        className="p-4 outline-none prose prose-sm max-w-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 overflow-auto resize-none"
        style={{ 
          minHeight,
          maxHeight: 'none',
          height: 'auto'
        }}
        data-placeholder={placeholder}
      />

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkText">Link Text</Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Enter link text"
              />
            </div>
            <div>
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    insertLink()
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowLinkDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={insertLink}
                className="bg-gradient-primary text-white"
              >
                Insert Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    insertImage()
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="imageAlt">Alt Text</Label>
              <Input
                id="imageAlt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Description of the image"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowImageDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={insertImage}
                className="bg-gradient-primary text-white"
              >
                Insert Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: #1a202c;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: #2d3748;
        }
        
        [contenteditable] h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: #4a5568;
        }
        
        [contenteditable] p {
          margin: 0.5em 0;
          line-height: 1.6;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        
        [contenteditable] li {
          margin: 0.25em 0;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e2e8f0;
          margin: 1em 0;
          padding-left: 1em;
          color: #718096;
          font-style: italic;
          background-color: #f7fafc;
        }
        
        [contenteditable] a {
          color: #3182ce;
          text-decoration: underline;
        }
        
        [contenteditable] a:hover {
          color: #2c5282;
        }
        
        [contenteditable] hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 2em 0;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }
        
        [contenteditable] code {
          background-color: rgb(243, 244, 246);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.875em;
        }
      `}</style>
    </div>
  )
}