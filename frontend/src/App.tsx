import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import WarMapPage from './pages/Dashboard/WarMapPage';
import TechRadarPage from './pages/Dashboard/TechRadarPage';
import EcosystemPage from './pages/Dashboard/EcosystemPage';
import PolicyWarRoomPage from './pages/Dashboard/PolicyWarRoomPage';
import EnterprisesPage from './pages/Enterprises/EnterprisesPage';
import EnterpriseDetailPageV2 from './pages/EnterpriseDetail/EnterpriseDetailPageV2';
import EnterpriseFormPage from './pages/Enterprises/EnterpriseFormPage';
import ImportExportPage from './pages/ImportExport/ImportExportPage';
import ReportsPage from './pages/Reports/ReportsPage';
import ReportViewPage from './pages/Reports/ReportViewPage';
import SettingsPage from './pages/Settings/SettingsPage';
import LoginPage from './pages/Auth/LoginPage';
import LandingPage from './pages/Landing/LandingPage';

// 受有认证的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const location = useLocation();

  // 如果用户已登录，直接访问主页
  if (isAuthenticated && token) {
    // 如果当前在登录页，重定向到仪表板
    if (location.pathname === '/login') {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // 如果未登录且不在登录页/着陆页，重定向到登录页
  if (location.pathname !== '/login' && location.pathname !== '/landing' && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 否则显示当前页面
  return <>{children}</>;
};

// 未认证的路由组件
const UnprotectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // 如果已登录，重定向到仪表板
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// 主应用组件
const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // 如果已认证且在根路径，重定向到仪表板
  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<LandingPage />} 
      />
      <Route 
        path="/landing" 
        element={<Navigate to="/" replace />} 
      />
      <Route 
        path="/login" 
        element={
          <UnprotectedRoute>
            <LoginPage />
          </UnprotectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/tech" 
        element={
          <ProtectedRoute>
            <Layout>
              <TechRadarPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/ecosystem" 
        element={
          <ProtectedRoute>
            <Layout>
              <EcosystemPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/war-map" 
        element={
          <ProtectedRoute>
            <Layout>
              <WarMapPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/policy-war-room" 
        element={
          <ProtectedRoute>
            <Layout>
              <PolicyWarRoomPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/enterprises" 
        element={
          <ProtectedRoute>
            <Layout>
              <EnterprisesPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/enterprises/new" 
        element={
          <ProtectedRoute>
            <Layout>
              <EnterpriseFormPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/enterprises/:id" 
        element={
          <ProtectedRoute>
            <Layout>
              <EnterpriseDetailPageV2 />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/enterprises/:id/edit" 
        element={
          <ProtectedRoute>
            <Layout>
              <EnterpriseFormPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/import-export" 
        element={
          <ProtectedRoute>
            <Layout>
              <ImportExportPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/:id" 
        element={
          <ProtectedRoute>
            <Layout>
              <ReportViewPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// 查询客户端配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
    },
  },
});

// 根应用组件
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="App">
            <MainApp />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;