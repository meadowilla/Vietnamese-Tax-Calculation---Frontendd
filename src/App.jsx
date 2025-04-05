import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import AboutScreen from './screens/AboutScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import NotebookScreen from './screens/NotebookScreen';
import TaxCalculationScreen from './screens/TaxCalculationScreen';
import UserStorageScreen from './screens/UserStorageScreen';
import ContactScreen from './screens/ContactScreen';
import { selectUser } from './features/UserSlice';
import { auth } from './firebase';
import { login, logout } from './features/UserSlice';
import { useEffect } from 'react';  
import { useDispatch, useSelector } from 'react-redux';
import './App.css';


function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        // User is signed in
        dispatch(login({
          email: userAuth.email,
          uid: userAuth.uid,
          displayName: userAuth.displayName
        }));
      } else {
        // User is signed out
        dispatch(logout());
      }
    }
    );
  }, [dispatch]);

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
