// src/pages/Inbox.tsx

import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { KeyOutlined, UnlockOutlined } from '@ant-design/icons';
import type { MessageData } from '../components/MessageCard';
import MessageCard from '../components/MessageCard';

const dummyMessages: MessageData[] = [
    { id: 1, sender: 'Johannes', date: '26 August 2025', ciphertext: '[ 18273, 91827, 44512, 90123, 77123, 88212, 99123, 11234, 55123, 66123 ]' },
    { id: 2, sender: 'Budi', date: '26 August 2025', ciphertext: '[ 55123, 66123, 18273, 91827, 44512, 90123, 77123, 88212, 99123, 11234 ]' },
    { id: 3, sender: 'Siti', date: '26 August 2025', ciphertext: '[ 99123, 11234, 55123, 66123, 18273, 91827, 44512, 90123, 77123, 88212 ]' },
];

const Inbox: React.FC = () => {
    const [isKeyModalVisible, setIsKeyModalVisible] = useState(false);
    const [inputKey, setInputKey] = useState('');
    
    const [pendingMessage, setPendingMessage] = useState<MessageData | null>(null);

    const handleDecryptClick = (msg: MessageData) => {
        const storedKey = localStorage.getItem('private_key');
        
        if (!storedKey) {
            setPendingMessage(msg);
            setIsKeyModalVisible(true);
        } else {
            processDecryption(msg, storedKey);
        }
    };

    const processDecryption = (msg: MessageData, privateKey: string) => {
        console.log(`Mendekripsi pesan ${msg.id} dengan kunci:`, privateKey);
        message.success(`Pesan dari ${msg.sender} berhasil didekripsi!`);
    };

    const handleSaveKey = () => {
        if (!inputKey.trim()) {
            message.error('Private Key tidak boleh kosong!');
            return;
        }

        localStorage.setItem('private_key', inputKey.trim());
        message.success('Kunci berhasil diamankan di memori browser.');
        
        setIsKeyModalVisible(false);
        setInputKey('');

        if (pendingMessage) {
            processDecryption(pendingMessage, inputKey.trim());
            setPendingMessage(null); // Bersihkan antrean
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                    Kotak Masuk Terenkripsi
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm max-w-3xl">
                    Semua pesan di bawah ini ditarik langsung dari database dalam bentuk Ciphertext. Hanya Private Key Anda yang bisa mengurainya.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {dummyMessages.map((msg) => (
                    <MessageCard 
                        key={msg.id} 
                        msg={msg} 
                        onDecrypt={handleDecryptClick} 
                    />
                ))}
            </div>

            <Modal
                title={
                    <div className="flex items-center gap-2 text-slate-800 pb-2">
                        <UnlockOutlined className="text-blue-500 text-xl" />
                        <span className="font-bold">Otorisasi Dibutuhkan</span>
                    </div>
                }
                open={isKeyModalVisible}
                onCancel={() => {
                    setIsKeyModalVisible(false);
                    setPendingMessage(null);
                }}
                footer={null}
                centered
            >
                <div className="flex flex-col gap-4 mt-2">
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-700 text-sm leading-relaxed">
                        Sistem mendeteksi Anda belum memasukkan <strong>Kunci Privat (Private Key)</strong> di sesi ini. Silakan masukkan kunci Anda untuk membuka isi pesan.
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">
                            Private Key Anda
                        </label>
                        <Input.TextArea
                            rows={5}
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;d=...&#10;n=...&#10;-----END RSA PRIVATE KEY-----"
                            className="font-mono text-xs! hover:border-blue-500! focus:border-blue-500! rounded-lg!"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <Button 
                            onClick={() => {
                                setIsKeyModalVisible(false);
                                setPendingMessage(null);
                            }}
                            className="rounded-lg! h-10!"
                        >
                            Batal
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<KeyOutlined />}
                            onClick={handleSaveKey}
                            className="rounded-lg! h-10!"
                        >
                            Simpan Kunci & Dekripsi
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default Inbox;