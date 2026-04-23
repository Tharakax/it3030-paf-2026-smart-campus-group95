import React, { useState, useEffect } from 'react';
import { 
    Send, 
    X, 
    Type,
    MessageSquare,
    Loader2,
    Save,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import notificationService from '../../api/notificationService';
import Modal from '../Common/Modal';

const EditBroadcastModal = ({ isOpen, onClose, broadcast, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        message: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && broadcast) {
            setForm({
                title: broadcast.title || '',
                message: broadcast.message || ''
            });
        }
    }, [isOpen, broadcast]);

    const validate = () => {
        const newErrors = {};
        if (!form.title) newErrors.title = "Title is required";
        if (form.title.length > 80) newErrors.title = "Title must be under 80 characters";
        if (!form.message) newErrors.message = "Message is required";
        if (form.message.length > 500) newErrors.message = "Message must be under 500 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            const broadcastId = broadcast.broadcastId || broadcast.id;
            await notificationService.updateBroadcast(broadcastId, {
                title: form.title,
                message: form.message
            });
            toast.success("Broadcast updated and recipients re-notified!");
            onSuccess();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update broadcast";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Sent Broadcast"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 flex gap-5 mb-4">
                    <div className="bg-amber-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-100">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="font-black text-slate-800 uppercase tracking-widest text-[11px] mb-1">Update Protocol</p>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            Editing this broadcast will reset the status to <span className="text-amber-600 font-bold">Unread</span> for all {broadcast?.recipientCount || 'current'} recipients.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Title */}
                    <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Broadcast Subject</label>
                        <div className="relative">
                            <Type className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.title ? 'text-red-400' : 'text-slate-300 group-focus-within:text-indigo-600'}`} />
                            <input 
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Edit title..."
                                className={`w-full pl-12 pr-6 py-4 bg-slate-50 border transition-all rounded-2xl text-sm font-bold text-slate-700 outline-none ${
                                    errors.title ? 'border-red-200 ring-4 ring-red-50' : 'border-transparent focus:ring-4 focus:ring-indigo-100'
                                }`}
                            />
                        </div>
                        {errors.title && <p className="text-[10px] font-bold text-red-500 mt-1 ml-2">{errors.title}</p>}
                    </div>

                    {/* Message */}
                    <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Message Content</label>
                        <div className="relative">
                            <MessageSquare className={`absolute left-5 top-5 w-4 h-4 transition-colors ${errors.message ? 'text-red-400' : 'text-slate-300 group-focus-within:text-indigo-600'}`} />
                            <textarea 
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                placeholder="Edit message content..."
                                rows={4}
                                className={`w-full pl-12 pr-6 py-4 bg-slate-50 border transition-all rounded-2xl text-sm font-medium text-slate-700 outline-none resize-none ${
                                    errors.message ? 'border-red-200 ring-4 ring-red-50' : 'border-transparent focus:ring-4 focus:ring-indigo-100'
                                }`}
                            />
                        </div>
                        <div className="flex justify-between mt-1 px-2">
                            {errors.message ? <p className="text-[10px] font-bold text-red-500">{errors.message}</p> : <div />}
                            <p className={`text-[10px] font-bold ${form.message.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>
                                {form.message.length} / 500
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-4 bg-indigo-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <Save size={18} /> 
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditBroadcastModal;
