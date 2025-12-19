import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import EnterprisesPage from './pages/EnterprisesPage';
import EnterpriseDetailPage from './pages/EnterpriseDetailPage';
import ImportExportPage from './pages/ImportExportPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/enterprises" element={<EnterprisesPage />} />
            <Route path="/enterprises/:id" element={<EnterpriseDetailPage />} />
            <Route path="/import-export" element={<ImportExportPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;