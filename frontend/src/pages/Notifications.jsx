import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, Plus, MessageCircle, Trash2, ChevronRight } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'accepted',
    content: "Your application to 'Elite Valorant Rank Push' was accepted! Pack your gear.",
    quest_id: 'q1',
    timestamp: '2h ago',
    is_read: false,
    icon: Heart
  },
  {
    id: 2,
    type: 'applicant',
    content: "User 'ShadowSlayer' wants to join your quest: 'Chill Minecraft Building'.",
    quest_id: 'q2',
    sender_id: 'u2',
    timestamp: '5h ago',
    is_read: false,
    icon: Plus
  },
  {
    id: 3,
    type: 'message',
    content: "You have a new message from 'ProGamer123'.",
    match_id: 'm1',
    timestamp: '1d ago',
    is_read: true,
    icon: MessageCircle
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex-1 bg-background min-h-screen pb-28 font-inter">
      <div className="p-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-lg z-10">
        <h1 className="text-4xl font-rajdhani font-bold text-text-high uppercase tracking-tight">
          Activity <span className="text-primary">Feed</span>
        </h1>
        <div className="relative">
          <Bell className="text-text-low w-6 h-6" />
          {notifications.some(n => !n.is_read) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-alert rounded-full border-2 border-background" />
          )}
        </div>
      </div>

      <div className="px-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="relative w-64 h-64 mx-auto mb-6">
               <div className="absolute inset-0 bg-secondary/10 blur-3xl rounded-full animate-pulse" />
               <img src="/src/assets/empty_state_notifications.png" alt="No activity" className="relative z-10 w-full h-full object-contain opacity-80" />
            </div>
            <h2 className="text-2xl font-rajdhani font-bold text-white uppercase tracking-tight">Radio Silence</h2>
            <p className="text-text-low font-medium mt-2 max-w-xs mx-auto">Your comms-link is clear. New signals will appear here as they arrive.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                drag="x"
                dragConstraints={{ left: 0, right: 100 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 80) dismissNotification(notif.id);
                }}
                className={`relative group rounded-2xl overflow-hidden border transition-all ${
                  notif.is_read ? 'bg-surface/40 border-white/5' : 'bg-surface border-primary/20 shadow-lg'
                }`}
              >
                {/* Dismiss Hint Background */}
                <div className="absolute inset-0 bg-alert flex items-center px-6 opacity-0 group-active:opacity-100 transition-opacity">
                  <Trash2 className="text-white w-6 h-6" />
                </div>

                <div className="relative bg-surface p-4 flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${notif.is_read ? 'bg-background text-text-low' : 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,245,255,0.1)]'}`}>
                    <notif.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <p className={`text-sm leading-relaxed ${notif.is_read ? 'text-text-low' : 'text-text-high font-medium'}`}>
                      {notif.content}
                    </p>
                    <span className="text-[10px] text-text-low/50 font-bold uppercase mt-2 block tracking-wider">
                      {notif.timestamp}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-text-low/30 mt-1" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
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
