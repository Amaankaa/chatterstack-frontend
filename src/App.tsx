import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/authStore';

// Import Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Landing from '@/pages/Landing';
import Chat from '@/pages/Chat'; // <--- IMPORT THE CHAT PAGE

// Protected Route: Only allows access if token exists
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Route: Redirects to /chat if already logged in
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuthStore();
  if (token) {
    return <Navigate to="/chat" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page (Accessible by everyone) */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Pages (Redirect to chat if logged in) */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* The Chat Dashboard (Protected) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />  {/* <--- RENDER THE COMPONENT HERE */}
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;