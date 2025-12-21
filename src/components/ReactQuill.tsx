import React from 'react'

// Mock ReactQuill component
interface ReactQuillProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export const ReactQuill: React.FC<ReactQuillProps> = ({ 
  value = '', 
  onChange, 
  placeholder = 'Enter text...',
  className = ''
}) => {
  return (
    <div className={`react-quill-mock ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] resize-y"
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .react-quill-mock .ql-editor {
            min-height: 200px;
          }
        `
      }} />
    </div>
  )
}

export default ReactQuill
