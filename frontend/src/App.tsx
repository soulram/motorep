import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import ChecklistEntree from '@/pages/ChecklistEntree';
import Reparations from '@/pages/Reparations';
import Contrats from '@/pages/Contrats';
import Utilisateurs from '@/pages/Utilisateurs';
import Administration from '@/pages/Administration';
import Login from '@/pages/Login';
import TypeContrats from '@/pages/TypeContrats';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
  function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="atelier-moto-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/checklist" element={
                <ProtectedRoute>
                  <Layout>
                    <ChecklistEntree />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reparations" element={
                <ProtectedRoute>
                  <Layout>
                    <Reparations />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/contrats" element={
                <ProtectedRoute>
                  <Layout>
                    <Contrats />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/type-contrats" element={
                <ProtectedRoute>
                  <Layout>
                    <TypeContrats />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/utilisateurs" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <Utilisateurs />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/administration" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <Administration />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;