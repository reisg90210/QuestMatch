import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  UserPlus, 
  CheckCircle2, 
  MessageSquare, 
  ChevronRight,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifications as notificationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.list();
      setNotifications(response.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.quest_id) {
       if (notification.type === 'new_applicant') {
          navigate(`/manage-squad/${notification.quest_id}`);
       } else {
          navigate(`/quests/${notification.quest_id}`);
       }
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_applicant': return <UserPlus size={18} className="text-primary" />;
      case 'application_accepted': return <CheckCircle2 size={18} className="text-green-500" />;
      case 'quest_full': return <AlertCircle size={18} className="text-secondary" />;
      default: return <Bell size={18} className="text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-obsidian">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-obsidian overflow-y-auto pb-32 p-6 font-inter">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-rajdhani font-bold text-white uppercase tracking-tight">Intelligence <span className="text-primary">Feed</span></h1>
        <div className="w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,255,255,0.3)]">
          <Bell size={20} />
        </div>
      </div>

      <div className="grid gap-4 max-w-lg mx-auto">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center opacity-30 flex flex-col items-center"
            >
              <Bell size={64} className="mb-4" />
              <p className="font-bold uppercase tracking-widest text-sm">Quiet in this sector.</p>
            </motion.div>
          ) : (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start ${
                  n.is_read 
                    ? 'bg-surface/30 border-white/5 opacity-60' 
                    : 'bg-surface border-primary/20 shadow-lg shadow-primary/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                   n.is_read ? 'bg-obsidian/40' : 'bg-primary/10'
                }`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${n.is_read ? 'text-slate-400' : 'text-white font-medium'}`}>
                    {n.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                     {!n.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
                     )}
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-700 mt-1" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
