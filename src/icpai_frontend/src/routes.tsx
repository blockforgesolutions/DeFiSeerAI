// src/routes.js
import Dashboard from './pages/dashboard/dashboard';
import { Profile } from './pages/dashboard/profile';
import Home from './pages/main/home';
import SignUp from './pages/main/sign-up';

export const routes = [
  {
    layout: 'main',
    pages: [
      {
        name: 'Home',
        element: <Home />,
        path: '/',
      },
      {
        name: "Sign Up",
        element: <SignUp />,
        path:"/sign-up"
      }
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
      {
        name:"Profile",
        element: <Profile />,
        path:'/profile'
      }
    ],
  },
];
