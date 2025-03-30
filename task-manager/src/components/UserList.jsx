import React from 'react';
import UserItem from './UserItem';

function UserList({ users, onEdit, onDelete }) {
  const containerStyle = {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    marginBottom: '80px', 
    position: 'relative',
    zIndex: 1
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 12px',
    marginTop: '20px'
  };

  const theadStyle = {
    position: 'relative'
  };

  const thStyle = {
    padding: '18px 20px',
    textAlign: 'left',
    color: '#000',
    fontWeight: '600',
    fontSize: '13px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #eaecf0'
  };

  const firstThStyle = {
    ...thStyle,
    paddingLeft: '24px',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '0'
  };

  const lastThStyle = {
    ...thStyle,
    textAlign: 'right',
    paddingRight: '24px',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '0'
  };

  const noUsersStyle = {
    padding: '70px 0',
    textAlign: 'center',
    color: '#667085',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    fontSize: '15px',
    fontStyle: 'italic',
    margin: '20px 0'
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={firstThStyle}>Usuario</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Rol</th>
            <th style={lastThStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <UserItem 
                key={user.id} 
                user={user} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" style={noUsersStyle}>
                No hay usuarios disponibles en este momento
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;