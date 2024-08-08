import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import '../assets/styles/App.css'
import AppRoutes from '../routes/AppRoutes';
import SecurityContext from '../services/contexts/SecurityContext'

function App() {
  const loginTokenInLocalData = localStorage.getItem("loginToken");
  const isloginTokenPresent = loginTokenInLocalData ? true: false;
  const [loggedIn, setLoggedIn] = useState(isloginTokenPresent)
  
  return (
    <div>
      <SecurityContext.Provider value={{ loggedIn, setLoggedIn }}>
          <RouterProvider router={AppRoutes}></RouterProvider>
      </SecurityContext.Provider>
    </div>
  );
}

export default App