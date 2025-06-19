
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const defaultUsers = [
  { username: 'haider1397', password: 'Admin' }
];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('adminUsers');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(users));
  }, [users]);

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const addUser = (username, password) => {
    if (users.find(u => u.username === username)) {
      return false; // User already exists
    }
    setUsers(prev => [...prev, { username, password }]);
    return true;
  };

  const removeUser = (username) => {
    setUsers(prev => prev.filter(u => u.username !== username));
  };

  const updateUser = (oldUsername, newUsername, newPassword) => {
    setUsers(prev => prev.map(u => 
      u.username === oldUsername 
        ? { username: newUsername, password: newPassword }
        : u
    ));
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      users,
      login,
      logout,
      addUser,
      removeUser,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
