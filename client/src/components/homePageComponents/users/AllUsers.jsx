import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../../pages/Loader.jsx';
import Button from '../../Button.jsx';
import SuccessResponseMessage from '../../SuccessResponseMessage.jsx';
import ErrorResponseMessage from '../../ErrorResponseMessage.jsx';
import DeleteConfirmation from '../../DeleteConfirmation.jsx';
import authService from '../../../features/auth.js';
import { setCurrentUser } from '../../../store/slices/auth/authSlice.js';

const ManageUsers = ({ onUserSelect }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    mobileno: ['']
  });
  const { userData } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authService.getBusinessUsers();
        if (response) {
          setUsers(response.data);
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      await authService.deleteUser(userToDelete);
      
      // Refresh current user data if the deleted user was the current user
      if (userData._id === userToDelete) {
        const res = await authService.getCurrentUser();
        if (res) {
          dispatch(setCurrentUser(res.data));
        }
      }
      
      // Refresh user list
      const response = await authService.getBusinessUsers();
      if (response) {
        setUsers(response.data);
        setSuccessMessage('User deleted successfully');
      }
    } catch (error) {
      setError(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname || '',
      mobileno: user.mobileno?.length ? [...user.mobileno] : ['']
    });
    setShowEditModal(true);
  };

  const handleMobileNumberChange = (index, value) => {
    const newNumbers = [...formData.mobileno];
    newNumbers[index] = value;
    setFormData({...formData, mobileno: newNumbers});
  };

  const addMobileNumberField = () => {
    setFormData({...formData, mobileno: [...formData.mobileno, '']});
  };

  const removeMobileNumberField = (index) => {
    if (formData.mobileno.length > 1) {
      const newNumbers = formData.mobileno.filter((_, i) => i !== index);
      setFormData({...formData, mobileno: newNumbers});
    }
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      const cleanedData = {
        ...formData,
        mobileno: formData.mobileno.filter(num => num.trim() !== '')
      };

      await authService.updateUser(editingUser._id, cleanedData);
      
      // Refresh user list
      const response = await authService.getBusinessUsers();
      if (response) {
        setUsers(response.data);
        setSuccessMessage('User updated successfully');
        setShowEditModal(false);
      }
    } catch (error) {
      setError(error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading users..." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />;
  }

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-lg font-semibold mb-4">Manage Users</h2>
      
      <ErrorResponseMessage
        isOpen={!!error}
        onClose={() => setError('')}
        errorMessage={error}
      />
      
      <SuccessResponseMessage
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
      
      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteUser}
        onCancel={() => setShowDeleteConfirm(false)}
        message="Are you sure you want to delete this user? This action cannot be undone."
      />

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User Details</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstname}
                  onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm mb-1">Mobile Numbers</label>
                {formData.mobileno.map((number, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => handleMobileNumberChange(index, e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="Enter mobile number"
                    />
                    {formData.mobileno.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMobileNumberField(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                    {index === formData.mobileno.length - 1 && (
                      <button
                        type="button"
                        onClick={addMobileNumberField}
                        className="ml-2 text-green-500 hover:text-green-700"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 text-xs">
              <Button
                onClick={() => setShowEditModal(false)}
                className="px-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateUser}
                className="px-2"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.firstname} {user.lastname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.mobileno?.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium space-x-2">
                  <Button
                    onClick={() => handleEditClick(user)}
                    className="px-2"
                    bgColor="bg-yellow-500 hover:bg-yellow-600"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(user._id)}
                    className="px-2"
                    bgColor="bg-red-600 hover:bg-red-700"
                    disabled={user.role === 'owner' || user._id === userData._id}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;