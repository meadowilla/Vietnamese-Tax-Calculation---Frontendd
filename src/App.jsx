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
import { useEffect, useState } from 'react';
import './App.css';


function App() {
  const user = null;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/auth")
    .then(res => res.json())
    .then(res => {
      const usernames = res.data.map(user => user.username);
      setUsers(usernames);
    })
    .catch(err => {
      console.log(err);
    })
  }, []);

  return (
    <>
      <div>
        {/*<h1>Lists of registered users:</h1>*/}
        <ol>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ol>
      </div>
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
            {/*<Route
              path="user/luutru"
              element={user ? <UserStorageScreen /> : <Navigate to="/account/signin" replace /> }
            />*/}
            <Route
              path="user/luutru"
              element={<UserStorageScreen />}
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
              path="account/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
            path='sotay/:id'
            element={<NotebookScreen />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
