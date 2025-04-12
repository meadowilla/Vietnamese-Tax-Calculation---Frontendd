import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import AboutScreen from './screens/AboutScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import NotebookScreen from './screens/NotebookScreen';
import TaxCalculationScreen from './screens/TaxCalculationScreen';
import UserStorageScreen from './screens/UserStorageScreen';
import ContactScreen from './screens/ContactScreen';
import './App.css';


function App() {
  const user = null;

  return (
    <Router>
      <Routes>
        {/* Nesting routes inside Layout so they share Header, Footer, and Outlet */}
        <Route path="/" element={<Layout />}>
          <Route 
            index 
            element={<AboutScreen />} 
          />
          <Route 
            path="sotay" 
            element={<NotebookScreen />} 
          />
          <Route 
            path='tinhthuethang' 
            element={<TaxCalculationScreen />} 
          />
          <Route
            path="user/luutru"
            element={user ? <UserStorageScreen /> : <Navigate to="/account/signin" replace /> }
          />
          <Route
            path="lienhe"
            element={<ContactScreen />}
          />
          <Route
            path="account/signin"
            element={user ? <Navigate to="/sotay" replace /> : <LoginScreen />}
          />
          <Route
            path="account/create"
            element={user ? <Navigate to="/sotay" replace /> : <SignupScreen />}
          />
          <Route
            path='sotay/:id'
            element={<NotebookScreen />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
