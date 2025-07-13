import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router';
import { App } from './App';
import { AdminPage } from './components/AdminArea/AdminPage';
import { CreateCall } from './components/UserArea/CreateCall';
import { CallDetails } from './components/UserArea/CallDetails';
import { Dashboard } from './components/Dashboard/Dashboard';

function UserPage() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

const RedirectToAdmin = () => <Navigate to="/admin" replace />;

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        index: true,
        Component: RedirectToAdmin,
      },
      {
        path: '/',
        Component: Dashboard,
        children: [
          {
            path: 'admin',
            Component: AdminPage,
            children: [
              { path: 'tags', Component: AdminPage },
            ]
          },
          {
            path: 'user',
            Component: UserPage,
            children: [
              { index: true, element: <Navigate to="call/create" replace /> },
              { path: 'call/create', Component: CreateCall },
              { path: 'call/:callId', Component: CallDetails },
            ],
          }
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);