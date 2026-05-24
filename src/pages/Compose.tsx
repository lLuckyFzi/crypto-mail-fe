import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, Tooltip, message as antdMessage } from 'antd';
import {
    SearchOutlined,
    LockOutlined,
    InfoCircleOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    LoadingOutlined
} from '@ant-design/icons';
import { useSendMessage } from '../hooks/mutations/useMessageMutation';
import { findUserByUsername } from '../services/user.service';
import type { UserData } from '../types';
import { encryptRSA } from '../utils/rsaUtils';

const Compose: React.FC = () => {
    const currentUser = useMemo(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }, []);

    const [recipient, setRecipient] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [targetUser, setTargetUser] = useState<UserData | null>(null);

    const [plainText, setPlainText] = useState('');
    const [cipherText, setCipherText] = useState('');

    const sendMessageMutation = useSendMessage();

    useEffect(() => {
        if (!recipient) {
            setTargetUser(null);
            setIsValidating(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsValidating(true);
            try {
                const res = await findUserByUsername(recipient);
                if (res && res.data) {
                    setTargetUser(res.data);
                    if (plainText) {
                        setCipherText(encryptRSA(plainText, res.data.public_key_e, res.data.public_key_n));
                    }
                }
            } catch (error) {
                setTargetUser(null);
            } finally {
                setIsValidating(false);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [recipient]);


    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setPlainText(val);

        if (!val) {
            setCipherText('');
            return;
        }

        const target = targetUser;
        const publicKeyE = target?.public_key_e;
        const publicKeyN = target?.public_key_n;
        const encrypted = encryptRSA(val, publicKeyE as string, publicKeyN as string);
        setCipherText(encrypted);
    };

    const handleKirimPesan = () => {
        if (!targetUser || !cipherText || !currentUser) {
            antdMessage.error('Pastikan Anda sudah login dan data penerima valid.');
            return;
        }

        sendMessageMutation.mutate({
            sender_id: currentUser?.user_id,
            receiver_id: targetUser.user_id,
            ciphertext: cipherText
        }, {
            onSuccess: () => {
                antdMessage.success('Pesan rahasia berhasil dikirim!');
                setPlainText('');
                setCipherText('');
                setRecipient('');
            },
            onError: (err: any) => {
                const errorMsg = err.response?.data?.message || err.message;
                antdMessage.error('Gagal mengirim pesan: ' + errorMsg);
            }
        });
    };

    const isValidUser = recipient ? (isValidating ? null : !!targetUser) : null;

    let suffixIcon = null;
    if (isValidating) suffixIcon = <LoadingOutlined className="text-blue-500! text-lg!" />;
    else if (targetUser) suffixIcon = <CheckCircleFilled className="text-green-500! text-lg!" />;
    else if (recipient && !targetUser && !isValidating) suffixIcon = <CloseCircleFilled className="text-red-500! text-lg!" />;

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                    Kirim Pesan Terenkripsi
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm max-w-3xl">
                    Kunci pesan Anda sebelum terkirim. Teks akan dienkripsi secara lokal menggunakan Kunci Publik penerima sehingga tidak bisa dibaca oleh pihak ketiga.
                </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Kepada</label>
                    <Input
                        size="large"
                        prefix={<SearchOutlined className="text-slate-400!" />}
                        suffix={suffixIcon}
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Ketik username penerima..."
                        className={`rounded-lg! transition-colors duration-300 ${isValidUser === false
                            ? 'border-red-400! hover:border-red-500! focus:border-red-500!'
                            : 'hover:border-blue-500! focus:border-blue-500!'
                            }`}
                    />

                    <div className="h-5 mt-1">
                        {isValidUser === true && (
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1 animate-in fade-in">
                                <LockOutlined /> Public Key untuk "{recipient}" berhasil dimuat. Siap mengenkripsi.
                            </p>
                        )}
                        {isValidUser === false && (
                            <p className="text-xs text-red-500 font-medium animate-in fade-in">
                                Username tidak ditemukan dalam jaringan.
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="flex flex-col">
                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                            Pesan Asli (Plaintext)
                        </label>
                        <div className="relative flex-1">
                            <Input.TextArea
                                value={plainText}
                                onChange={handleTextChange}
                                placeholder="Masukkan pesan rahasia di sini..."
                                disabled={!isValidUser}
                                className={`rounded-xl! h-48! sm:h-64! resize-none! bg-slate-50! p-4! ${!isValidUser ? 'cursor-not-allowed! opacity-60!' : 'border-slate-200! hover:border-blue-500! focus:border-blue-500!'
                                    }`}
                                maxLength={800}
                            />
                            <span className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium bg-slate-50 px-1 rounded">
                                {plainText.length}/800
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center justify-between">
                            <span>Hasil Enkripsi (Ciphertext)</span>
                            <Tooltip title="Data angka acak ini yang akan dikirim dan disimpan ke Database MySQL.">
                                <InfoCircleOutlined className="cursor-help" />
                            </Tooltip>
                        </label>
                        <Input.TextArea
                            value={cipherText}
                            readOnly
                            placeholder={isValidUser ? "Menunggu input teks..." : "Menunggu target penerima..."}
                            className="rounded-xl! h-48! sm:h-64! resize-none! bg-slate-800! text-green-400! border-none! font-mono! p-4! tracking-wider! leading-relaxed!"
                        />
                    </div>

                </div>

                <div className="flex justify-end mt-2">
                    <Button
                        type="primary"
                        size="large"
                        icon={<LockOutlined />}
                        disabled={!plainText || !targetUser}
                        loading={sendMessageMutation.isPending}
                        className="w-full md:w-auto h-12! rounded-lg! px-8! font-semibold! shadow-lg! shadow-blue-500/30!"
                        onClick={handleKirimPesan}
                    >
                        Kirim Pesan
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default Compose;