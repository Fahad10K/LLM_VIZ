import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ChatInput = ({ value, onChange, onSubmit, isLoading }) => {
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    }
  };

  const handleComposition = (e) => {
    if (e.type === 'compositionend') {
      setIsComposing(false);
    } else {
      setIsComposing(true);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            className="block w-full resize-none border-0 bg-transparent py-3 pl-4 pr-12 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Type your message..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleComposition}
            onCompositionEnd={handleComposition}
            disabled={isLoading}
          />
          <div className="absolute right-0 top-0 flex h-full items-center pr-2">
            <button
              type="button"
              className={`inline-flex items-center justify-center rounded-md p-2 ${
                !value.trim() || isLoading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => value.trim() && onSubmit()}
              disabled={!value.trim() || isLoading}
            >
              <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div>
          Press <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5">Enter</kbd> to send,{' '}
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5">Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
