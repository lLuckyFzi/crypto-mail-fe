import React, { useState } from 'react';
import { Button, Input, Form, Segmented, message } from 'antd';
import { UserOutlined, KeyOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../hooks/mutations/useAuth';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'Masuk' | 'Daftar'>('Masuk');

    const registerMutation = useRegister();
    const loginMutation = useLogin();

    const handleSubmit = (values: { username: string; privateKey?: string }) => {
        const payload = { username: values.username };

        if (mode === 'Daftar') {
            registerMutation.mutate(payload, {
                onSuccess: (res) => {
                    localStorage.setItem('user', JSON.stringify({
                        user_id: res.data.user_id,
                        username: res.data.username
                    }));
                    
                    navigate('/inbox', { state: { newPrivateKey: res.data.private_key } });
                },
                onError: (error: any) => {
                    const errorMsg = error.response?.data?.message || 'Gagal mendaftar';
                    message.error(errorMsg);
                }
            });
        } else {
            loginMutation.mutate(payload, {
                onSuccess: (res) => {
                    localStorage.setItem('user', JSON.stringify({
                        user_id: res.data.user_id,
                        username: res.data.username
                    }));

                    if (values.privateKey) {
                        localStorage.setItem('private_key', values.privateKey);
                    }

                    message.success(res.message);
                    navigate('/inbox');
                },
                onError: (error: any) => {
                    const errorMsg = error.response?.data?.message || 'Gagal masuk';
                    message.error(errorMsg);
                }
            });
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans">
            <div className="hidden md:flex md:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center flex-col p-12 text-center">
                <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614064641913-6b53cb9c02d1?q=80&w=2000&auto=format&fit=crop')" }} />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
                <div className="relative z-10 flex flex-col items-center">
                    <SafetyCertificateOutlined className="text-7xl text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Crypto<span className="text-blue-500">Mail</span></h1>
                    <p className="text-slate-300 text-lg max-w-md leading-relaxed">
                        Sistem komunikasi terdistribusi dengan enkripsi asimetris tingkat lanjut. Data Anda adalah milik Anda sepenuhnya.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome to The Vault.</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Generate kunci RSA-mu sekarang dan rasakan pertukaran pesan yang terenkripsi sepenuhnya.
                        </p>
                    </div>

                    <div className="mb-8">
                        <Segmented block size="large" options={['Masuk', 'Daftar']} value={mode} onChange={(val) => setMode(val as 'Masuk' | 'Daftar')} className="bg-slate-200/60 p-1 rounded-lg" />
                    </div>

                    <Form layout="vertical" onFinish={handleSubmit} autoComplete="off" className="space-y-4">
                        <Form.Item label={<span className="text-slate-700 font-medium">Username</span>} name="username" rules={[{ required: true, message: 'Username tidak boleh kosong!' }]}>
                            <Input size="large" prefix={<UserOutlined className="text-slate-400" />} placeholder="Masukkan username Anda" className="rounded-lg hover:border-blue-500 focus:border-blue-500" />
                        </Form.Item>

                        {mode === 'Masuk' && (
                            <Form.Item label={<span className="text-slate-700 font-medium">Private Key</span>} name="privateKey" rules={[{ required: true, message: 'Private Key dibutuhkan untuk membuka sesi!' }]} className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <Input.TextArea size="large" rows={4} placeholder="Paste Private Key RSA Anda di sini..." className="rounded-lg font-mono text-sm hover:border-blue-500 focus:border-blue-500 bg-slate-50" />
                            </Form.Item>
                        )}

                        <Form.Item className="mt-8 mb-0">
                            <Button type="primary" htmlType="submit" size="large" block className="h-12 rounded-lg text-base font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.01]">
                                {mode === 'Masuk' ? 'Akses Kotak Masuk' : 'Generate Keys & Daftar'}
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2"><KeyOutlined />Secured by Rivest–Shamir–Adleman (RSA) Algorithm</p>
                </div>
            </div>
        </div>
    );
};

export default Auth;