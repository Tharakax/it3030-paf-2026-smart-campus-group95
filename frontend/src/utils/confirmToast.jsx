import React from 'react';
import toast from 'react-hot-toast';
import { Trash2, AlertTriangle, Info } from 'lucide-react';

/**
 * showConfirmToast - Triggers a high-end, custom confirmation toast.
 * 
 * Params:
 *  - title: Bold heading text
 *  - message: Descriptive secondary text
 *  - onConfirm: Async callback function executed on confirmation
 *  - confirmText: Primary action button label
 *  - cancelText: Secondary action button label
 *  - icon: Lucide icon component (default: Trash2)
 *  - variant: 'danger', 'warning', 'info' (default: 'danger')
 */
export const showConfirmToast = ({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed? This cannot be undone.',
    onConfirm,
    confirmText = 'Proceed',
    cancelText = 'Cancel',
    icon: Icon = Trash2,
    variant = 'danger'
}) => {
    const variantStyles = {
        danger: {
            bg: 'bg-rose-50',
            border: 'border-rose-100',
            icon: 'text-rose-500',
            btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200',
            ring: 'focus:ring-rose-500/20'
        },
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            icon: 'text-amber-500',
            btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
            ring: 'focus:ring-amber-500/20'
        },
        info: {
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            icon: 'text-indigo-500',
            btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
            ring: 'focus:ring-indigo-500/20'
        }
    };

    const style = variantStyles[variant] || variantStyles.danger;

    toast.custom((t) => (
        <div className={`${t.visible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-top-2'} max-w-md w-full bg-white shadow-2xl rounded-[2.5rem] pointer-events-auto flex flex-col p-8 transition-all duration-300`}>
            <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 pt-1">
                    <div className={`p-4 ${style.bg} rounded-2xl border ${style.border}`}>
                        <Icon className={`w-6 h-6 ${style.icon}`} />
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none mb-1">{title}</p>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed opacity-70 italic lowercase first-letter:uppercase">
                        {message}
                    </p>
                </div>
            </div>
            <div className="mt-8 flex items-center justify-end space-x-4">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {cancelText}
                </button>
                <button
                    onClick={async () => {
                        toast.dismiss(t.id);
                        if (onConfirm) await onConfirm();
                    }}
                    className={`px-8 py-3 ${style.btn} text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95`}
                >
                    {confirmText}
                </button>
            </div>
        </div>
    ), { duration: 6000, position: 'top-center' });
};
