import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Package, ShoppingBag, ClipboardList, Box } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Materiais from './pages/Materiais';
import Produtos from './pages/Produtos';
import ListaProdutos from './pages/ListaProdutos';
import Confeccoes from './pages/Confeccoes';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/produtos', label: 'Meus Produtos', icon: <Package className="w-4 h-4" /> },
    { path: '/materiais', label: 'Materiais', icon: <Box className="w-4 h-4" /> },
    { path: '/cadastrar', label: 'Novo Produto', icon: <ShoppingBag className="w-4 h-4" /> },
    { path: '/confeccoes', label: 'Confecções', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex w-full">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Makarios
                </h1>
              </div>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-4 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-2 px-3 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden pb-3 pt-2 space-y-1 overflow-x-auto">
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-4 sm:py-6 md:py-8 px-2 sm:px-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produtos" element={<ListaProdutos />} />
            <Route path="/materiais" element={<Materiais />} />
            <Route path="/cadastrar" element={<Produtos />} />
            <Route path="/confeccoes" element={<Confeccoes />} />
          </Routes>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App
