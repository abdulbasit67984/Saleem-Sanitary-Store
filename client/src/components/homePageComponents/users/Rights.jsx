import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../../pages/Loader.jsx';
import Button from '../../Button.jsx';
import SuccessResponseMessage from '../../SuccessResponseMessage.jsx';
import authService from '../../../features/auth.js';

const Rights = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersDetails, setUsersDetails] = useState(null);
    const [roles, setRoles] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const { userData } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersResponse, rolesResponse] = await Promise.all([
                    authService.getBusinessUsers(),
                    authService.getRoles()
                ]);

                if (usersResponse) {
                    setUsersDetails(usersResponse.data)
                    setUsers(usersResponse.data?.filter(user => user._id !== userData._id));
                }
                if (rolesResponse) {
                    setRoles(rolesResponse.data);
                }
            } catch (error) {
                setError(error.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userData._id]);

    useEffect(() => {
        if (selectedUserId) {
            const userDetail = usersDetails.filter(user => user._id === selectedUserId)[0]
            setSelectedRoles(userDetail?.businessRole?.map(role => role._id) || []);
        }
    }, [selectedUserId]);

    const handleRoleToggle = (roleId) => {
        setSelectedRoles(prev =>
            prev?.includes(roleId)
                ? prev?.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleSubmit = async () => {
        if (!selectedUserId) {
            setError('Please select a user first');
            return;
        }

        try {
            setSaving(true);
            await authService.assignUserRights(selectedUserId, selectedRoles);
            setSuccess(true);
            setError('');
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            setError(error.message || 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loader message="Loading data..." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md text-xs">
            <h2 className="text-lg font-semibold mb-4">Assign Roles to Users</h2>

            {error && (
                <div className="text-red-500 text-xs mb-4 p-2 bg-red-50 rounded">
                    {error}
                </div>
            )}

            <SuccessResponseMessage
                isOpen={success}
                onClose={() => setSuccess(false)}
                message="Roles assigned successfully!"
            />

            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                    Select User:
                </label>
                <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">-- Select a user --</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.firstname} {user.lastname} ({user.username})
                        </option>
                    ))}
                </select>
            </div>

            {selectedUserId && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Available Roles</h3>
                    <div className="space-y-3 max-h-64 overflow-auto bg-[#1753670f] p-3 scrollbar-thin">
                        {roles.length > 0 ? (
                            roles.map(role => (
                                <div key={role._id} className="flex items-center">
                                    <div className="flex items-center">
                                        <input
                                            id={`role-${role._id}`}
                                            name={`role-${role._id}`}
                                            type="checkbox"
                                            checked={selectedRoles?.includes(role._id)}
                                            onChange={() => handleRoleToggle(role._id)}
                                            className=" border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <label htmlFor={`role-${role._id}`} className="font-medium text-gray-700">
                                            {role.businessRoleName}
                                        </label>
                                        <p className="text-gray-500 text-xs">{role.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No roles available</p>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    onClick={handleSubmit}
                    className=" text-white py-2 px-4 rounded-md disabled:opacity-50"
                    disabled={!selectedUserId || saving}
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Assigning...
                        </>
                    ) : 'Assign Roles'}
                </Button>
            </div>
        </div>
    );
};

export default Rights;