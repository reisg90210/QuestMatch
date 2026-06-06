import React, { useState, useEffect, useRef } from 'react';
import { matches as matchesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, ChevronLeft, Search, MessageSquare } from 'lucide-react';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.id);
      const interval = setInterval(() => fetchMessages(selectedMatch.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedMatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMatches = async () => {
    try {
      const response = await matchesApi.list();
      setMatches(response.data);
    } catch (err) {
      console.error('Failed to fetch matches', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId) => {
    try {
      const response = await matchesApi.getMessages(matchId);
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await matchesApi.sendMessage(selectedMatch.id, newMessage);
      setNewMessage('');
      fetchMessages(selectedMatch.id);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (loading) return <div className="flex-1 bg-background flex items-center justify-center"><div className="w-10 h-10 border-4 border-surface border-t-primary rounded-full animate-spin" /></div>;

  if (selectedMatch) {
    return (
      <div className="flex-1 flex flex-col bg-background h-screen pb-20">
        <div className="flex items-center p-4 bg-surface/80 backdrop-blur-md border-b border-background sticky top-0 z-10">
          <button onClick={() => setSelectedMatch(null)} className="mr-3 text-text-low p-2 hover:bg-background rounded-xl transition">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <img 
              src={selectedMatch.avatar_url || `/assets/avatar-gamer-2.jpg`} 
              className="w-10 h-10 rounded-full object-cover border border-primary"
              alt=""
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
          </div>
          <div className="ml-3">
            <h2 className="text-text-high font-rajdhani font-bold text-lg leading-none uppercase">{selectedMatch.username}</h2>
            <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Online now</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-30 text-text-low">
                <MessageSquare size={48} className="mb-2 text-secondary" />
                <p className="text-sm font-bold uppercase tracking-widest">Start the quest</p>
             </div>
          )}
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender_id === user.id 
                    ? 'bg-primary text-background font-medium rounded-br-none shadow-[0_0_15px_rgba(0,245,255,0.2)]' 
                    : 'bg-surface text-text-high border border-background rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-surface/80 backdrop-blur-md border-t border-background">
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              className="flex-1 px-5 py-3 bg-background border border-surface rounded-full text-text-high placeholder:text-text-low focus:outline-none focus:border-primary transition-colors text-sm"
              placeholder="Send a transmission..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-primary text-background w-12 h-12 rounded-full flex items-center justify-center hover:brightness-110 transition shadow-lg shadow-primary/20"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-6 overflow-y-auto pb-28 font-inter">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-rajdhani font-bold text-text-high uppercase tracking-tight">Your <span className="text-primary">Squad</span></h1>
        <div className="w-10 h-10 rounded-full bg-surface border border-background flex items-center justify-center text-text-low hover:text-primary transition-colors">
          <Search size={20} />
        </div>
      </div>
      
      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center opacity-60">
          <div className="w-48 h-48 mb-6 bg-surface/30 rounded-full flex items-center justify-center">
             <Users size={80} className="text-secondary/50" />
          </div>
          <p className="text-text-low font-bold uppercase tracking-widest text-sm">No squads yet. Keep exploring!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
          {matches.map((match) => (
            <div 
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-background hover:border-primary/50 transition-all cursor-pointer group active:scale-95 shadow-lg shadow-black/20"
            >
              <div className="relative">
                <img 
                  src={match.avatar_url || `/assets/avatar-gamer-2.jpg`} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-background group-hover:border-primary transition-colors"
                  alt={match.username}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary border-4 border-surface" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-text-high font-rajdhani font-bold uppercase tracking-wide text-xl">{match.username}</h3>
                <p className="text-text-low text-xs mt-0.5 font-medium truncate">
                  Ready for some competitive gaming?
                </p>
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-[10px] text-primary font-bold uppercase tracking-tighter px-2 py-0.5 bg-primary/10 rounded-md">New Match</span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-alert shadow-[0_0_10px_rgba(255,0,110,0.5)]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
