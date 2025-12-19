import React from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import EnterprisesPage from './pages/EnterprisesPage';
import EnterpriseDetailPage from './pages/EnterpriseDetailPage';
import ImportExportPage from './pages/ImportExportPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';

// Define the router with future flags to suppress warnings
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <DashboardPage />
      </Layout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Layout>
        <DashboardPage />
      </Layout>
    ),
  },
  {
    path: "/enterprises",
    element: (
      <Layout>
        <EnterprisesPage />
      </Layout>
    ),
  },
  {
    path: "/enterprises/:id",
    element: (
      <Layout>
        <EnterpriseDetailPage />
      </Layout>
    ),
  },
  {
    path: "/import-export",
    element: (
      <Layout>
        <ImportExportPage />
      </Layout>
    ),
  },
  {
    path: "/tasks",
    element: (
      <Layout>
        <TasksPage />
      </Layout>
    ),
  },
  {
    path: "/settings",
    element: (
      <Layout>
        <SettingsPage />
      </Layout>
    ),
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ThemeProvider>
  );
}

export default App;