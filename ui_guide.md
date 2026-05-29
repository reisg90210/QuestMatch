# QuestMatch — UI/UX Design Guide

## Design Philosophy

QuestMatch is a **dark, neon-infused** swiping app for gamers. The visual language blends:
- **Esports aesthetics** — dark backgrounds, neon accents, high contrast
- **Dating app UX** — familiar swipe cards, match animations, clean chat UI
- **Gaming culture** — RGB lighting motifs, game-specific thumbnails, platform badges

---

## 🎨 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#0a0a0f` | Main app background |
| `bg-secondary` | `#14141f` | Cards, modals, sections |
| `bg-card` | `#1a1a2e` | Swipe profile cards |
| `bg-input` | `#1e1e32` | Input fields |
| `accent-purple` | `#7c3aed` | Primary CTA, active tabs |
| `accent-cyan` | `#06b6d4` | Secondary accent, badges |
| `accent-pink` | `#ec4899` | Match animation, "like" heart |
| `accent-green` | `#10b981` | Online status, "Pro" badge |
| `text-primary` | `#f1f5f9` | Primary text |
| `text-secondary` | `#94a3b8` | Secondary text, hints |
| `text-muted` | `#64748b` | Disabled text |
| `border-subtle` | `#2a2a3e` | Card borders, dividers |
| `danger-red` | `#ef4444` | Dislike/delete, errors |

### Gradient Palette
```css
--gradient-primary: linear-gradient(135deg, #7c3aed, #06b6d4);
--gradient-match: linear-gradient(135deg, #7c3aed, #ec4899);
--gradient-card: linear-gradient(180deg, #1a1a2e 0%, #14141f 100%);
```

---

## 🖼️ Asset Inventory

All assets saved in `/home/team/shared/assets/`:

| File | Type | Usage |
|------|------|-------|
| `questmatch-logo.png` | App icon (1024x1024) | Navbar, onboarding, favicon |
| `hero-bg.jpg` | Hero background (1536x1024) | Landing/onboarding screen |
| `avatar-gamer-1.jpg` | Default avatar (1024x1024) | User profile fallback |
| `avatar-gamer-2.jpg` | Default avatar (1024x1024) | User profile fallback |
| `avatar-gamer-3.jpg` | Default avatar (1024x1024) | User profile fallback |
| `avatar-gamer-4.jpg` | Default avatar (1024x1024) | User profile fallback |
| `apex-thumbnail.jpg` | Game thumb (1536x1024) | Game selector cards |
| `valorant-thumbnail.jpg` | Game thumb (1536x1024) | Game selector cards |
| `cod-thumbnail.jpg` | Game thumb (1536x1024) | Game selector cards |
| `fortnite-thumbnail.jpg` | Game thumb (1536x1024) | Game selector cards |
| `empty-state.svg` | Empty state illustration | "No matches" / "No results" |

---

## 📱 App Screens & Component Design

### 1. Onboarding / Auth Screens
- **Theme**: Full-screen gradient background (`bg-primary`), animated particles
- **Logo**: Centered `questmatch-logo.png`, 120px width
- **Tagline**: "Find Your Perfect Squad" — bold, gradient text (accent-purple to accent-cyan)
- **CTA Buttons**: Pill-shaped, gradient background, white text, 56px height
- **Auth forms**: Dark card (`bg-card`), rounded-2xl, subtle border

```jsx
// Tailwind classes for auth screen
<div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
  <img src={logo} className="w-28 h-28 mb-6" alt="QuestMatch" />
  <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
    QuestMatch
  </h1>
  <p className="text-[#94a3b8] text-lg mt-2">Find Your Perfect Squad</p>

  <div className="w-full max-w-sm mt-10 space-y-4">
    {/* Input fields */}
    <input
      type="email"
      placeholder="Email"
      className="w-full px-5 py-4 bg-[#1e1e32] border border-[#2a2a3e] rounded-2xl text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c3aed] transition-colors"
    />
    <input
      type="password"
      placeholder="Password"
      className="w-full px-5 py-4 bg-[#1e1e32] border border-[#2a2a3e] rounded-2xl text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c3aed] transition-colors"
    />
    {/* Primary CTA */}
    <button className="w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-2xl text-white font-bold text-lg hover:opacity-90 transition-opacity">
      Get Started
    </button>
    {/* Secondary link */}
    <p className="text-center text-[#64748b] text-sm">
      Already have an account? <a href="#" className="text-[#06b6d4]">Sign In</a>
    </p>
  </div>
</div>
```

---

