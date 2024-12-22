import { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import ApiKeyModal from '../components/ApiKeyModal';

const Index = () => {
  const [showApiModal, setShowApiModal] = useState(false);

  useEffect(() => {
    const apiKey = localStorage.getItem('GROQ_API_KEY');
    if (!apiKey) {
      setShowApiModal(true);
    }
  }, []);

  return (
    <>
      <ChatInterface />
      <ApiKeyModal 
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
      />
    </>
  );
};

export default Index;