import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('GROQ_API_KEY'),
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [...messages, userMessage],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white p-4">
      <div className="flex-1 overflow-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg animate-fade-in ${
              message.role === 'user'
                ? 'bg-[#1a1a1a] border border-[#00fff2] shadow-[0_0_10px_#00fff2]'
                : 'bg-[#1a1a1a] border border-[#ff00ff] shadow-[0_0_10px_#ff00ff]'
            }`}
          >
            <div className="font-mono">
              {message.role === 'user' ? '>' : '<'} {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin text-[#00fff2]" />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-[#1a1a1a] border-[#00fff2] text-white placeholder:text-gray-400 focus:ring-[#00fff2] focus:border-[#00fff2] shadow-[0_0_5px_#00fff2]"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#1a1a1a] border border-[#00fff2] text-[#00fff2] hover:bg-[#00fff2] hover:text-black transition-colors shadow-[0_0_5px_#00fff2]"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;