### 2. Swipe Card (Main Screen)
- **Card**: Full-width, rounded-3xl, gradient border, shadow-lg
- **User Photo**: Full-bleed card background (avatar), dark overlay gradient bottom-to-top
- **Info overlay**: Name, age, games, platforms, skill level badge
- **Swipe indicators**: Animated icons (heart for like, X for dislike)

```jsx
// Swipe card component
<div className="relative w-full max-w-sm mx-auto h-[550px] rounded-3xl overflow-hidden bg-[#1a1a2e] border border-[#2a2a3e] shadow-2xl">
  {/* User image with gradient overlay */}
  <img
    src={user.avatar}
    alt={user.username}
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

  {/* Game platform badges */}
  <div className="absolute top-4 left-4 flex gap-2">
    {user.platforms?.map(platform => (
      <span className="px-3 py-1 bg-[#14141f]/80 backdrop-blur-sm border border-[#2a2a3e] rounded-full text-xs text-[#f1f5f9]">
        {platform}
      </span>
    ))}
  </div>

  {/* Skill level badge */}
  <div className="absolute top-4 right-4">
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
      user.skill_level === 'Pro' ? 'bg-[#10b981] text-black' :
      user.skill_level === 'Competitive' ? 'bg-[#7c3aed] text-white' :
      'bg-[#64748b] text-white'
    }`}>
      {user.skill_level}
    </span>
  </div>

  {/* User info overlay at bottom */}
  <div className="absolute bottom-0 left-0 right-0 p-6">
    <h2 className="text-2xl font-bold text-white">
      {user.username}, <span className="font-normal text-lg opacity-80">24</span>
    </h2>
    <p className="text-[#94a3b8] text-sm mt-1 line-clamp-2">{user.bio}</p>
    <div className="flex flex-wrap gap-2 mt-3">
      {user.games?.slice(0, 3).map(game => (
        <span className="px-3 py-1 bg-[#7c3aed]/20 border border-[#7c3aed]/30 rounded-full text-xs text-[#c084fc]">
          {game}
        </span>
      ))}
    </div>
  </div>
</div>

// Swipe action buttons
<div className="flex justify-center gap-6 mt-6">
  {/* Dislike button */}
  <button className="w-16 h-16 rounded-full bg-[#14141f] border-2 border-[#ef4444]/50 flex items-center justify-center shadow-lg hover:bg-[#ef4444]/20 transition-colors">
    <X className="w-8 h-8 text-[#ef4444]" />
  </button>

  {/* Super Like (Star) */}
  <button className="w-16 h-16 rounded-full bg-[#14141f] border-2 border-[#06b6d4]/50 flex items-center justify-center shadow-lg hover:bg-[#06b6d4]/20 transition-colors">
    <Star className="w-7 h-7 text-[#06b6d4]" />
  </button>

  {/* Like button */}
  <button className="w-16 h-16 rounded-full bg-[#14141f] border-2 border-[#ec4899]/50 flex items-center justify-center shadow-lg hover:bg-[#ec4899]/20 transition-colors">
    <Heart className="w-8 h-8 text-[#ec4899]" />
  </button>
</div>
```

---

### 3. Match Celebration Overlay
When a mutual match occurs, show a full-screen celebration:

```jsx
// Match modal overlay
<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="text-center animate-bounce-in">
    <div className="relative">
      {/* Glowing hearts */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] blur-3xl opacity-50 animate-pulse" />
      </div>
      {/* Avatars side by side */}
      <div className="relative flex items-center gap-4 justify-center">
        <img src={user1.avatar} className="w-24 h-24 rounded-full border-4 border-[#ec4899] object-cover" />
        <Heart className="w-10 h-10 text-[#ec4899] animate-heartbeat" fill="#ec4899" />
        <img src={user2.avatar} className="w-24 h-24 rounded-full border-4 border-[#7c3aed] object-cover" />
      </div>
    </div>
    <h2 className="text-4xl font-bold text-white mt-6 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
      It's a Match!
    </h2>
    <p className="text-[#94a3b8] mt-2">You and {user2.username} liked each other</p>
    <div className="flex gap-4 mt-8 justify-center">
      <button className="px-8 py-3 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-full text-white font-bold hover:opacity-90 transition-opacity">
        Send Message
      </button>
      <button className="px-8 py-3 bg-[#14141f] border border-[#2a2a3e] rounded-full text-[#f1f5f9] hover:bg-[#1a1a2e] transition-colors">
        Keep Playing
      </button>
    </div>
  </div>
