import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    Image as ImageIcon, 
    X, 
    Send, 
    AlertCircle, 
    Info, 
    Phone, 
    Mail 
} from 'lucide-react';
import SearchableDropdown from '../../Common/SearchableDropdown';

const TicketForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        department: '',
        resourceType: '',
        category: '',
        description: '',
        priority: 'MEDIUM',
        contactDetails: ''
    });

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [errors, setErrors] = useState({});

    // Mock Data
    const departments = ['Computing', 'Engineering', 'Business', 'Humanities', 'Science', 'Architecture'];
    
    const resourceTypesByDept = {
        'Computing': ['LAB', 'MEETING_ROOM', 'STUDY_ROOM'],
        'Engineering': ['LECTURE_HALL', 'LAB', 'EQUIPMENT'],
        'Business': ['AUDITORIUM', 'MEETING_ROOM'],
        'Humanities': ['STUDY_ROOM', 'LECTURE_HALL'],
        'Science': ['LAB', 'GROUND', 'EQUIPMENT'],
        'Architecture': ['STUDY_ROOM', 'LAB']
    };

    const categories = [
        'IT & Network Support',
        'Electrical & Lighting',
        'Plumbing & Water',
        'Audio-Visual (AV) Equipment',
        'Furniture & Fixtures',
        'Safety & Security',
        'Cleaning & Janitorial',
        'Structure & HVAC Maintenance'
    ];

    const priorities = [
        { id: 'LOW', label: 'Low', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
        { id: 'MEDIUM', label: 'Medium', color: 'bg-amber-50 text-amber-600 border-amber-100' },
        { id: 'HIGH', label: 'High', color: 'bg-red-50 text-red-600 border-red-100' }
    ];

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 3) {
            toast.error('You can only upload up to 3 images.');
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.resourceType) newErrors.resourceType = 'Resource Type is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.description || formData.description.length < 10) 
            newErrors.description = 'Description must be at least 10 characters';
        
        // Contact Validation
        const contact = formData.contactDetails.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-]{10,}$/;

        if (!contact) {
            newErrors.contactDetails = 'Preferred contact is required';
        } else if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
            newErrors.contactDetails = 'Enter a valid email or phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const ticketData = {
                ...formData,
                attachments: images,
                date: new Date().toISOString()
            };
            onSubmit(ticketData);
            toast.success('Incident ticket submitted successfully!');
            onClose();
        } else {
            toast.error('Please fix the errors in the form.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department & Resource Type (Filtered) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SearchableDropdown 
                    label="Department"
                    options={departments}
                    placeholder="Select Department"
                    value={formData.department}
                    onSelect={(val) => {
                        setFormData({ ...formData, department: val, resourceType: '' });
                        setErrors({ ...errors, department: null });
                    }}
                    error={errors.department}
                />
                <SearchableDropdown 
                    label="Resource Type"
                    options={formData.department ? resourceTypesByDept[formData.department] : []}
                    placeholder={formData.department ? "Select Resource Type" : "Select Dept First"}
                    value={formData.resourceType}
                    onSelect={(val) => {
                        setFormData({ ...formData, resourceType: val });
                        setErrors({ ...errors, resourceType: null });
                    }}
                    error={errors.resourceType}
                />
            </div>

            {/* Category */}
            <SearchableDropdown 
                label="Incident Category"
                options={categories}
                placeholder="Select Category"
                value={formData.category}
                onSelect={(val) => {
                    setFormData({ ...formData, category: val });
                    setErrors({ ...errors, category: null });
                }}
                error={errors.category}
            />

            {/* Description */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
                <textarea 
                    className={`w-full bg-slate-50 border transition-all rounded-3xl p-5 text-sm min-h-[120px] focus:ring-4 focus:ring-blue-50 outline-none ${
                        errors.description ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:border-blue-300'
                    }`}
                    placeholder="Describe the incident details (location, context, etc.)"
                    value={formData.description}
                    onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value });
                        if (errors.description) setErrors({ ...errors, description: null });
                    }}
                ></textarea>
                {errors.description && <p className="text-[10px] font-bold text-red-500 pl-1">{errors.description}</p>}
            </div>

            {/* Priority Selection */}
            <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Priority Level</label>
                <div className="flex gap-3">
                    {priorities.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority: p.id })}
                            className={`flex-1 py-3 px-4 rounded-2xl border text-sm font-bold transition-all ${
                                formData.priority === p.id 
                                    ? `${p.color} border-current shadow-lg shadow-slate-100 ring-2 ring-current` 
                                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2">
                <div className="flex items-center justify-between pl-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preferred Contact Details</label>
                    <div className="flex space-x-2">
                        <Mail size={12} className="text-slate-300" />
                        <Phone size={12} className="text-slate-300" />
                    </div>
                </div>
                <input 
                    type="text"
                    className={`w-full bg-slate-50 border transition-all rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-blue-50 outline-none ${
                        errors.contactDetails ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200 focus:border-blue-300'
                    }`}
                    placeholder="Enter email or phone number"
                    value={formData.contactDetails}
                    onChange={(e) => {
                        setFormData({ ...formData, contactDetails: e.target.value });
                        if (errors.contactDetails) setErrors({ ...errors, contactDetails: null });
                    }}
                />
                {errors.contactDetails && <p className="text-[10px] font-bold text-red-500 pl-1">{errors.contactDetails}</p>}
                <p className="text-[10px] text-slate-400 pl-1 italic">Used for incident follow-up and status updates.</p>
            </div>

            {/* Evidence Uploader */}
            <div className="space-y-3">
                <div className="flex items-center justify-between pl-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Evidence Attachments</label>
                    <span className="text-[10px] font-bold text-slate-400">{images.length}/3 images</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                    {previews.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group animate-in zoom-in fade-in transition-all">
                            <img src={src} alt="Evidence" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    type="button" 
                                    onClick={() => removeImage(index)}
                                    className="bg-red-500 text-white p-1.5 rounded-lg shadow-lg hover:scale-110 transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {images.length < 3 && (
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 text-slate-400 hover:text-blue-500 group">
                            <ImageIcon size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-tight">Add Proof</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                        </label>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex gap-3">
                <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 px-6 rounded-3xl bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-all active:scale-95"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="flex-[2] py-4 px-6 rounded-3xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                    <Send size={18} className="mr-2" />
                    Submit Request
                </button>
            </div>
            
            <div className="flex items-start space-x-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <Info size={16} className="text-blue-500 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                    By submitting this ticket, you agree to provide accurate information regarding the incident. 
                    Security and IT teams will be notified immediately of high-priority requests.
                </p>
            </div>
        </form>
    );
};

export default TicketForm;
