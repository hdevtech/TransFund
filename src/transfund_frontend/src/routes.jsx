import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import RoleGuard from './components/AuthGuard'; // Import the RoleGuard

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Layout = route.layout || Fragment;
        const Element = route.element;

        // Check if the route has roles defined
        const hasGuard = route.roles && route.roles.length > 0;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              hasGuard ? ( // Conditionally use RoleGuard if roles are defined
                <RoleGuard roles={route.roles}>
                  <Layout>
                    {route.routes ? renderRoutes(route.routes) : <Element props={true} />}
                  </Layout>
                </RoleGuard>
              ) : (
                <Layout>
                  {route.routes ? renderRoutes(route.routes) : <Element props={true} />}
                </Layout>
              )
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/logout', // Add the logout route
    element: lazy(() => import('./components/Logout')) // Use the Logout component
  },
  {
    exact: 'true',
    path: '/auth/signin',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [

      {
        exact: 'true',
        path: '/admin/dashboard',
        
        element: lazy(() => import('./views/admin/dashboard')),

        roles: ['admin'], // Only admins and contributors can access
      },
      {
        exact: 'true',
        path: '/admin/AddContributor',
        element: lazy(() => import('./views/admin/AddContributor')),
        roles: ['admin'], // Only admins  can access
      },
      {
        exact: 'true',
        path: '/admin/ViewContributors',

        element: lazy(() => import('./views/admin/ViewContributors')),

        roles: ['admin'], // Only admins  can access
      },
      {
        exact: 'true',
        path: '/admin/add-fundraising-goals',

        element: lazy(() => import('./views/admin/add-fundraising-goals')),

        roles: ['admin'], // Only admins  can access
      },
      {
        exact: 'true',
        path: '/admin/view-fundraising-goals',

        element: lazy(() => import('./views/admin/view-fundraising-goals')),

        roles: ['admin'], // Only admins  can access
      },


      {
        exact: 'true',
        path: '/contributor/dashboard',
        
        element: lazy(() => import('./views/contributor/dashboard')),

        roles: ['contributor'], // Only admins and contributors can access
      },
      {
        exact: 'true',
        path: '/contributor/view-fundraising-goals',

        element: lazy(() => import('./views/contributor/view-fundraising-goals')),

        roles: ['contributor'], // Only admins  can access
      },
      {
        exact: 'true',
        path: '/contribute/:goal_id',
        element: lazy(() => import('./views/contributor/contribute')), // Point to your Contribute component
        roles: ['contributor'], // Only contributors can access
      },


      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
