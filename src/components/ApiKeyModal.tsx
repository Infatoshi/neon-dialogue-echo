import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal = ({ isOpen, onClose }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('GROQ_API_KEY', apiKey.trim());
      toast({
        title: "Success",
        description: "API key has been saved",
      });
      onClose();
    }
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('GROQ_API_KEY');
    if (savedKey) setApiKey(savedKey);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-[#00fff2] shadow-[0_0_20px_#00fff2]">
        <DialogHeader>
          <DialogTitle className="text-[#00fff2]">Enter Groq API Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="bg-[#1a1a1a] border-[#00fff2] text-white placeholder:text-gray-400"
          />
          <Button
            type="submit"
            className="w-full bg-[#1a1a1a] border border-[#00fff2] text-[#00fff2] hover:bg-[#00fff2] hover:text-black transition-colors"
          >
            Save API Key
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;