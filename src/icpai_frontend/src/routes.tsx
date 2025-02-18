// src/routes.js
import Dashboard from './pages/dashboard/dashboard';
import Home from './pages/main/home';
// import Dashboard from './pages/Dashboard';

export const routes = [
  {
    layout: 'main',
    pages: [
      {
        name: 'Home',
        element: <Home />,
        path: '/',
      },
    ],
  },
  {
    layout: 'dashboard',
    pages: [
      {
        name: 'Dashboard',
        element: <Dashboard />,
        path: '/dashboard',
      },
    ],
  },
];
