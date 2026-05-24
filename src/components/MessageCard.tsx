import React from 'react';
import { Button, Checkbox, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { MessageData } from '../types/message.type';

interface MessageCardProps {
    msg: MessageData;
    decryptedText?: string;
    onDecrypt: (msg: MessageData) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ msg, decryptedText, onDecrypt }) => {
    return (
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Checkbox className="scale-110!" />
                    <span className="text-slate-800">
                        Pengirim: <b>{msg.sender_name}</b>
                    </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                    {msg.dibuat_pada ? new Date(msg.dibuat_pada).toLocaleDateString() : 'Waktu tidak diketahui'}
                </span>
            </div>

            <div className="mb-6 flex-1">
                {decryptedText ? (
                    <div className="bg-green-50 border border-green-100 p-3 rounded-lg animate-in fade-in">
                        <span className="text-xs font-bold text-green-700 block mb-1">Pesan Terbaca:</span>
                        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {decryptedText}
                        </p>
                    </div>
                ) : (
                    <p className="font-mono text-xs sm:text-sm text-slate-400 tracking-wider break-all line-clamp-3">
                        {msg.ciphertext}
                    </p>
                )}
            </div>

            {decryptedText ? (
                <Tag icon={<CheckCircleOutlined />} color="success" className="w-full! text-center! py-2! border-none! bg-green-100! text-green-700! rounded-lg! text-sm!">
                    Pesan Terdekripsi
                </Tag>
            ) : (
                <Button
                    type="default"
                    onClick={() => onDecrypt(msg)}
                    className="w-full! bg-slate-200! border-none! text-slate-700! font-medium! hover:bg-slate-300! hover:text-slate-800! h-10! rounded-lg! mt-auto"
                >
                    Dekripsi Pesan
                </Button>
            )}
        </div>
    );
};

export default MessageCard;