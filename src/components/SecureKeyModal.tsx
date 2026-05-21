
import React, { useState } from 'react';
import { Modal, Input, Button, Checkbox, message } from 'antd';
import { WarningOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { downloadTextFile } from '../utils/downloadHelper';

interface SecureKeyModalProps {
    open: boolean;
    privateKey: string;
    onSecure: () => void;
}

const SecureKeyModal: React.FC<SecureKeyModalProps> = ({ open, privateKey, onSecure }) => {
    const [isKeySaved, setIsKeySaved] = useState(false);

    const handleCopyKey = () => {
        navigator.clipboard.writeText(privateKey);
        message.success('Private Key berhasil disalin ke clipboard!');
    };

    const handleDownloadKey = () => {
        downloadTextFile(privateKey, "my_rsa_private_key.txt");
        message.success('Private Key berhasil diunduh!');
    };

    const handleConfirm = () => {
        setIsKeySaved(false);
        message.success('Sistem diamankan. Selamat datang di The Vault!');
        onSecure();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-red-500 border-b border-slate-100 pb-3">
                    <WarningOutlined className="text-xl" />
                    <span className="font-bold">Langkah Terakhir: Simpan Private Key Anda</span>
                </div>
            }
            open={open}
            closable={false}
            maskClosable={false}
            keyboard={false}
            footer={null}
            width={500}
            centered
        >
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 text-sm leading-relaxed">
                    Sistem kami menerapkan keamanan Sistem Terdistribusi (RSA). Kami <strong>TIDAK</strong> menyimpan Kunci Privat Anda di server. Jika kunci ini hilang, Anda tidak akan pernah bisa membaca pesan Anda lagi. Tidak ada fitur Lupa Password.
                </div>

                <Input.TextArea
                    value={privateKey}
                    readOnly
                    rows={6}
                    className="font-mono text-xs! bg-slate-800! text-green-400! border-none! p-4! rounded-lg! resize-none!"
                />

                <div className="flex gap-3">
                    <Button
                        icon={<CopyOutlined />}
                        onClick={handleCopyKey}
                        className="flex-1 rounded-lg! h-10!"
                    >
                        Copy Text
                    </Button>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadKey}
                        className="flex-1 rounded-lg! h-10!"
                    >
                        Download .TXT
                    </Button>
                </div>

                <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <Checkbox onChange={(e) => setIsKeySaved(e.target.checked)} checked={isKeySaved}>
                        <span className="text-sm font-medium text-slate-700">
                            Saya telah menyalin dan menyimpan Private Key ini di tempat yang aman.
                        </span>
                    </Checkbox>
                </div>

                <Button
                    type="primary"
                    size="large"
                    block
                    disabled={!isKeySaved}
                    onClick={handleConfirm}
                    className="mt-2 h-12! rounded-lg! font-semibold!"
                >
                    Amankan & Masuk Aplikasi
                </Button>
            </div>
        </Modal>
    );
};

export default SecureKeyModal;