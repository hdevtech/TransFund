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
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard')),
        roles: ['admin', 'contributor'], // Only admins and contributors can access
      },
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: 'true',
        path: '/charts/nvd3',
        element: lazy(() => import('./views/charts/nvd3-chart'))
      },
      {
        exact: 'true',
        path: '/maps/google-map',
        element: lazy(() => import('./views/maps/GoogleMaps'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
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
