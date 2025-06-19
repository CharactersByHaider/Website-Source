
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Users, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const UserManager = () => {
  const { users, addUser, removeUser, updateUser } = useAuth();
  const { toast } = useToast();
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const inputClass = "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-white/50 focus:outline-none focus:border-color-primary transition-colors";
  const labelClass = "block mb-2";

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        duration: 3000,
        variant: "destructive"
      });
      return;
    }

    const success = addUser(newUser.username, newUser.password);
    if (success) {
      setNewUser({ username: '', password: '' });
      toast({
        title: "User Added",
        description: "New admin user has been created successfully.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: "Username already exists.",
        duration: 3000,
        variant: "destructive"
      });
    }
  };

  const handleRemoveUser = (username) => {
    if (users.length === 1) {
      toast({
        title: "Error",
        description: "Cannot remove the last admin user.",
        duration: 3000,
        variant: "destructive"
      });
      return;
    }

    removeUser(username);
    toast({
      title: "User Removed",
      description: "Admin user has been deleted successfully.",
      duration: 3000,
    });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingUser.username.trim() || !editingUser.password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        duration: 3000,
        variant: "destructive"
      });
      return;
    }

    updateUser(editingUser.originalUsername, editingUser.username, editingUser.password);
    setEditingUser(null);
    toast({
      title: "User Updated",
      description: "Admin user has been updated successfully.",
      duration: 3000,
    });
  };

  const togglePasswordVisibility = (username) => {
    setShowPasswords(prev => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2" style={{ color: 'var(--text-high-value)' }}>
          <Users size={24} />
          <span>User Management</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-high-value)' }}>Admin Users</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
              {users.map((user, index) => (
                <motion.div
                  key={user.username}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 border border-white/20 rounded-lg"
                >
                  {editingUser && editingUser.originalUsername === user.username ? (
                    <form onSubmit={handleUpdateUser} className="space-y-3">
                      <input
                        type="text"
                        value={editingUser.username}
                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        className={`${inputClass} text-sm`}
                        style={{ color: 'var(--text-high-value)' }}
                        placeholder="Username"
                      />
                      <input
                        type="password"
                        value={editingUser.password}
                        onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                        className={`${inputClass} text-sm`}
                        style={{ color: 'var(--text-high-value)' }}
                        placeholder="Password"
                      />
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors text-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingUser(null)}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1" style={{ color: 'var(--text-high-value)' }}>{user.username}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm" style={{ color: 'var(--text-high-value)', opacity: 0.7 }}>
                            {showPasswords[user.username] ? user.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(user.username)}
                            className="transition-colors"
                            style={{ color: 'var(--text-high-value)', opacity: 0.5, ':hover': { opacity: 1 } }}
                          >
                            {showPasswords[user.username] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingUser({
                            originalUsername: user.username,
                            username: user.username,
                            password: user.password
                          })}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveUser(user.username)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          disabled={users.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-high-value)' }}>Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className={inputClass}
                  style={{ color: 'var(--text-high-value)' }}
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <label className={labelClass} style={{ color: 'var(--text-high-value)' }}>Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className={inputClass}
                  style={{ color: 'var(--text-high-value)' }}
                  placeholder="Enter password"
                />
              </div>
              
              <motion.button
                type="submit"
                className="w-full bg-color-primary hover:bg-color-secondary px-6 py-3 rounded-lg text-color-low-value font-semibold transition-all duration-300 hover-glow flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={18} />
                <span>Add User</span>
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
