import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AnimalsPage } from './pages/animals/AnimalsPage';
import { AdoptionsPage } from './pages/adoptions/AdoptionsPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { DonationsPage } from './pages/donations/DonationsPage';
import { useAuthStore } from './store/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard/*"
          element={
            <DashboardLayout />
          }
        >
          <Route path="animals" element={<AnimalsPage />} />
          <Route path="adoptions" element={<AdoptionsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="donations" element={<DonationsPage />} />
          <Route index element={<Navigate to="animals" />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}