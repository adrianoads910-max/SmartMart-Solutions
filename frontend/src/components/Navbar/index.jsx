import React, { useState } from 'react';
import { Layout, Menu, Avatar, theme } from 'antd';
import { DashboardOutlined, ShoppingOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom'; // Importante para navegação

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  // Hooks para navegação
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className="min-h-screen">
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light">
        <div className="h-16 flex items-center justify-center border-b">
            <div className="flex items-center gap-2 font-bold text-xl text-teal-700">
                <ShopOutlined className="text-2xl" />
                {!collapsed && <span>SmartMart</span>}
            </div>
        </div>
        <Menu
          theme="light"
          // O Ant Design detecta se deve abrir o submenu baseado na rota
          defaultOpenKeys={['sub-products']} 
          selectedKeys={[location.pathname]} // Marca o item ativo baseado na URL
          mode="inline"
          className="border-r-0"
          onClick={({ key }) => {
            navigate(key); // Navega direto para a chave (que será a rota)
          }}
          items={[
            { 
                key: '/', 
                icon: <DashboardOutlined />, 
                label: 'Dashboard' 
            },
            {
                key: 'sub-products',
                icon: <ShoppingOutlined />,
                label: 'Produtos',
                children: [
                    { key: '/products', label: 'Lista de Produtos' },
                    { key: '/products/add', label: 'Adicionar Produto' }, // Nova Rota
                ]
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className="flex justify-end items-center px-6 shadow-sm">
             <div className="flex items-center gap-2">
                <span className="text-gray-600">Admin User</span>
                <Avatar icon={<UserOutlined />} />
             </div>
        </Header>
        <Content className="m-6" style={{ minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;