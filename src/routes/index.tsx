import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/layouts/MainLayout';
import { InterviewLayout } from '@/layouts/InterviewLayout';
import { StartPage } from '@/pages/StartPage';
import { InterviewPage } from '@/pages/InterviewPage';
import { CompletePage } from '@/pages/CompletePage';
import { SessionsPage } from '@/pages/SessionsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LoginPage } from '@/pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StartPage />,
      },
      {
        path: 'sessions',
        element: <SessionsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/interview',
    element: (
      <ProtectedRoute>
        <InterviewLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <InterviewPage />,
      },
    ],
  },
  {
    path: '/complete',
    element: (
      <ProtectedRoute>
        <InterviewLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <CompletePage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
