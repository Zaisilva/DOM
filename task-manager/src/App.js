import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import TeamPage from './pages/Team/TeamPage';
import GroupsPage from './pages/Groups/GroupsPage';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
        <PrivateRoute>
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        </PrivateRoute>
      } />
        <Route path="/team" element={
          <PrivateRoute>
            <MainLayout>
              <TeamPage />
            </MainLayout>
          </PrivateRoute>
        } />
         <Route path="/groups" element={
          <PrivateRoute>
            <MainLayout>
              <GroupsPage />
            </MainLayout>
          </PrivateRoute>
        } />
              <Route path="/dashboard/tasks/:groupId" element={
        <Navigate to="/dashboard" replace />
      } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;