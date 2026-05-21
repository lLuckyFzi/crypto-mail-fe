import React from 'react';
import { Button, Checkbox } from 'antd';

const dummyMessages = [
    { id: 1, sender: 'Johannes', date: '26 August 2025', ciphertext: '[ 18273, 91827, 44512, 90123, 77123, 88212, 99123, 11234, 55123, 66123 ]' },
    { id: 2, sender: 'Johannes', date: '26 August 2025', ciphertext: '[ 18273, 91827, 44512, 90123, 77123, 88212, 99123, 11234, 55123, 66123 ]' },
    { id: 3, sender: 'Johannes', date: '26 August 2025', ciphertext: '[ 18273, 91827, 44512, 90123, 77123, 88212, 99123, 11234, 55123, 66123 ]' },
];

const Inbox: React.FC = () => {
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
                    <div
                        key={msg.id}
                        className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow"
                    >
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
                            className="w-full! bg-slate-200! border-none! text-slate-700! font-medium! hover:bg-slate-300! hover:text-slate-800! h-10! rounded-lg! mt-auto"
                        >
                            Dekripsi Pesan
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inbox;