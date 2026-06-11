import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  UserPlus,
  CheckCircle2,
  ChevronRight,
  Trash2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifications as notificationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import emptyNotifications from '../assets/empty_state_notifications.png';

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

  const dismissNotification = async (id) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      // Optionally call API to delete notification if available
      // await notificationsApi.remove(id);
    } catch (err) {
      console.error('Failed to dismiss notification:', err);
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
      case 'new_applicant': return <UserPlus size={20} className="text-primary" />;
      case 'application_accepted': return <CheckCircle2 size={20} className="text-green-500" />;
      case 'quest_full': return <AlertCircle size={20} className="text-secondary" />;
      case 'elite_access': return <Zap size={20} className="text-primary fill-primary" />;
      default: return <Bell size={20} className="text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background overflow-y-auto pb-40 font-inter">
      <div className="p-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-lg z-10">
        <h1 className="text-4xl font-rajdhani font-bold text-white uppercase tracking-tight">
          Intelligence <span className="text-primary">Feed</span>
        </h1>
        <div className="relative w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,245,255,0.2)]">
          <Bell size={20} />
          {notifications.some(n => !n.is_read) && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-alert rounded-full border-2 border-background" />
          )}
        </div>
      </div>

      <div className="px-4 space-y-3 max-w-lg mx-auto">
        <AnimatePresence mode="popLayout" initial={false}>
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="relative w-64 h-64 mx-auto mb-6">
                 <div className="absolute inset-0 bg-secondary/10 blur-3xl rounded-full animate-pulse" />
                 <img 
                   src={emptyNotifications} 
                   alt="No activity" 
                   className="relative z-10 w-full h-full object-contain opacity-80" 
                 />
              </div>
              <h2 className="text-2xl font-rajdhani font-bold text-white uppercase tracking-tight">Radio Silence</h2>
              <p className="text-text-low font-medium mt-2 max-w-xs mx-auto text-sm">Your comms-link is clear. New signals will appear here as they arrive.</p>
            </motion.div>
          ) : (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 200 }}
                drag="x"
                dragConstraints={{ left: 0, right: 150 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 100) dismissNotification(n.id);
                }}
                className={`relative group rounded-2xl overflow-hidden border transition-all cursor-pointer ${
                  n.is_read ? 'bg-surface/40 border-white/5' : 'bg-surface border-primary/20 shadow-lg shadow-primary/5'
                }`}
              >
                {/* Dismiss Hint Background */}
                <div className="absolute inset-0 bg-alert flex items-center px-6 opacity-0 group-active:opacity-100 transition-opacity">
                  <Trash2 className="text-white w-6 h-6" />
                </div>

                <div 
                  onClick={() => handleNotificationClick(n)}
                  className="relative bg-surface p-4 flex items-start gap-4 transition-transform active:translate-x-2"
                >
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${n.is_read ? 'bg-background text-text-low' : 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,245,255,0.1)]'}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
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
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 0 && (
        <div className="p-6 text-center">
           <p className="text-[10px] text-text-low/30 font-black uppercase tracking-[0.2em]">
             Swipe right to dismiss
           </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