</div>
```

---

### 4. Game Selector Screen
Horizontal scrollable game cards for onboarding/setup:

```jsx
// Game selection carousel
<div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
  <div className="flex gap-4">
    {games.map(game => (
      <div
        className={`relative flex-shrink-0 w-36 h-48 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
          selected ? 'border-[#7c3aed] scale-105' : 'border-[#2a2a3e]'
        }`}
        onClick={() => toggleGame(game.id)}
      >
        <img src={game.thumbnail} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-bold text-sm">{game.name}</p>
        </div>
        {/* Selected checkmark */}
        {selected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#7c3aed] flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    ))}
  </div>
</div>
```

---

### 5. Matches List Screen

```jsx
// Match card in list
<div className="flex items-center gap-4 p-4 bg-[#14141f] rounded-2xl border border-[#2a2a3e] hover:border-[#7c3aed]/50 transition-colors cursor-pointer">
  <div className="relative">
    <img src={match.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-[#2a2a3e]" />
    {/* Online dot */}
    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10b981] border-4 border-[#14141f]" />
  </div>
  <div className="flex-1 min-w-0">
    <h3 className="text-white font-bold">{match.username}</h3>
    <p className="text-[#64748b] text-sm truncate">
      {match.games?.slice(0, 2).join(', ')}
    </p>
    <p className="text-[#64748b] text-xs mt-0.5">
      {match.last_message || 'Matched recently'}
    </p>
  </div>
  {/* Unread badge */}
  {match.unread > 0 && (
    <div className="w-6 h-6 rounded-full bg-[#ec4899] flex items-center justify-center">
      <span className="text-white text-xs font-bold">{match.unread}</span>
    </div>
  )}
</div>
```

---

### 6. Chat Screen

```jsx
// Chat message bubble (user)
<div className="flex justify-end mb-3">
  <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-sm bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white text-sm">
    {message.content}
    <p className="text-[#c4b5fd] text-xs text-right mt-1">{message.time}</p>
  </div>
</div>

// Chat message bubble (other)
<div className="flex justify-start mb-3">
  <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-bl-sm bg-[#1e1e32] border border-[#2a2a3e] text-[#f1f5f9] text-sm">
    {message.content}
    <p className="text-[#64748b] text-xs mt-1">{message.time}</p>
  </div>
</div>

// Chat input bar
<div className="flex items-center gap-3 px-4 py-3 bg-[#14141f] border-t border-[#2a2a3e]">
  <input
    type="text"
    placeholder="Type a message..."
    className="flex-1 px-5 py-3 bg-[#1e1e32] border border-[#2a2a3e] rounded-full text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
  />
  <button className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] flex items-center justify-center hover:opacity-90 transition-opacity">
    <Send className="w-5 h-5 text-white" />
  </button>
</div>
```

---

### 7. User Profile / Settings

```jsx
// Profile header
<div className="relative">
  <div className="h-32 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-3xl" />
  <div className="flex justify-center -mt-12">
    <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-[#0a0a0f] object-cover" />
  </div>
  <h2 className="text-center text-white text-xl font-bold mt-3">{user.username}</h2>
  <p className="text-center text-[#64748b] text-sm">{user.bio}</p>
</div>

// Profile stats row
<div className="flex justify-center gap-8 mt-4">
  <div className="text-center">
    <p className="text-white font-bold text-xl">{user.matches}</p>
    <p className="text-[#64748b] text-xs">Matches</p>
  </div>
  <div className="text-center">
    <p className="text-white font-bold text-xl">{user.likes_sent}</p>
    <p className="text-[#64748b] text-xs">Likes</p>
  </div>
  <div className="text-center">
    <p className="text-white font-bold text-xl">{user.games?.length}</p>
    <p className="text-[#64748b] text-xs">Games</p>
  </div>
</div>
```

---

### 8. Bottom Navigation Bar

```jsx
// Fixed bottom nav
<div className="fixed bottom-0 left-0 right-0 bg-[#14141f]/95 backdrop-blur-lg border-t border-[#2a2a3e] px-6 py-3 flex justify-between items-center">
  {[
    { icon: Compass, label: 'Discover', path: '/discover' },
    { icon: Heart, label: 'Matches', path: '/matches', badge: unreadMatches },
    { icon: MessageCircle, label: 'Chat', path: '/chat', badge: unreadMessages },
    { icon: User, label: 'Profile', path: '/profile' }
  ].map(item => (
    <Link
      to={item.path}
      className={`flex flex-col items-center gap-1 ${
        currentPath === item.path ? 'text-[#7c3aed]' : 'text-[#64748b]'
      } transition-colors`}
    >
      <div className="relative">
        <item.icon className="w-6 h-6" />
        {item.badge > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ec4899] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">{item.badge}</span>
          </div>
        )}
      </div>
      <span className="text-xs font-medium">{item.label}</span>
    </Link>
  ))}
</div>
```

---

### 9. Loading States

```jsx
// Skeleton loading for swipe cards
<div className="w-full max-w-sm mx-auto h-[550px] rounded-3xl bg-[#1a1a2e] border border-[#2a2a3e] p-4 animate-pulse">
  <div className="w-full h-full rounded-2xl bg-[#2a2a3e]" />
  <div className="mt-4 space-y-2">
    <div className="h-6 w-48 bg-[#2a2a3e] rounded" />
    <div className="h-4 w-32 bg-[#2a2a3e] rounded" />
  </div>
</div>

// Loading spinner
<div className="flex items-center justify-center p-8">
  <div className="w-10 h-10 border-4 border-[#2a2a3e] border-t-[#7c3aed] rounded-full animate-spin" />
</div>
```

---

## 🎬 Animation Guidelines

Use **framer-motion** (already a dependency in the frontend):

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Swipe card exit animation
const swipeVariants = {
  exit: (direction) => ({
    x: direction === 'right' ? 500 : -500,
    opacity: 0,
    rotate: direction === 'right' ? 15 : -15,
    transition: { duration: 0.3 }
  })
};

<motion.div
  key={user.id}
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={1}
  onDragEnd={handleSwipe}
  exit="exit"
  custom={swipeDirection}
  variants={swipeVariants}
  className="w-full max-w-sm mx-auto"
>
  {/* Card content */}
</motion.div>

// Match celebration animation
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 200, damping: 15 }}
>
  {/* Match modal content */}
</motion.div>

// Staggered list animation
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.05 } }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 🖌️ Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| App Name / Logo Header | `Inter` or system-ui | 32px / 2xl | 700 bold |
| Screen Titles | `Inter` | 24px / xl | 700 bold |
| Card User Name | `Inter` | 20px / lg | 700 bold |
| Card Body / Info | `Inter` | 14px / sm | 400 regular |
| Badge Labels | `Inter` | 12px / xs | 600 semibold |
| Chat Messages | `Inter` | 15px | 400 regular |
| Captions / Timestamps | `Inter` | 11px | 400 regular |

Apply via Tailwind:
```js
// tailwind.config.js
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  heading: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

---

## 📐 Layout & Spacing

- **Safe area bottom**: `pb-20` (to account for bottom nav)
- **Content padding**: `px-4` horizontal, `pt-4 pb-24`
- **Card max width**: `max-w-sm` (384px)
- **Full bleed images**: `object-cover` with fixed aspect ratios (4:5 for cards, 16:9 for game thumbs)
- **Scrollbar**: Hide on game selectors: `.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }`
- **Z-index layers**: Nav 50, Modals 50, Toast 60

---

## 🪄 Tailwind Config Recommendations

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed', // purple-600
          light: '#a78bfa',
          dark: '#5b21b6',
        },
        secondary: {
          DEFAULT: '#06b6d4', // cyan-500
          light: '#22d3ee',
          dark: '#0891b2',
        },
        accent: {
          pink: '#ec4899',
          green: '#10b981',
          red: '#ef4444',
        },
        dark: {
          DEFAULT: '#0a0a0f',
          card: '#1a1a2e',
          surface: '#14141f',
          input: '#1e1e32',
          border: '#2a2a3e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'heartbeat': 'heartbeat 0.6s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.3s ease-out',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## 🛠️ How to Use with the Backend

The backend runs on **port 3001**. In `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://0.0.0.0:3001'
    }
  }
})
```

---

## 📦 Deliverables Summary

All files are located at:
- `/home/team/shared/ui_guide.md` — This design guide (Tailwind snippets, component code)
- `/home/team/shared/assets/questmatch-logo.png` — App logo
- `/home/team/shared/assets/hero-bg.jpg` — Onboarding background
- `/home/team/shared/assets/avatar-gamer-{1-4}.jpg` — Default profile avatars
- `/home/team/shared/assets/apex-thumbnail.jpg` — Apex Legends game card
- `/home/team/shared/assets/valorant-thumbnail.jpg` — Valorant game card
- `/home/team/shared/assets/cod-thumbnail.jpg` — Call of Duty game card
- `/home/team/shared/assets/fortnite-thumbnail.jpg` — Fortnite game card
- `/home/team/shared/assets/empty-state.svg` — Empty state illustration