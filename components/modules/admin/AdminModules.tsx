import React, { useState, useEffect } from 'react';
import {
    Layers, Plus, Trash2, Package, Search,
    BarChart3, TrendingUp, Users2, CreditCard, FileText,
    ArrowUpRight, AlertCircle, CheckCircle2, Megaphone, Edit, ChevronLeft
} from 'lucide-react';
import { managementService } from '../../../services/management';

export const InventoryManager = ({ darkMode }: { darkMode?: boolean }) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [newItem, setNewItem] = useState({
        name: '', category: 'Lab', quantity: 0,
        unit: 'pcs', lowStockThreshold: 10, status: 'Available'
    });

    useEffect(() => { loadInventory(); }, []);

    const loadInventory = async () => {
        setLoading(true);
        const data = await managementService.getInventory();
        setItems(data);
        setLoading(false);
    };

    const handleSaveItem = async () => {
        if (!newItem.name || newItem.quantity < 0) return alert("Invalid Name or Quantity");
        setLoading(true);

        if (isEditing && editId) {
            await managementService.updateInventoryItem(editId, newItem);
            alert("Item Updated");
        } else {
            await managementService.addInventoryItem(newItem);
            alert("Item Added");
        }

        resetForm();
        loadInventory();
        setLoading(false);
    };

    const handleEdit = (item: any) => {
        setNewItem({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit || 'pcs',
            lowStockThreshold: item.lowStockThreshold || 5,
            status: 'Available'
        });
        setEditId(item.id);
        setIsEditing(true);
        setShowAdd(true);
    };

    const resetForm = () => {
        setNewItem({ name: '', category: 'Lab', quantity: 0, unit: 'pcs', lowStockThreshold: 10, status: 'Available' });
        setShowAdd(false);
        setIsEditing(false);
        setEditId(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this item?")) {
            await managementService.deleteInventoryItem(id);
            loadInventory();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Inter']">
            <header className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Package className="text-indigo-600" /> Inventory
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Manage school assets and equipment</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowAdd(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200"
                >
                    <Plus size={18} /> New Item
                </button>
            </header>

            {showAdd && (
                <div className="bg-indigo-50 dark:bg-slate-900 p-6 rounded-3xl border border-indigo-100 dark:border-slate-800 animate-in zoom-in duration-300">
                    <h4 className="font-black text-slate-900 dark:text-white mb-4 uppercase text-sm">{isEditing ? 'Edit Item' : 'Add New Item'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Item Name</label>
                            <input
                                placeholder="e.g. Physics Lab Coat"
                                className="w-full p-3 rounded-xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-sm outline-none focus:border-indigo-500"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Category</label>
                            <select
                                className="w-full p-3 rounded-xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-sm"
                                value={newItem.category}
                                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                            >
                                <option>Lab</option>
                                <option>Library</option>
                                <option>IT Assets</option>
                                <option>Sports</option>
                                <option>Furniture</option>
                                <option>Stationery</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Qty</label>
                            <input
                                type="number"
                                className="w-full p-3 rounded-xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-sm outline-none"
                                value={newItem.quantity}
                                onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Unit</label>
                            <select
                                className="w-full p-3 rounded-xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-sm"
                                value={newItem.unit}
                                onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                            >
                                <option>pcs</option>
                                <option>kg</option>
                                <option>liters</option>
                                <option>boxes</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Low Limit</label>
                            <input
                                type="number"
                                className="w-full p-3 rounded-xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-sm outline-none"
                                value={newItem.lowStockThreshold}
                                onChange={e => setNewItem({ ...newItem, lowStockThreshold: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="md:col-span-6 flex gap-2 justify-end mt-2">
                            <button onClick={resetForm} className="px-6 py-3 font-bold text-slate-500 text-xs uppercase hover:bg-slate-200 rounded-xl">Cancel</button>
                            <button
                                onClick={handleSaveItem}
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase hover:opacity-80 transition-opacity"
                            >
                                {loading ? 'Saving...' : isEditing ? 'Update Stock' : 'Add to Inventory'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.length === 0 && !loading && (
                    <div className="col-span-3 py-20 text-center text-slate-400 font-bold bg-slate-50 rounded-[2rem] border-dashed border-2">No inventory items found. Add your first item above.</div>
                )}
                {items.map(item => {
                    const isLowStock = item.quantity <= (item.lowStockThreshold || 5);
                    return (
                        <div key={item.id} className={`group bg-white dark:bg-slate-900 p-6 rounded-3xl border transition-all relative hover:shadow-xl ${isLowStock ? 'border-red-200 shadow-sm' : 'border-slate-100 shadow-sm'}`}>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-indigo-500 bg-white shadow-sm rounded-lg border">
                                    <Edit size={14} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 bg-white shadow-sm rounded-lg border">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.category === 'Lab' ? 'bg-purple-50 text-purple-600' :
                                    item.category === 'IT Assets' ? 'bg-blue-50 text-blue-600' :
                                        'bg-orange-50 text-orange-600'
                                    }`}>
                                    <Layers size={24} />
                                </div>
                                {isLowStock && (
                                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border border-red-100">
                                        <AlertCircle size={12} /> Low Stock
                                    </span>
                                )}
                            </div>

                            <h4 className="font-bold text-lg text-slate-900 dark:text-white capitalize mb-1">{item.name}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{item.category}</p>

                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <span className="text-xs font-bold text-slate-500 uppercase">Available</span>
                                <span className={`text-lg font-black ${isLowStock ? 'text-red-600' : 'text-indigo-600'}`}>
                                    {item.quantity} <span className="text-xs text-slate-400 font-bold">{item.unit || 'pcs'}</span>
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const ReportsAnalytics = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        managementService.getOverviewStats().then(data => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    if (loading || !stats) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse text-2xl uppercase tracking-tighter">Calculating Business Intelligence...</div>;

    const cards = [
        { label: 'Fee Collection', value: `₹${(stats.totalCollected / 1000).toFixed(1)}K`, total: `₹${((stats.totalCollected + stats.pendingFees) / 1000).toFixed(1)}K`, icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Student Growth', value: stats.admissions, trend: '+12%', icon: Users2, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Efficiency', value: '94%', sub: 'Attendance Avg', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <header>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <BarChart3 className="text-indigo-600" /> Executive Summary
                </h3>
                <p className="text-sm font-bold text-slate-500 mt-1">Real-time performance metrics for the academic year</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border shadow-sm flex flex-col items-center text-center">
                        <div className={`w-16 h-16 ${card.bg} ${card.color} rounded-[1.5rem] flex items-center justify-center mb-6`}>
                            <card.icon size={32} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
                        <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{card.value}</h4>
                        {card.total && <p className="text-xs font-bold text-slate-500">of {card.total} Target</p>}
                        {card.trend && <span className="text-emerald-500 text-xs font-black flex items-center gap-1 mt-2">
                            <ArrowUpRight size={14} /> {card.trend}
                        </span>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fee Status */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border shadow-sm">
                    <h4 className="text-lg font-black mb-6 flex items-center gap-2">
                        <AlertCircle className="text-orange-500" /> Revenue Distribution
                    </h4>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-black uppercase mb-2">
                                <span>Collected Fees</span>
                                <span>{Math.round((stats.totalCollected / (stats.totalCollected + stats.pendingFees)) * 100)}%</span>
                            </div>
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${(stats.totalCollected / (stats.totalCollected + stats.pendingFees)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-black uppercase mb-2">
                                <span>Pending Outstanding</span>
                                <span>{Math.round((stats.pendingFees / (stats.totalCollected + stats.pendingFees)) * 100)}%</span>
                            </div>
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-orange-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${(stats.pendingFees / (stats.totalCollected + stats.pendingFees)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-200">
                            {stats.totalStaff}
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white">Active Staff</h4>
                            <p className="text-sm font-bold text-slate-500">Teachers & Administrators</p>
                            <div className="flex gap-2 mt-3">
                                <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase text-slate-500">
                                    {stats.totalClasses} Classes
                                </div>
                                <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase text-slate-500">
                                    {stats.totalBuses} Transport
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const EventCalendar = ({ darkMode }: { darkMode?: boolean }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', type: 'Activity', description: '' });

    useEffect(() => { loadEvents(); }, []);

    const loadEvents = async () => {
        const data = await managementService.getCalendarEvents();
        setEvents(data);
    };

    const handleDateClick = (day: number) => {
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        setSelectedDate(dateStr);
        setShowModal(true);
    };

    const handleAddEvent = async () => {
        if (!newEvent.title || !selectedDate) return;
        await managementService.addCalendarEvent({
            ...newEvent,
            start: selectedDate,
            createdAt: new Date().toISOString()
        } as any);
        setShowModal(false);
        setNewEvent({ title: '', type: 'Activity', description: '' });
        loadEvents();
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Delete event?')) {
            await managementService.deleteCalendarEvent(id);
            loadEvents();
        }
    }

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="space-y-6 font-['Inter'] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" /> School Calendar
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Manage Holidays & Events</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full"><ChevronLeft /></button>
                    <h4 className="text-xl font-black min-w-[150px] text-center text-slate-900 dark:text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full"><ChevronLeft className="rotate-180" /></button>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border shadow-sm">
                <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-xs font-black uppercase text-slate-400 tracking-wider">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                        const dayEvents = events.filter(e => e.start === dateStr);
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;

                        return (
                            <div
                                key={day}
                                onClick={() => handleDateClick(day)}
                                className={`min-h-[100px] p-3 rounded-2xl border transition-all cursor-pointer hover:border-indigo-500 relative group
                                    ${isToday ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}
                                `}
                            >
                                <span className={`text-sm font-black ${isToday ? 'text-indigo-600' : 'text-slate-500'}`}>{day}</span>
                                <div className="mt-2 space-y-1">
                                    {dayEvents.map(ev => (
                                        <div key={ev.id} className={`text-[10px] font-bold px-2 py-1 rounded truncate flex justify-between items-center group/event
                                            ${ev.type === 'Holiday' ? 'bg-pink-100 text-pink-600' :
                                                ev.type === 'Exam' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-emerald-100 text-emerald-600'}`}>
                                            <span>{ev.title}</span>
                                            <button onClick={(e) => handleDelete(e, ev.id)} className="hidden group-hover/event:block text-slate-500 hover:text-red-500"><Trash2 size={10} /></button>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute inset-0 bg-transparent" /> {/* Click overlay */}
                            </div>
                        );
                    })}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl animate-in zoom-in">
                        <h3 className="text-lg font-black mb-1">Add Event</h3>
                        <p className="text-xs font-bold text-slate-500 mb-4 uppercase">For {selectedDate}</p>

                        <div className="space-y-3">
                            <input
                                className="w-full p-3 rounded-xl border-2 font-bold text-sm outline-none focus:border-indigo-500"
                                placeholder="Event Title (e.g. Sports Day)"
                                value={newEvent.title}
                                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                            <select
                                className="w-full p-3 rounded-xl border-2 font-bold text-sm outline-none"
                                value={newEvent.type}
                                onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                            >
                                <option>Activity</option>
                                <option>Holiday</option>
                                <option>Exam</option>
                                <option>Meeting</option>
                            </select>
                            <input
                                className="w-full p-3 rounded-xl border-2 font-bold text-sm outline-none focus:border-indigo-500"
                                placeholder="Description (Optional)"
                                value={newEvent.description}
                                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                            />
                            <button onClick={handleAddEvent} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs hover:opacity-80">
                                Save Event
                            </button>
                            <button onClick={() => setShowModal(false)} className="w-full py-3 text-slate-400 font-bold uppercase text-xs hover:text-slate-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CircularsManager = ({ darkMode, role }: { darkMode?: boolean, role?: string }) => {
    const [circulars, setCirculars] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', content: '', audience: 'All', author: 'Admin' });

    useEffect(() => { loadCirculars(); }, []);

    const loadCirculars = async () => {
        const data = await managementService.getNotices('Admin'); // Get all notices
        if (role === 'teacher') {
            // Teachers see 'All' and 'Teachers' notices (loose filter)
            setCirculars(data.filter((n: any) => {
                const aud = (n.audience || 'All').toString().toLowerCase();
                return ['all', 'teachers', 'teacher'].includes(aud);
            }));
        } else {
            setCirculars(data);
        }
    };

    const handleCreate = async () => {
        if (!newItem.title || !newItem.content) return alert("Fill all fields");
        await managementService.createNotice(newItem);
        setShowForm(false);
        setNewItem({ title: '', content: '', audience: 'All', author: 'Admin' });
        loadCirculars();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete notice?")) {
            await managementService.deleteNotice(id);
            loadCirculars();
        }
    };

    const isAdmin = role === 'admin' || role === 'school_admin' || !role;

    return (
        <div className="space-y-6 animate-fade-in font-['Inter']">
            <header className={`flex justify-between items-center p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div>
                    <h3 className={`text-2xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Megaphone className="text-indigo-600" /> Circulars & Notices
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Broadcast announcements to school</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowForm(true)} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">New Notice</button>
                )}
            </header>

            {showForm && isAdmin && (
                <div className={`p-6 rounded-3xl border animate-zoom-in ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                className={`p-3 rounded-xl border font-bold ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                placeholder="Notice Title"
                                value={newItem.title}
                                onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                            />
                            <select
                                className={`p-3 rounded-xl border font-bold ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                value={newItem.audience}
                                onChange={e => setNewItem({ ...newItem, audience: e.target.value })}
                            >
                                <option>All</option>
                                <option>Students</option>
                                <option>Teachers</option>
                                <option>Parents</option>
                                <option>Drivers</option>
                            </select>
                        </div>
                        <textarea
                            className={`w-full p-3 rounded-xl border font-medium ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                            rows={3}
                            placeholder="Announcement Content..."
                            value={newItem.content}
                            onChange={e => setNewItem({ ...newItem, content: e.target.value })}
                        />
                        <button onClick={handleCreate} className={`w-full py-3 text-white font-bold rounded-xl lg:w-auto px-8 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-900 hover:bg-slate-800'}`}>Publish Notice</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {circulars.map(c => (
                    <div key={c.id} className={`p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all group relative ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                        {isAdmin && <button onClick={() => handleDelete(c.id)} className={`absolute top-4 right-4 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-slate-600' : 'text-slate-300'}`}><Trash2 size={18} /></button>}
                        <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-amber-900/30 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                                <Megaphone size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{c.title}</h4>
                                <p className={`text-sm mt-1 mb-2 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{c.content || c.message}</p>
                                <div className="flex gap-2">
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500'}`}>{new Date(c.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</span>
                                    <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded">To: {c.audience}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TimetableBuilder = ({ darkMode }: { darkMode?: boolean }) => {
    const [classId, setClassId] = useState('10');
    const [schedule, setSchedule] = useState<any>({
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: []
    });
    const [loading, setLoading] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{ day: string, periodIndex: number } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ subject: '', teacher: '', startTime: '', endTime: '' });

    const periods = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '12:00', end: '01:00' },
        { start: '02:00', end: '03:00' },
        { start: '03:00', end: '04:00' }
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => { loadTimetable(); }, [classId]);

    const loadTimetable = async () => {
        setLoading(true);
        const data = await managementService.getTimetable(classId);
        if (data) setSchedule(data);
        else setSchedule({ Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] });
        setLoading(false);
    };

    const handleCellClick = (day: string, periodIndex: number) => {
        const existing = schedule[day]?.find((p: any) => p.startTime === periods[periodIndex].start);
        setModalData(existing || { subject: '', teacher: '', startTime: periods[periodIndex].start, endTime: periods[periodIndex].end });
        setSelectedCell({ day, periodIndex });
        setShowModal(true);
    };

    const handleSavePeriod = () => {
        if (!selectedCell) return;
        const { day, periodIndex } = selectedCell;
        let daySchedule = [...(schedule[day] || [])];

        // Remove existing for this slot if any
        daySchedule = daySchedule.filter((p: any) => p.startTime !== periods[periodIndex].start);

        if (modalData.subject) {
            daySchedule.push(modalData);
        }

        setSchedule({ ...schedule, [day]: daySchedule });
        setShowModal(false);
    };

    const saveFullTimetable = async () => {
        setLoading(true);
        await managementService.saveTimetable(classId, schedule);
        alert('Timetable Saved Successfully!');
        setLoading(false);
    };

    return (
        <div className="space-y-6 font-['Inter'] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="text-pink-600" /> Timetable Builder
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Weekly Grid View</p>
                </div>
                <div className="flex gap-4">
                    <select className="p-3 bg-slate-50 border rounded-xl font-bold" value={classId} onChange={e => setClassId(e.target.value)}>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                    </select>
                    <button onClick={saveFullTimetable} disabled={loading} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 flex items-center gap-2">
                        {loading ? 'Saving...' : <><CheckCircle2 size={18} /> Save Changes</>}
                    </button>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border shadow-sm overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-6 gap-2 mb-4">
                        <div className="text-xs font-black uppercase text-slate-400 p-2">Time / Day</div>
                        {days.map(d => <div key={d} className="text-xs font-black uppercase text-slate-900 dark:text-white text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{d}</div>)}
                    </div>

                    {periods.map((period, pIndex) => (
                        <div key={pIndex} className="grid grid-cols-6 gap-2 mb-2">
                            <div className="text-xs font-bold text-slate-500 p-3 flex flex-col justify-center bg-slate-50 rounded-xl">
                                <span>{period.start}</span>
                                <span className="opacity-50 text-[10px]">to {period.end}</span>
                            </div>
                            {days.map(day => {
                                const subject = schedule[day]?.find((p: any) => p.startTime === period.start);
                                return (
                                    <div
                                        key={`${day}-${pIndex}`}
                                        onClick={() => handleCellClick(day, pIndex)}
                                        className={`p-2 rounded-xl border border-dashed transition-all cursor-pointer hover:border-pink-500 min-h-[80px] flex flex-col justify-center items-center text-center
                                            ${subject ? 'bg-pink-50 border-pink-200' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}
                                        `}
                                    >
                                        {subject ? (
                                            <>
                                                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{subject.subject}</div>
                                                <div className="text-[10px] uppercase font-black text-pink-500 mt-1">{subject.teacher}</div>
                                            </>
                                        ) : (
                                            <Plus className="text-slate-300" size={16} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl animate-in zoom-in">
                        <h3 className="text-lg font-black mb-4">Edit Period</h3>
                        <div className="space-y-3">
                            <input
                                className="w-full p-3 rounded-xl border-2 font-bold text-sm outline-none focus:border-pink-500"
                                placeholder="Subject (e.g. Math, Physics)"
                                value={modalData.subject}
                                onChange={e => setModalData({ ...modalData, subject: e.target.value })}
                            />
                            <input
                                className="w-full p-3 rounded-xl border-2 font-bold text-sm outline-none focus:border-pink-500"
                                placeholder="Teacher Name"
                                value={modalData.teacher}
                                onChange={e => setModalData({ ...modalData, teacher: e.target.value })}
                            />
                            <div className="flex gap-2 text-xs font-bold text-slate-500 bg-slate-100 p-3 rounded-xl">
                                <span>Time: {modalData.startTime} - {modalData.endTime}</span>
                            </div>
                            <button onClick={handleSavePeriod} className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold uppercase text-xs hover:bg-pink-700">
                                Update Schedule
                            </button>
                            <button onClick={() => { setModalData({ ...modalData, subject: '', teacher: '' }); handleSavePeriod(); }} className="w-full py-3 text-red-500 font-bold uppercase text-xs hover:bg-red-50">
                                Clear Period
                            </button>
                            <button onClick={() => setShowModal(false)} className="w-full py-3 text-slate-400 font-bold uppercase text-xs hover:text-slate-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

import { Download } from 'lucide-react';

export const FeeManagementModule = ({ darkMode }: { darkMode?: boolean }) => {
    const [fees, setFees] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [showCollect, setShowCollect] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [paymentData, setPaymentData] = useState({ title: 'Tuition Fee', amount: '', method: 'Cash', semester: 'Annual' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [feeData, studentData] = await Promise.all([
            managementService.getFees(),
            managementService.getStudents()
        ]);
        setFees(feeData);
        setStudents(studentData);
    };

    const handleCollectFee = async () => {
        if (!selectedStudent || !paymentData.amount) return alert("Select student and enter amount");
        setLoading(true);
        try {
            await managementService.collectFee({
                studentId: selectedStudent.id,
                studentName: selectedStudent.name,
                classLevel: selectedStudent.classLevel,
                ...paymentData,
                date: new Date().toISOString()
            });
            setShowCollect(false);
            setPaymentData({ title: 'Tuition Fee', amount: '', method: 'Cash', semester: 'Annual' });
            setSelectedStudent(null);
            loadData();
            alert("Payment Recorded Successfully");
        } catch (e) {
            console.error(e);
            alert("Failed to record payment");
        }
        setLoading(false);
    };

    const generateReceipt = (fee: any) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head><title>Fee Receipt</title></head>
                <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                    <h1>Vidyabodhini School</h1>
                    <h3>Fee Receipt</h3>
                    <hr/>
                    <div style="text-align: left; margin: 20px auto; max-width: 400px; padding: 20px; border: 1px solid #ccc;">
                        <p><strong>Receipt #:</strong> ${fee.id}</p>
                        <p><strong>Student:</strong> ${fee.studentName}</p>
                        <p><strong>Class:</strong> ${fee.classLevel}</p>
                        <p><strong>Type:</strong> ${fee.title}</p>
                        <p><strong>Date:</strong> ${new Date(fee.date).toLocaleDateString()}</p>
                        <h2 style="color: green;">Amount: ₹${parseInt(fee.amount).toLocaleString()}</h2>
                        <p><strong>Mode:</strong> ${fee.method}</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Inter']">
            <header className={`flex justify-between items-center p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div>
                    <h3 className={`text-2xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <CreditCard className="text-emerald-500" /> Fee Management
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track Revenue & Generate Receipts</p>
                </div>
                <button
                    onClick={() => setShowCollect(true)}
                    className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-500 flex items-center gap-2"
                >
                    <Plus size={18} /> Collect Fee
                </button>
            </header>

            {showCollect && (
                <div className={`p-6 rounded-[2rem] border animate-in zoom-in ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50 border-emerald-100'}`}>
                    <h4 className={`text-lg font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Record New Payment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Select Student</label>
                            <select
                                className={`w-full p-3 rounded-xl border font-bold text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                onChange={e => setSelectedStudent(students.find(s => s.id === e.target.value))}
                            >
                                <option value="">-- Choose Student --</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.classLevel})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Fee Type</label>
                            <select
                                className={`w-full p-3 rounded-xl border font-bold text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                value={paymentData.title}
                                onChange={e => setPaymentData({ ...paymentData, title: e.target.value })}
                            >
                                <option>Tuition Fee</option>
                                <option>Transport Fee</option>
                                <option>Exam Fee</option>
                                <option>Lab Fee</option>
                                <option>Library Fine</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Amount (₹)</label>
                            <input
                                type="number"
                                className={`w-full p-3 rounded-xl border font-bold text-sm outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                value={paymentData.amount}
                                onChange={e => setPaymentData({ ...paymentData, amount: e.target.value })}
                                placeholder="5000"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Payment Mode</label>
                            <select
                                className={`w-full p-3 rounded-xl border font-bold text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                                value={paymentData.method}
                                onChange={e => setPaymentData({ ...paymentData, method: e.target.value })}
                            >
                                <option>Cash</option>
                                <option>Bank Transfer</option>
                                <option>UPI</option>
                                <option>Cheque</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowCollect(false)} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-200 uppercase text-xs">Cancel</button>
                        <button onClick={handleCollectFee} disabled={loading} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase text-xs hover:bg-emerald-500 shadow-lg">
                            {loading ? 'Processing...' : 'Confirm Payment'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                        <TrendingUp />
                    </div>
                    <p className="text-xs font-bold uppercase text-slate-500">Total Collected</p>
                    <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        ₹{(fees.reduce((sum, f) => sum + parseInt(f.amount || 0), 0) / 1000).toFixed(1)}k
                    </h3>
                </div>
                <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                        <AlertCircle />
                    </div>
                    <p className="text-xs font-bold uppercase text-slate-500">Pending Dues</p>
                    <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        ₹42.5k
                    </h3>
                    <p className="text-[10px] text-orange-500 font-bold mt-1">Estimated</p>
                </div>
                <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                        <FileText />
                    </div>
                    <p className="text-xs font-bold uppercase text-slate-500">Today's Transactions</p>
                    <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {fees.filter(f => new Date(f.date).toDateString() === new Date().toDateString()).length}
                    </h3>
                </div>
            </div>

            <div className={`rounded-[2.5rem] border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`text-xs uppercase border-b ${darkMode ? 'bg-slate-800/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                <th className="p-6 font-black">Ref ID</th>
                                <th className="p-6 font-black">Student</th>
                                <th className="p-6 font-black">Type</th>
                                <th className="p-6 font-black">Date</th>
                                <th className="p-6 font-black">Amount</th>
                                <th className="p-6 font-black">Status</th>
                                <th className="p-6 font-black text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {fees.map((fee, i) => (
                                <tr key={i} className={`border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <td className="p-6 font-mono text-xs opacity-50">#{fee.id?.slice(0, 8)}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black">
                                                {fee.studentName?.[0]}
                                            </div>
                                            {fee.studentName}
                                        </div>
                                    </td>
                                    <td className="p-6 text-xs uppercase tracking-wide">{fee.title}</td>
                                    <td className="p-6 text-slate-400 text-xs">{new Date(fee.date).toLocaleDateString()}</td>
                                    <td className="p-6 text-emerald-600">₹{parseInt(fee.amount).toLocaleString()}</td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] uppercase font-black">Paid</span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => generateReceipt(fee)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
