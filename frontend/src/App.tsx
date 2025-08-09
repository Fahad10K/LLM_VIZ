import { ChatProvider } from './contexts/ChatContext';
import ChatInterface from './components/ChatInterface';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ChatProvider>
      <div className="h-screen bg-gray-50">
        <ChatInterface />
        <Toaster position="bottom-right" />
      </div>
    </ChatProvider>
  );
}

export default App;
