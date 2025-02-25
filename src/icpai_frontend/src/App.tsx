import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import MainLayout from './layouts/main';
import DashboardLayout from './layouts/dashboard';
import { AuthProvider } from './context/AuthProvider';
import { LoadingProvider } from './context/loading-context';

function App() {


  return (
    <AuthProvider>
      <LoadingProvider>
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
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
