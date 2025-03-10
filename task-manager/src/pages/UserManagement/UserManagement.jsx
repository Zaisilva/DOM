import React, { useState, useEffect } from 'react';
import UserList from '../../components/UserList';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/usersService';
import PageTitle from '../../components/Common/PageTitle';
import { ButtonCircle } from '../../components/Common/Buttons';
import UserFormModal from '../../components/Modals/UserForm';
import DeleteUserModal from '../../components/Modals/DeleteUserModal';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = () => {
    setCurrentUser({ username: '', email: '', password: '', tipo: 2, last_login: new Date().toISOString() });
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const confirmDeleteUser = (userId) => {
    setUserToDelete(userId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete);
        setUsers(users.filter(user => user.id !== userToDelete));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
      setIsDeleteModalVisible(false);
      setUserToDelete(null);
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (userData.id) {
        const updatedUser = await updateUser(userData.id, userData);
        setUsers(users.map(user => (user.id === userData.id ? updatedUser : user)));
      } else {
        const newUser = await createUser(userData);
        setUsers([...users, newUser]);
      }
      setIsModalVisible(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f9f9fb', minHeight: '100vh' }}>
      <PageTitle title="Usuarios" subtitle="Administra de los usuarios" />
      <ButtonCircle onClick={handleAddUser} />
      <UserList users={users} onEdit={handleEditUser} onDelete={confirmDeleteUser} />
      <UserFormModal visible={isModalVisible} onClose={handleCancelEdit} user={currentUser} onSave={handleSaveUser} />
      <DeleteUserModal visible={isDeleteModalVisible} onConfirm={handleDeleteUser} onCancel={() => setIsDeleteModalVisible(false)} />
    </div>
  );
}

export default UserManagement;