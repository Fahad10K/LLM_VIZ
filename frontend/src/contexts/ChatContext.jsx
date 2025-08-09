import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);

  // Initialize model info
  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/model/info`);
        setModelInfo(response.data);
      } catch (err) {
        console.error('Error fetching model info:', err);
        setError('Failed to load model information');
      }
    };

    fetchModelInfo();
  }, []);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/chat`,
        {
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
          temperature,
          max_tokens: maxTokens,
        }
      );

      const assistantMessage = {
        ...response.data.message,
        timestamp: new Date().toISOString(),
        visualization: response.data.visualization,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setVisualizationData(response.data.visualization);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.detail || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, temperature, maxTokens]);

  const clearChat = () => {
    setMessages([]);
    setVisualizationData(null);
    setError(null);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        input,
        setInput,
        isLoading,
        error,
        modelInfo,
        visualizationData,
        temperature,
        setTemperature,
        maxTokens,
        setMaxTokens,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
