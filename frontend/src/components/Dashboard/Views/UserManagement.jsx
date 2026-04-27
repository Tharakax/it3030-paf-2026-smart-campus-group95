import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
    Users,
    Search,
    UserPlus,
    Loader2,
    Shield,
    Wrench,
    User,
    Mail,
    MoreVertical,
    Edit3,
    Trash2,
    X,
    Check,
    ChevronDown,
    MapPin,
    AlertCircle,
    Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '../../../api/axiosConfig';
import Modal from '../../Common/Modal';
import { AuthContext } from '../../../context/AuthContext';

const UserManagement = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        role: '',
        specialization: ''
    });

    // Add Technician Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        name: '',
        email: '',
        password: '',
        specialization: ''
    });

    const categories = [
        'ELECTRICAL', 'IT_NETWORK', 'PROJECTOR_AV', 'FURNITURE', 
        'PLUMBING', 'AC_VENTILATION', 'CLEANING', 'SAFETY_SECURITY', 
        'LAB_EQUIPMENT', 'OTHER'
    ];

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            toast.error('Failed to fetch system users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
            const matchesSearch = !searchQuery || 
                u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesRole && matchesSearch;
        });
    }, [users, roleFilter, searchQuery]);

    const handleEditClick = (userToEdit) => {
        setEditingUser(userToEdit);
        setEditForm({
            role: userToEdit.role,
            specialization: userToEdit.specialization || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        
        if (editingUser.id === currentUser.id && editForm.role !== 'ADMIN') {
            toast.error("Security Protocol: You cannot revoke your own administrative rights.");
            return;
        }

        try {
            const res = await api.put(`/admin/users/${editingUser.id}`, {
                ...editingUser,
                role: editForm.role,
                specialization: editForm.role === 'TECHNICIAN' ? editForm.specialization : null
            });
            
            setUsers(users.map(u => u.id === editingUser.id ? res.data : u));
            toast.success(`${editingUser.name}'s profile updated successfully.`);
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error('Failed to update user permissions.');
        }
    };

    const handleAddTechnician = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (addForm.password.length < 6) {
            toast.error("Security Protocol: Password must be at least 6 characters.");
            return;
        }

        try {
            const res = await api.post('/admin/technicians', addForm);
            setUsers([res.data, ...users]);
            toast.success(`Technician ${addForm.name} provisioned successfully.`);
            setIsAddModalOpen(false);
            setAddForm({ name: '', email: '', password: '', specialization: '' });
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to provision technician.';
            toast.error(message);
        }
    };

    const handleDeleteUser = async (userToDelete) => {
        if (userToDelete.id === currentUser.id) {
            Swal.fire({
                title: 'Operation Denied',
                text: 'System security prevents you from deleting your own root account.',
                icon: 'error',
                confirmButtonColor: '#2563eb'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Permanent Deletion?',
            text: `This will completely remove ${userToDelete.name} from the UniSync ecosystem. This action is irreversible.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Yes, Delete Account'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/users/${userToDelete.id}`);
                setUsers(users.filter(u => u.id !== userToDelete.id));
                toast.success('User account decommissioned.');
            } catch (err) {
                toast.error('Failed to delete user.');
            }
        }
    };

    const getRoleBadge = (role) => {
        switch(role) {
            case 'ADMIN':
                return <span className="bg-purple-100/80 text-purple-700 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-purple-200"><Shield size={12} /> Root Admin</span>;
            case 'TECHNICIAN':
                return <span className="bg-blue-100/80 text-blue-700 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-blue-200"><Wrench size={12} /> Technician</span>;
            default:
                return <span className="bg-slate-100/80 text-slate-600 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-slate-200"><User size={12} /> Standard User</span>;
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter">
                        User <span className="text-blue-600 underline decoration-emerald-400 decoration-4">Management</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Security Node: Global Permission Control</p>
                </div>
                
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        <UserPlus size={16} /> Add Technician
                    </button>
                    
                    <div className="h-10 w-[1.5px] bg-slate-100 hidden md:block" />
                    
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-800">{users.length}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Entities</p>
                    </div>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 mb-8 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search by name or email identity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                </div>

                <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl gap-1">
                    {['ALL', 'ADMIN', 'TECHNICIAN', 'USER'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                roleFilter === role 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Grid/Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Decrypting User Directory...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="text-slate-200" size={32} />
                    </div>
                    <p className="text-slate-800 font-black text-xl">No entities match your search</p>
                    <p className="text-slate-400 mt-2 text-sm font-medium">Try broader criteria or reset filters.</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/30">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Role</th>
                                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Specialization</th>
                                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">System Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img 
                                                    src={u.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`} 
                                                    className="w-12 h-12 rounded-2xl object-cover shadow-sm border-2 border-white ring-1 ring-slate-100" 
                                                    alt="" 
                                                />
                                                {u.id === currentUser.id && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                                                    {u.name}
                                                    {u.id === currentUser.id && <span className="text-[9px] bg-slate-800 text-white px-1.5 py-0.5 rounded leading-none">Self</span>}
                                                </p>
                                                <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                    <Mail size={12} className="opacity-50" /> {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                     <td className="px-8 py-6">
                                        {getRoleBadge(u.role)}
                                    </td>
                                    <td className="px-8 py-6">
                                        {u.contactNumber ? (
                                            <p className="text-xs font-bold text-slate-600 tracking-tight flex items-center gap-1.5">
                                                <Phone size={12} className="text-slate-400" /> {u.contactNumber}
                                            </p>
                                        ) : (
                                            <span className="text-[10px] font-black text-slate-300 uppercase italic">Not Provided</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {u.role === 'TECHNICIAN' ? (
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                                                {u.specialization?.replace('_', ' ') || 'General Duty'}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-black text-slate-300 uppercase italic">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEditClick(u)}
                                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Edit Permissions"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(u)}
                                                className={`p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all ${u.id === currentUser.id ? 'opacity-20 cursor-not-allowed' : ''}`}
                                                title="Deactivate Account"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Technician Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Provision New Technician"
            >
                <form onSubmit={handleAddTechnician} className="space-y-6">
                    <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex gap-5 mb-4">
                        <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                            <Wrench size={24} />
                        </div>
                        <div>
                            <p className="font-black text-slate-800 uppercase tracking-widest text-[11px] mb-1">Authorization Layer</p>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                Creating a technician provides elevated access to IT ticketing and maintenance modules.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                <input 
                                    type="text"
                                    required
                                    value={addForm.name}
                                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    placeholder="Enter Technician Name"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                <input 
                                    type="email"
                                    required
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                    placeholder="tech@unisync.edu"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Access Password</label>
                            <div className="relative">
                                <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                <input 
                                    type="password"
                                    required
                                    value={addForm.password}
                                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                    placeholder="Minimum 6 characters"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Technical Specialization</label>
                            <div className="relative">
                                <Wrench className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                <select
                                    required
                                    value={addForm.specialization}
                                    onChange={(e) => setAddForm({ ...addForm, specialization: e.target.value })}
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                                >
                                    <option value="">Select Domain...</option>
                                    {categories.map(cat => (cat !== 'OTHER' && (
                                        <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                                    )))}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Check size={18} /> Create Technician
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Permissions Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Modify Access Permissions"
            >
                <form onSubmit={handleUpdateUser} className="space-y-8">
                    <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <img 
                            src={editingUser?.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(editingUser?.name)}&background=random`} 
                            className="w-16 h-16 rounded-2xl shadow-md border-2 border-white" 
                            alt=""
                        />
                        <div>
                            <p className="text-lg font-black text-slate-800 tracking-tight">{editingUser?.name}</p>
                            <p className="text-sm font-medium text-slate-500">{editingUser?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Access Role</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['USER', 'TECHNICIAN', 'ADMIN'].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setEditForm({ ...editForm, role: r })}
                                        className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex flex-col items-center gap-3 ${
                                            editForm.role === r 
                                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100' 
                                                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl ${editForm.role === r ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {r === 'ADMIN' ? <Shield size={16} /> : r === 'TECHNICIAN' ? <Wrench size={16} /> : <User size={16} />}
                                        </div>
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {editForm.role === 'TECHNICIAN' && (
                            <div className="animate-in slide-in-from-top-4 duration-300">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Technical Specialization</label>
                                <div className="relative">
                                    <select
                                        value={editForm.specialization}
                                        onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 transition-all outline-none appearance-none"
                                        required={editForm.role === 'TECHNICIAN'}
                                    >
                                        <option value="">Select Specialization...</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        )}
                        
                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                            <AlertCircle className="text-amber-500 shrink-0" size={20} />
                            <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                <span className="font-black uppercase tracking-wider block mb-1">Security Warning</span>
                                Changing administrative roles impacts system-wide access immediately. 
                                Ensure secondary verification of identity before promoting standard users to Root Admin status.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Check size={18} /> Update Profile
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagement;
