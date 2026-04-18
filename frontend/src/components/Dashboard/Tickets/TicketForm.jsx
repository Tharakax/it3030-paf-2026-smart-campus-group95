import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    Image as ImageIcon, 
    X, 
    Send, 
    AlertCircle, 
    Info, 
    Phone, 
    Mail,
    Loader2 
} from 'lucide-react';
import SearchableDropdown from '../../Common/SearchableDropdown';
import api from '../../../api/axiosConfig';
import MediaUpload from '../../../utils/supabaseClient';

const TicketForm = ({ onSubmit, onClose, submitting }) => {
    const [formData, setFormData] = useState({
        department: '',
        resourceType: '',
        resourceId: '',
        resourceName: '',
        category: '',
        description: '',
        priority: 'MEDIUM',
        contactDetails: ''
    });

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);

    // Data from backend
    const [departments, setDepartments] = useState([]);
    const [resourceTypes, setResourceTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [loadingResources, setLoadingResources] = useState(false);

    // Backend enum values
    const departmentEnums = [
        'FACULTY_OF_COMPUTING',
        'FACULTY_OF_ENGINEERING',
        'FACULTY_OF_BUSINESS',
        'FACULTY_OF_HUMANITIES',
        'FACULTY_OF_SCIENCE',
        'COMMON_AREA'
    ];

    const resourceTypeEnums = [
        'LECTURE_HALL',
        'LAB',
        'MEETING_ROOM',
        'AUDITORIUM',
        'STUDY_ROOM',
        'GROUND',
        'EQUIPMENT'
    ];

    // Display-friendly labels
    const formatEnumLabel = (value) => {
        return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    // Reverse: display label → enum value
    const toEnumValue = (label, enumList) => {
        return enumList.find(e => formatEnumLabel(e) === label) || label;
    };

    // Categories mapping: display label → backend enum
    const categoryMap = {
        'Electrical & Lighting': 'ELECTRICAL',
        'IT & Network Support': 'IT_NETWORK',
        'Projector & AV Equipment': 'PROJECTOR_AV',
        'Furniture & Fixtures': 'FURNITURE',
        'Plumbing & Water': 'PLUMBING',
        'AC & Ventilation': 'AC_VENTILATION',
        'Cleaning & Janitorial': 'CLEANING',
        'Safety & Security': 'SAFETY_SECURITY',
        'Lab Equipment': 'LAB_EQUIPMENT',
        'Other': 'OTHER'
    };

    const categories = Object.keys(categoryMap);

    const priorities = [
        { id: 'LOW', label: 'Low', color: 'bg-sky-50 text-sky-600 border-sky-100' },
        { id: 'MEDIUM', label: 'Medium', color: 'bg-amber-50 text-amber-600 border-amber-100' },
        { id: 'HIGH', label: 'High', color: 'bg-red-50 text-red-600 border-red-100' }
    ];

    // Initialize department display labels
    useEffect(() => {
        setDepartments(departmentEnums.map(formatEnumLabel));
    }, []);

    // When department changes → fetch available resource types for that department
    useEffect(() => {
        if (!formData.department) {
            setResourceTypes([]);
            return;
        }

        const deptEnum = toEnumValue(formData.department, departmentEnums);

        // Fetch resources for this department to discover which types exist
        const fetchResourceTypes = async () => {
            try {
                const res = await api.get('/resources', {
                    params: { department: deptEnum }
                });
                // Extract unique resource types from the returned resources
                const types = [...new Set(res.data.map(r => r.type))];
                setResourceTypes(types.map(formatEnumLabel));
            } catch (err) {
                console.error('Failed to fetch resource types:', err);
                // Fallback: show all resource types
                setResourceTypes(resourceTypeEnums.map(formatEnumLabel));
            }
        };

        fetchResourceTypes();
    }, [formData.department]);

    // When department + resourceType change → fetch matching resources
    useEffect(() => {
        if (!formData.department || !formData.resourceType) {
            setResources([]);
            return;
        }

        const deptEnum = toEnumValue(formData.department, departmentEnums);
        const typeEnum = toEnumValue(formData.resourceType, resourceTypeEnums);

        const fetchResources = async () => {
            setLoadingResources(true);
            try {
                const res = await api.get('/resources', {
                    params: {
                        department: deptEnum,
                        type: typeEnum
                    }
                });
                setResources(res.data);
            } catch (err) {
                console.error('Failed to fetch resources:', err);
                setResources([]);
            } finally {
                setLoadingResources(false);
            }
        };

        fetchResources();
    }, [formData.department, formData.resourceType]);

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
        if (!formData.resourceId) newErrors.resource = 'Resource is required';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error('Please fix the errors in the form.');
            return;
        }

        // Upload images to Supabase Storage
        let uploadedUrls = [];
        if (images.length > 0) {
            setUploading(true);
            try {
                const uploadPromises = images.map(file => MediaUpload(file));
                uploadedUrls = await Promise.all(uploadPromises);
            } catch (err) {
                console.error('Image upload failed:', err);
                toast.error('Failed to upload images. Please try again.');
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        const ticketData = {
            resourceId: formData.resourceId,
            category: categoryMap[formData.category],
            description: formData.description,
            priority: formData.priority,
            contactDetails: formData.contactDetails,
            imageUrls: uploadedUrls
        };
        onSubmit(ticketData);
    };

    // Build resource dropdown options: "Resource Name (Resource Code)"
    const resourceOptions = resources.map(r => `${r.name} (${r.resourceCode})`);

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
                        setFormData({ ...formData, department: val, resourceType: '', resourceId: '', resourceName: '' });
                        setErrors({ ...errors, department: null });
                    }}
                    error={errors.department}
                />
                <SearchableDropdown 
                    label="Resource Type"
                    options={formData.department ? resourceTypes : []}
                    placeholder={formData.department ? "Select Resource Type" : "Waiting for Department..."}
                    value={formData.resourceType}
                    onSelect={(val) => {
                        setFormData({ ...formData, resourceType: val, resourceId: '', resourceName: '' });
                        setErrors({ ...errors, resourceType: null });
                    }}
                    error={errors.resourceType}
                    disabled={!formData.department}
                />
            </div>

            {/* Resource (Filtered by Department + Type) */}
            <div className="relative">
                <SearchableDropdown 
                    label="Resource"
                    options={resourceOptions}
                    placeholder={
                        !formData.department 
                            ? "Waiting for Department..." 
                            : !formData.resourceType 
                                ? "Waiting for Resource Type..." 
                                : loadingResources 
                                    ? "Loading available resources..." 
                                    : "Select Resource"
                    }
                    value={formData.resourceName}
                    onSelect={(val) => {
                        // Find the resource object from the display string
                        const selectedResource = resources.find(r => `${r.name} (${r.resourceCode})` === val);
                        if (selectedResource) {
                            setFormData({ 
                                ...formData, 
                                resourceId: selectedResource.id, 
                                resourceName: val 
                            });
                        }
                        setErrors({ ...errors, resource: null });
                    }}
                    error={errors.resource}
                    disabled={!formData.resourceType}
                />
                {loadingResources && (
                    <div className="absolute right-4 top-9">
                        <Loader2 size={16} className="animate-spin text-blue-500" />
                    </div>
                )}
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
                    disabled={submitting}
                    className="flex-1 py-4 px-6 rounded-3xl bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-[2] py-4 px-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold flex items-center justify-center shadow-xl shadow-blue-200 transition-all active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <><Loader2 size={18} className="mr-2 animate-spin" /> Uploading images...</>
                    ) : submitting ? (
                        <><Loader2 size={18} className="mr-2 animate-spin" /> Submitting...</>
                    ) : (
                        <><Send size={18} className="mr-2" /> Submit Request</>
                    )}
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
