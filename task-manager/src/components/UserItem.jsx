import { ActionButton } from './Common/Buttons';

function UserItem({ user, onEdit, onDelete }) {


  const getRolName = (tipo) => {
    return tipo === 1 ? 'Administrador' : 'Usuario Regular';
  };

  const trStyle = {
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    borderRadius: '12px',
    marginBottom: '12px',
    position: 'relative',
    overflow: 'hidden'
  };

  const tdStyle = {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#3a3a3a',
    borderTop: 'none',
    borderBottom: 'none',
    verticalAlign: 'middle'
  };

  const firstTdStyle = {
    ...tdStyle,
    fontWeight: '500',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
    paddingLeft: '24px'
  };

  const lastTdStyle = {
    ...tdStyle,
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    paddingRight: '24px',
    textAlign: 'right'
  };

  const roleBadgeStyle = {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: user.tipo === 1 ? '#e9e1ff' : '#f5f5f5',
    color: user.tipo === 1 ? '#6941c6' : '#666',
    letterSpacing: '0.3px',
    boxShadow: user.tipo === 1 ? '0 1px 3px rgba(105, 65, 198, 0.1)' : 'none'
  };

  return (
    <tr style={trStyle} onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
    }} onMouseOut={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }}>
      <td style={firstTdStyle}>{user.username}</td>
      <td style={tdStyle}>{user.email}</td>
      <td style={tdStyle}>
        <span style={roleBadgeStyle}>{getRolName(user.tipo)}</span>
      </td>
      <td style={lastTdStyle}>
        <ActionButton 
          type="edit" 
          onClick={() => onEdit(user)}
        >
          Editar
        </ActionButton>
        <ActionButton 
          type="delete" 
          onClick={() => onDelete(user.id)}
        >
          Eliminar
        </ActionButton>
      </td>
    </tr>
  );
}

export default UserItem;