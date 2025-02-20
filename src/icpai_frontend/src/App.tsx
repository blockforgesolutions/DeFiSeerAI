import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import MainLayout from './layouts/main';
import DashboardLayout from './layouts/dashboard';
import { AuthProvider } from './hooks/AuthProvider';

function App() {


  return (
    <AuthProvider>
      <Router>
        <Routes>
          {routes.map((routeGroup, index) => {
            const Layout = routeGroup.layout === 'main' ? MainLayout : DashboardLayout;

            return routeGroup.pages.map((page, pageIndex) => (
              <Route
                key={pageIndex}
                path={page.path}
                element={<Layout>{page.element}</Layout>}
              />
            ));
          })}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
