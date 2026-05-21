import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, theme } from 'antd';
import { 
  InboxOutlined, EditOutlined, LogoutOutlined, 
  SafetyCertificateOutlined, UserOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import SecureKeyModal from '../components/SecureKeyModal';

const { Header, Sider, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = theme.useToken();
  
  const [collapsed, setCollapsed] = useState(false);
  const [isSecureModalOpen, setIsSecureModalOpen] = useState(false);
  const [newPrivateKey, setNewPrivateKey] = useState('');

  useEffect(() => {
    if (location.state?.newPrivateKey) {
      setNewPrivateKey(location.state.newPrivateKey);
      setIsSecureModalOpen(true);
      
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const menuItems = [
    { key: '/inbox', icon: <InboxOutlined />, label: 'Kotak Masuk', onClick: () => navigate('/inbox') },
    { key: '/compose', icon: <EditOutlined />, label: 'Tulis Pesan', onClick: () => navigate('/compose') },
  ];

  const handleLogout = () => { navigate('/'); };

  return (
    <Layout className="h-screen! overflow-hidden! font-sans!">
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} breakpoint="lg" theme="light" className="border-r! border-slate-200! shadow-sm!" width={260}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex-shrink-0 flex items-center justify-center border-b border-slate-100">
            <SafetyCertificateOutlined className="text-2xl! text-blue-600! mr-2!" />
            {!collapsed && <span className="text-xl font-bold text-slate-800 tracking-tight">Crypto<span className="text-blue-600">Mail</span></span>}
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} className="border-none! px-2!" />
          </div>
          <div className="p-4 border-t border-slate-100 flex-shrink-0">
            {!collapsed ? (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-slate-700 truncate">Lucky Fauzi</span>
                    <span className="text-xs text-slate-400">@luckyfauzi</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider">RSA Secured</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center"><Avatar style={{ backgroundColor: token.colorPrimary }} icon={<UserOutlined />} /></div>
            )}
          </div>
        </div>
      </Sider>

      <Layout className="flex flex-col h-full">
        <Header className="bg-white! border-b! border-slate-200! px-6! flex! justify-end! items-center! shadow-sm! h-16! flex-shrink-0!">
          <div className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition-colors text-slate-500" onClick={handleLogout}>
            <span className="text-sm font-medium hidden sm:block">Keluar Sesi</span><LogoutOutlined />
          </div>
        </Header>

        <Content className="p-4! sm:p-6! bg-slate-50! overflow-y-auto! flex-1!">
          <Outlet />
        </Content>
      </Layout>

      <SecureKeyModal 
        open={isSecureModalOpen} 
        privateKey={newPrivateKey} 
        onSecure={() => setIsSecureModalOpen(false)} 
      />
    </Layout>
  );
};

export default DashboardLayout;