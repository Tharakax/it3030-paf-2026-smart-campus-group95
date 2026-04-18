import React, { useState, useEffect, useContext } from 'react';
import { 
    Send, 
    X, 
    Users, 
    Wrench, 
    User, 
    Globe, 
    AlertCircle, 
    Loader2, 
    Check,
    MessageSquare,
    Type
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';
import notificationService from '../../api/notificationService';
import Modal from '../Common/Modal';
import { AuthContext } from '../../context/AuthContext';
import SearchableDropdown from '../Common/SearchableDropdown';

const SendNotificationModal = ({ isOpen, onClose }) => {
    const { user: currentUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const [users, setUsers] = useState([]);
    
    const [form, setForm] = useState({
        targetType: 'ALL_USERS',
        targetId: '',
        targetName: '',
        title: '',
        message: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && (form.targetType === 'SPECIFIC_USER' || form.targetType === 'SPECIFIC_TECHNICIAN')) {
            fetchTargetUsers();
        }
    }, [isOpen, form.targetType]);

    const fetchTargetUsers = async () => {
        setFetchingUsers(true);
        try {
            const role = form.targetType === 'SPECIFIC_USER' ? 'USER' : 'TECHNICIAN';
            const res = await api.get(`/users/lookup?role=${role}`);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch user directory");
        } finally {
            setFetchingUsers(false);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.title) newErrors.title = "Title is required";
        if (form.title.length > 80) newErrors.title = "Title must be under 80 characters";
        if (!form.message) newErrors.message = "Message is required";
        if (form.message.length > 500) newErrors.message = "Message must be under 500 characters";
        if ((form.targetType === 'SPECIFIC_USER' || form.targetType === 'SPECIFIC_TECHNICIAN') && !form.targetId) {
            newErrors.targetId = "Please select a specific recipient";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await notificationService.sendCustomNotification({
                targetType: form.targetType,
                targetId: form.targetId,
                title: form.title,
                message: form.message
            });
            toast.success("Notification dispatched successfully!");
            setForm({
                targetType: 'ALL_USERS',
                targetId: '',
                targetName: '',
                title: '',
                message: ''
            });
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to send notification";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const targetOptions = [
        { id: 'ALL_USERS', label: 'All Standard Users', icon: Users, roles: ['ADMIN', 'TECHNICIAN'] },
        { id: 'ALL_TECHNICIANS', label: 'All Technicians', icon: Wrench, roles: ['ADMIN'] },
        { id: 'SPECIFIC_USER', label: 'Particular User', icon: User, roles: ['ADMIN', 'TECHNICIAN'] },
        { id: 'SPECIFIC_TECHNICIAN', label: 'Particular Technician', icon: Wrench, roles: ['ADMIN'] },
    ].filter(opt => opt.roles.includes(currentUser?.role));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Broadcast Notification"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 flex gap-5 mb-4">
                    <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
                        <Globe size={24} />
                    </div>
                    <div>
                        <p className="font-black text-slate-800 uppercase tracking-widest text-[11px] mb-1">Signal Broadcast</p>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            {currentUser?.role === 'ADMIN' 
                                ? "Admins can broadcast to any group or individual within the UniSync ecosystem."
                                : "Technicians can send messages to all standard users or specific individuals."}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Target Selection */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Recipient Group</label>
                        <div className="grid grid-cols-2 gap-3">
                            {targetOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setForm({ ...form, targetType: opt.id, targetId: '', targetName: '' })}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                                        form.targetType === opt.id 
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100' 
                                            : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <opt.icon size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Specific Recipient Dropdown */}
                    {(form.targetType === 'SPECIFIC_USER' || form.targetType === 'SPECIFIC_TECHNICIAN') && (
                        <div className="animate-in slide-in-from-top-4 duration-300">
                            <SearchableDropdown
                                label="Select Recipient"
                                placeholder={fetchingUsers ? "Syncing directory..." : "Search by name or email..."}
                                options={users.map(u => `${u.name} (${u.email})`)}
                                value={form.targetName}
                                onSelect={(val) => {
                                    const selectedUser = users.find(u => `${u.name} (${u.email})` === val);
                                    setForm({ ...form, targetId: selectedUser.id, targetName: val });
                                }}
                                error={errors.targetId}
                                disabled={fetchingUsers}
                            />
                        </div>
                    )}

                    {/* Title */}
                    <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Subject / Title</label>
                        <div className="relative">
                            <Type className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.title ? 'text-red-400' : 'text-slate-300 group-focus-within:text-indigo-600'}`} />
                            <input 
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Short, descriptive subject"
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
                                placeholder="Compose your notification broadcast here..."
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
                                <Send size={18} /> 
                                Dispatch Alert
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SendNotificationModal;
