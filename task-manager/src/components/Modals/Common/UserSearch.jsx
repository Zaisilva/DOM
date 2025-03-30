import React from 'react';
import { Select, Spin, Avatar } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

export const UserSearch = ({ 
  searchTerm, 
  handleSearchChange, 
  searchResults, 
  searching, 
  handleSelectUser 
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <Select
        showSearch
        value={null}
        placeholder="Buscar usuarios"
        style={{ width: '100%', borderRadius: '8px' }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearchChange}
        onChange={(value, option) => {
          if (option && option.data) {
            handleSelectUser(option.data);
          }
        }}
        notFoundContent={searching ? <Spin size="small" /> : "No se encontraron usuarios"}
        suffixIcon={<SearchOutlined />}
        dropdownStyle={{ borderRadius: '8px' }}
        dropdownRender={menu => (
          <div>
            {menu}
            {searchResults.length > 0 && (
              <div style={{ padding: '8px 12px', color: '#7a43b6', fontSize: '12px', borderTop: '1px solid #e9d8fd' }}>
                Haz clic en un usuario para añadirlo al equipo
              </div>
            )}
          </div>
        )}
      >
        {searchResults.map(user => (
          <Option key={user.id} value={user.id} label={user.name} data={user}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
              <Avatar size="small" icon={<UserOutlined />} src={user.avatar} />
              <div style={{ marginLeft: '8px', flex: 1 }}>
                <div style={{ fontWeight: '500' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#000' }}>
                  {user.email} {user.username && `· @${user.username}`}
                </div>
              </div>
            </div>
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default UserSearch;