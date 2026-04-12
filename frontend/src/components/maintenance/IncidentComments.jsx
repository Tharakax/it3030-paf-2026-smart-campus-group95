import React, { useState, useEffect } from 'react';
import { Send, Trash2, Edit2, MessageSquare, Clock } from 'lucide-react';
import incidentService from '../../api/maintenance/incidentService';

const IncidentComments = ({ ticketId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchComments();
    }, [ticketId]);

    const fetchComments = async () => {
        try {
            const data = await incidentService.getComments(ticketId);
            setComments(data);
        } catch (err) {
            console.error("Failed to fetch comments", err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const added = await incidentService.addComment(ticketId, newComment);
            setComments([...comments, added]);
            setNewComment('');
        } catch (err) {
            console.error("Failed to add comment", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await incidentService.deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleUpdate = async (commentId) => {
        try {
            const updated = await incidentService.updateComment(commentId, editContent);
            setComments(comments.map(c => c.id === commentId ? updated : c));
            setEditingId(null);
        } catch (err) {
            console.error("Failed to update", err);
        }
    };

    return (
        <div className="space-y-6">
            <h4 className="flex items-center text-sm font-bold text-slate-800 uppercase tracking-tight">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                Comments ({comments.length})
            </h4>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="relative">
                <textarea
                    placeholder="Add a comment or update..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pr-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px] resize-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>

            {/* Comment List */}
            <div className="space-y-4">
                {comments.length === 0 && !loading && (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                        <p className="text-slate-400 text-xs italic">No comments yet. Start the conversation!</p>
                    </div>
                )}
                
                {comments.map((comment) => (
                    <div key={comment.id} className="group bg-white border border-slate-100 rounded-xl p-4 transition-all hover:border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${comment.authorName}&size=32&background=eff6ff&color=2563eb`}
                                    alt="Author"
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="text-sm font-bold text-slate-700">{comment.authorName}</span>
                                <span className="text-[10px] text-slate-400 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {currentUser?.id === comment.userId && (
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => startEdit(comment)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(comment.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {editingId === comment.id ? (
                            <div className="space-y-2 mt-2">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                                <div className="flex justify-end space-x-2">
                                    <button onClick={() => setEditingId(null)} className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-md">Cancel</button>
                                    <button onClick={() => handleUpdate(comment.id)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">Update</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncidentComments;
