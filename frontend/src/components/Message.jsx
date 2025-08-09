import React from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { UserIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

// Using basic dark theme instead of specific prism styles
const codeStyle = {
  backgroundColor: '#1e1e1e',
  color: '#d4d4d4',
  padding: '1rem',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  lineHeight: '1.25rem'
};

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  const Icon = isUser ? UserIcon : ChatBubbleLeftRightIcon;
  const bgColor = isUser ? 'bg-blue-50' : 'bg-gray-50';
  const textColor = isUser ? 'text-blue-800' : 'text-gray-800';
  const borderColor = isUser ? 'border-blue-200' : 'border-gray-200';

  let content = message.content;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`flex max-w-3xl rounded-lg p-4 shadow-sm border ${bgColor} ${borderColor} ${
          isUser ? 'rounded-tr-none' : 'rounded-tl-none'
        }`}
      >
        <div className={`flex-shrink-0 mr-3 mt-0.5`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex-1 overflow-x-auto">
          <div className={`text-sm font-medium mb-1 ${textColor}`}>
            {isUser ? 'You' : 'Personal Assistant'}
          </div>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={codeStyle}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
