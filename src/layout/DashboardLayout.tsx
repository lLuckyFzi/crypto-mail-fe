import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, theme, message, Modal, Input, Button } from 'antd';
import {
  InboxOutlined, EditOutlined, LogoutOutlined,
  SafetyCertificateOutlined, UserOutlined,
  WarningOutlined,
  KeyOutlined
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
  const [currentUser, setCurrentUser] = useState<{ username: string; user_id: number } | null>(null);
  const [hasPrivateKey, setHasPrivateKey] = useState<boolean>(false);
  const [isInputKeyModalOpen, setIsInputKeyModalOpen] = useState(false);
  const [manualInputKey, setManualInputKey] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    } else {
      navigate('/');
      return;
    }

    const storedKey = localStorage.getItem('private_key');
    if (storedKey) {
      setHasPrivateKey(true);
    } else {
      setHasPrivateKey(false);
    }

    if (location.state?.newPrivateKey) {
      setNewPrivateKey(location.state.newPrivateKey);
      setIsSecureModalOpen(true);
      setHasPrivateKey(true);

      window.history.replaceState({}, document.title);
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleSaveManualKey = () => {
    if (!manualInputKey.trim()) {
      message.error('Kunci tidak boleh kosong!');
      return;
    }

    localStorage.setItem('private_key', manualInputKey.trim());
    setHasPrivateKey(true);
    setIsInputKeyModalOpen(false);
    setManualInputKey('');
    message.success('Kunci berhasil diamankan di sesi ini!');
  };

  const menuItems = [
    { key: '/inbox', icon: <InboxOutlined />, label: 'Kotak Masuk', onClick: () => navigate('/inbox') },
    { key: '/compose', icon: <EditOutlined />, label: 'Tulis Pesan', onClick: () => navigate('/compose') },
  ];

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
                    <span className="text-sm font-semibold text-slate-700 truncate">
                      {currentUser ? currentUser.username : 'Memuat...'}
                    </span>
                    <span className="text-xs text-slate-400">
                      @{currentUser ? currentUser.username.toLowerCase() : 'user'}
                    </span>
                  </div>
                </div>

                {hasPrivateKey ? (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider">RSA Secured</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 mt-2 cursor-pointer hover:bg-red-50 p-1 -ml-1 rounded transition-colors"
                    onClick={() => setIsInputKeyModalOpen(true)}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">Kunci Tidak Ditemukan</span>
                  </div>
                )}
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

      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800 pb-2">
            <WarningOutlined className="text-amber-500 text-xl" />
            <span className="font-bold">Sistem Tidak Mengunci Sesi Ini</span>
          </div>
        }
        open={isInputKeyModalOpen}
        onCancel={() => setIsInputKeyModalOpen(false)}
        footer={null}
        centered
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-700 text-sm leading-relaxed">
            Aplikasi mendeteksi ketiadaan Private Key di memori *browser* Anda saat ini. Anda tetap bisa mengirim pesan, namun tidak bisa membaca pesan masuk.
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">
              Masukkan Private Key Anda
            </label>
            <Input.TextArea
              rows={5}
              value={manualInputKey}
              onChange={(e) => setManualInputKey(e.target.value)}
              placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;d=...&#10;n=...&#10;-----END RSA PRIVATE KEY-----"
              className="font-mono text-xs! hover:border-blue-500! focus:border-blue-500! rounded-lg!"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => setIsInputKeyModalOpen(false)} className="rounded-lg! h-10!">
              Batal
            </Button>
            <Button type="primary" icon={<KeyOutlined />} onClick={handleSaveManualKey} className="rounded-lg! h-10!">
              Amankan Sesi
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>

  );
};

export default DashboardLayout;