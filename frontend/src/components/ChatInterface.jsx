import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Message from './Message';
import ChatInput from './ChatInput';
import VisualizationPanel from './VisualizationPanel';
import { ArrowPathIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(100);
  const [visualizationData, setVisualizationData] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setVisualizationData(null); // Clear previous visualization
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/v1/chat", {
        message: input,
        temperature: temperature,
        max_tokens: maxTokens,
      });

      const { response: responseText, visualization_data } = response.data;
      console.log("\n[FRONTEND LOG] Full API Response received:", JSON.stringify(response.data, null, 2));
      const assistantMessage = { role: "assistant", content: responseText, timestamp: new Date() };
      
      // Update messages and visualization data with the new response
      setMessages(prev => [...prev, assistantMessage]);
      setVisualizationData(visualization_data); // Set new visualization data

    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || "An unknown error occurred.";
      const error_message = { role: "assistant", content: `Error: ${errorMessage}`, timestamp: new Date() };
      setMessages((prev) => [...prev, error_message]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    setVisualizationData(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">LLM Visualization</h1>
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2">
               <span className="text-sm text-gray-600">Temp:</span>
               <input
                 type="range" min="0.1" max="1.5" step="0.1"
                 value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                 className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
               />
               <span className="text-sm font-semibold text-gray-700 w-8">{temperature.toFixed(1)}</span>
             </div>
            <button
              onClick={clearChat}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <ArrowPathIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ChatBubbleLeftRightIcon className="mx-auto h-16 w-16 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">Start a Conversation</h3>
                  <p className="mt-1 text-sm">Ask a question to see the LLM in action.</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => <Message key={index} message={msg} />)
            )}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex max-w-3xl rounded-lg p-4 shadow-sm border bg-gray-50 border-gray-200 rounded-tl-none">
                  <div className="flex-1 overflow-x-auto">
                    <div className="text-sm text-gray-500 animate-pulse">Assistant is typing...</div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSendMessage}
            isLoading={isLoading}
          />
        </div>

        {/* Visualization Panel */}
        <div className="w-full md:w-1/2 lg:w-3/5 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
          <VisualizationPanel data={visualizationData} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
