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

  if (loading) return <div className="flex-1 bg-[#0a0a0f] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#2a2a3e] border-t-[#7c3aed] rounded-full animate-spin" /></div>;

  if (selectedMatch) {
    return (
      <div className="flex-1 flex flex-col bg-[#0a0a0f] h-screen pb-20">
        <div className="flex items-center p-4 bg-[#14141f] border-b border-[#2a2a3e] sticky top-0 z-10">
          <button onClick={() => setSelectedMatch(null)} className="mr-3 text-[#94a3b8] p-2 hover:bg-[#1e1e32] rounded-xl transition">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <img 
              src={selectedMatch.avatar_url || `/assets/avatar-gamer-2.jpg`} 
              className="w-10 h-10 rounded-xl object-cover border border-[#2a2a3e]"
              alt=""
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#14141f]" />
          </div>
          <div className="ml-3">
            <h2 className="text-white font-bold text-sm uppercase tracking-tight">{selectedMatch.username}</h2>
            <p className="text-[#10b981] text-[10px] font-bold uppercase">Online</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0f]">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-30 text-[#94a3b8]">
                <MessageSquare size={48} className="mb-2" />
                <p className="text-sm font-bold uppercase tracking-widest">Start the chat</p>
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
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white rounded-br-none shadow-[0_4px_12px_rgba(124,58,237,0.2)]' 
                    : 'bg-[#1e1e32] text-[#f1f5f9] border border-[#2a2a3e] rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-[#14141f] border-t border-[#2a2a3e]">
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              className="flex-1 px-5 py-3 bg-[#1e1e32] border border-[#2a2a3e] rounded-full text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white w-12 h-12 rounded-full flex items-center justify-center hover:opacity-90 transition shadow-lg shadow-purple-500/20"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0a0a0f] p-6 overflow-y-auto pb-28">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Your Squad</h1>
        <div className="w-10 h-10 rounded-full bg-[#14141f] border border-[#2a2a3e] flex items-center justify-center text-[#94a3b8]">
          <Search size={20} />
        </div>
      </div>
      
      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center opacity-40">
          <img src="/assets/empty-state.svg" className="w-48 h-48 mb-6" alt="Empty" />
          <p className="text-[#94a3b8] font-bold uppercase tracking-widest text-xs">No matches yet. Keep swiping!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
          {matches.map((match) => (
            <div 
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="flex items-center gap-4 p-4 bg-[#14141f] rounded-2xl border border-[#2a2a3e] hover:border-[#7c3aed]/50 transition-all cursor-pointer group active:scale-95"
            >
              <div className="relative">
                <img 
                  src={match.avatar_url || `/assets/avatar-gamer-2.jpg`} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#2a2a3e] group-hover:border-[#7c3aed]/50 transition-colors"
                  alt={match.username}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10b981] border-4 border-[#14141f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-black uppercase tracking-tight text-base">{match.username}</h3>
                <p className="text-[#64748b] text-xs mt-0.5 font-medium truncate">
                  Ready for some competitive gaming?
                </p>
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-[10px] text-[#7c3aed] font-bold uppercase tracking-tighter px-2 py-0.5 bg-[#7c3aed]/10 rounded-md">New Match</span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#ec4899] shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
