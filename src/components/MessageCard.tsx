import React from 'react';
import { Button, Checkbox } from 'antd';

export interface MessageData {
    id: number;
    sender: string;
    date: string;
    ciphertext: string;
}

interface MessageCardProps {
    msg: MessageData;
    onDecrypt: (msg: MessageData) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ msg, onDecrypt }) => {
    return (
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Checkbox className="scale-110!" />
                    <span className="font-semibold text-slate-800">{msg.sender}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{msg.date}</span>
            </div>

            <div className="mb-6 flex-1">
                <p className="font-mono text-xs sm:text-sm text-slate-400 tracking-wider break-all line-clamp-3">
                    {msg.ciphertext}
                </p>
            </div>

            <Button
                type="default"
                onClick={() => onDecrypt(msg)}
                className="w-full! bg-slate-200! border-none! text-slate-700! font-medium! hover:bg-slate-300! hover:text-slate-800! h-10! rounded-lg! mt-auto"
            >
                Dekripsi Pesan
            </Button>
        </div>
    );
};

export default MessageCard;