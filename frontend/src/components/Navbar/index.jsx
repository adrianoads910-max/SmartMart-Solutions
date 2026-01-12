import React, { useState } from 'react';
import { Layout, Menu, Avatar, theme } from 'antd';
import { DashboardOutlined, ShoppingOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className="min-h-screen w-full">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)} 
        theme="light"
        className="shadow-md z-10"
      >
        <div className="h-16 flex items-center justify-center border-b">
            <div className="flex items-center gap-2 font-bold text-xl text-teal-700">
                <ShopOutlined className="text-2xl" />
                {!collapsed && <span>SmartMart</span>}
            </div>
        </div>
        <Menu
          theme="light"
          defaultOpenKeys={['sub-products']}
          selectedKeys={[location.pathname]}
          mode="inline"
          className="border-r-0"
          onClick={({ key }) => {
            navigate(key);
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
                    { key: '/products/add', label: 'Adicionar Produto' },
                ]
            }
          ]}
        />
      </Sider>
      
      {/* --- CORREÇÃO BLINDADA AQUI --- */}
      {/* Adicionei 'minHeight: "100vh"' e 'display: "flex"', 'flexDirection: "column"' */}
      <Layout style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <Header 
            style={{ background: colorBgContainer }} 
            className="flex justify-end items-center px-8 shadow-sm"
        >
             <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="text-right leading-tight hidden md:block">
                    <div className="text-sm font-semibold text-gray-700">Admin User</div>
                    <div className="text-xs text-gray-500">Gerente</div>
                </div>
                <Avatar size="large" icon={<UserOutlined />} className="bg-teal-600" />
             </div>
        </Header>
        
        {/* flex: 1 faz o conteúdo empurrar o fundo até o final se necessário */}
        <Content className="m-6" style={{ flex: 1 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;