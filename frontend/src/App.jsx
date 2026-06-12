import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import CreateQuest from './pages/CreateQuest';
import QuestDetails from './pages/QuestDetails';
import ManageSquad from './pages/ManageSquad';
import Notifications from './pages/Notifications';
import Premium from './pages/Premium';
import Community from './pages/Community';
import Navbar from './components/Navbar';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/discover" /> : children;
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-rajdhani text-2xl animate-pulse text-primary">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-text-high">
          <Routes>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/*" element={
              <PrivateRoute>
                <div className="flex-1 flex flex-col pb-20">
                  <Routes>
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create-quest" element={<CreateQuest />} />
                    <Route path="/quests/:id" element={<QuestDetails />} />
                    <Route path="/manage-squad/:id" element={<ManageSquad />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/premium" element={<Premium />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/" element={<Navigate to="/discover" replace />} />
                  </Routes>
                  <Navbar />
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
