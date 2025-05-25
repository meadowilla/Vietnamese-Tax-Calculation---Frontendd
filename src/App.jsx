import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import AboutScreen from './screens/AboutScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import NotebookScreen from './screens/NotebookScreen';
import TaxCalculationScreen from './screens/TaxCalculationScreen';
import UserStorageScreen from './screens/UserStorageScreen';
import ContactScreen from './screens/ContactScreen';
import ForgotPassword from './screens/ForgotPassword';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectUser, login} from './redux/UserSlice';
import './App.css';
import ProtectedRoute from './ProtectedRoute';
import Spinner from './screens/Spinner';


function App() {
  const user = useSelector(selectUser);
  console.log('User in App:', user);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.accessToken && parsedUser.userId) {
          dispatch(login(parsedUser));
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, [dispatch]);

  return (
    <>
      <Router>
        <Routes>
          <Route
              path="spinner" 
              element={<Spinner />}
          />

          {/* Public routes*/}
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
              path="lienhe"
              element={<ContactScreen />}
            />
            <Route
              path='sotay/:id'
              element={<NotebookScreen />}
            />

            {/* Route for auth user */}
            <Route
              path="user/luutru"
              element={
                <ProtectedRoute >
                  <UserStorageScreen />
                </ProtectedRoute>
              }
            />

            {/* Auth routes */}
            <Route
              path="account/signin"
              element={user ? <Navigate to="/user/luutru" replace /> : <LoginScreen />}
            />
            <Route
              path="account/create"
              element={user ? <Navigate to="/user/luutru" replace /> : <SignupScreen />}
            />
            <Route
              path="account/forgot-password"
              element={<ForgotPassword />}
              />
            </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
