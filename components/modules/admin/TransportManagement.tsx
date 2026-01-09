import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Users, Fuel, Plus, Search, Trash2, Edit2, X, Check, Save } from 'lucide-react';
import { managementService, Bus as BusType, Route as RouteType, Driver as DriverType } from '../../../services/management';

export const TransportManagement = ({ darkMode }: { darkMode?: boolean }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'buses' | 'routes' | 'drivers'>('overview');
    const [loading, setLoading] = useState(false);

    // Data States
    const [buses, setBuses] = useState<any[]>([]);
    const [routes, setRoutes] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]); // Need to fetch drivers

    // Modal States
    const [showBusModal, setShowBusModal] = useState(false);
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    // Form States
    const [busForm, setBusForm] = useState({ number: '', capacity: 40, model: '', status: 'Active' });
    const [routeForm, setRouteForm] = useState({ name: '', start: '', end: '', stops: '', fees: 0 });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [busesData, routesData, driversData] = await Promise.all([
                managementService.getBuses(),
                managementService.getRoutes(),
                managementService.getDrivers()
            ]);
            setBuses(busesData);
            setRoutes(routesData);
            setDrivers(driversData);
        } catch (error) {
            console.error("Failed to load transport data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBus = async () => {
        try {
            if (editingItem) {
                await managementService.updateBus(editingItem.id, busForm);
            } else {
                await managementService.addBus(busForm);
            }
            setShowBusModal(false);
            setEditingItem(null);
            setBusForm({ number: '', capacity: 40, model: '', status: 'Active' });
            loadData();
        } catch (error) {
            console.error("Failed to save bus", error);
        }
    };

    const handleDeleteBus = async (id: string) => {
        if (!confirm('Delete this bus?')) return;
        try {
            await managementService.deleteBus(id);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveRoute = async () => {
        try {
            const routeData = {
                ...routeForm,
                stops: typeof routeForm.stops === 'string' ? routeForm.stops.split(',').map(s => s.trim()) : routeForm.stops
            };

            if (editingItem) {
                await managementService.updateRoute(editingItem.id, routeData);
            } else {
                await managementService.addRoute(routeData as any);
            }
            setShowRouteModal(false);
            setEditingItem(null);
            setRouteForm({ name: '', start: '', end: '', stops: '', fees: 0 });
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteRoute = async (id: string) => {
        if (!confirm('Delete this route?')) return;
        try {
            await managementService.deleteRoute(id);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Inter']`}>
            {/* Header */}
            <header className={`flex flex-col md:flex-row justify-between items-center p-6 rounded-[2rem] border shadow-sm gap-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div>
                    <h3 className={`text-2xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Bus className="text-yellow-500" /> Transport
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Fleet & Route Management</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                    {['overview', 'buses', 'routes', 'drivers'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab
                                    ? (darkMode ? 'bg-slate-700 text-white shadow-lg' : 'bg-white text-indigo-600 shadow-md')
                                    : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-indigo-600')
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95">
                    <div className={`p-6 rounded-[2rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-yellow-50 text-yellow-500"><Bus className="w-6 h-6" /></div>
                        </div>
                        <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{buses.length}</h3>
                        <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Buses</p>
                    </div>
                    <div className={`p-6 rounded-[2rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-500"><MapPin className="w-6 h-6" /></div>
                        </div>
                        <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{routes.length}</h3>
                        <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Active Routes</p>
                    </div>
                    <div className={`p-6 rounded-[2rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-500"><Users className="w-6 h-6" /></div>
                        </div>
                        <h3 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{drivers.length}</h3>
                        <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Drivers</p>
                    </div>
                </div>
            )}

            {/* Buses Tab */}
            {activeTab === 'buses' && (
                <div className={`p-6 rounded-[2.5rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} animate-in fade-in`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Fleet Directory</h2>
                        <button onClick={() => { setEditingItem(null); setBusForm({ number: '', capacity: 40, model: '', status: 'Active' }); setShowBusModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors">
                            <Plus size={16} /> Add Bus
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`text-[10px] uppercase font-black tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <tr>
                                    <th className="px-4 py-3">Bus Number</th>
                                    <th className="px-4 py-3">Model</th>
                                    <th className="px-4 py-3">Capacity</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {buses.map(bus => (
                                    <tr key={bus.id} className={`border-b last:border-0 ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                                        <td className="px-4 py-3">{bus.number}</td>
                                        <td className="px-4 py-3">{bus.model || 'N/A'}</td>
                                        <td className="px-4 py-3">{bus.capacity} Seats</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-black ${bus.status === 'Active' ? 'bg-emerald-100/10 text-emerald-500' : 'bg-red-100/10 text-red-500'}`}>
                                                {bus.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            <button onClick={() => { setEditingItem(bus); setBusForm(bus); setShowBusModal(true); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-500"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDeleteBus(bus.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Routes Tab */}
            {activeTab === 'routes' && (
                <div className={`p-6 rounded-[2.5rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} animate-in fade-in`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Route Planner</h2>
                        <button onClick={() => { setEditingItem(null); setRouteForm({ name: '', start: '', end: '', stops: '', fees: 0 }); setShowRouteModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors">
                            <Plus size={16} /> Add Route
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {routes.map(route => (
                            <div key={route.id} className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} group hover:border-indigo-500 transition-all`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><MapPin size={18} /></div>
                                        <div>
                                            <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{route.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{route.start} ➝ {route.end}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingItem(route); setRouteForm({ ...route, stops: route.stops?.join(', ') || '' }); setShowRouteModal(true); }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDeleteRoute(route.id)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {route.stops?.map((stop: string, i: number) => (
                                            <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border text-slate-500'}`}>{stop}</span>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold pt-2 border-t dark:border-slate-800">
                                        <span className={darkMode ? 'text-slate-500' : 'text-slate-400'}>Fee: ₹{route.fees}/mo</span>
                                        <span className="text-emerald-500">Active</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Drivers Tab */}
            {activeTab === 'drivers' && (
                <div className={`p-6 rounded-[2.5rem] border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} animate-in fade-in`}>
                    <h2 className={`text-lg font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Driver Roster</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`text-[10px] uppercase font-black tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <tr>
                                    <th className="px-4 py-3">Driver Name</th>
                                    <th className="px-4 py-3">License</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {drivers.map(driver => (
                                    <tr key={driver.id} className={`border-b last:border-0 ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-black">{driver.name?.charAt(0)}</div>
                                            {driver.name}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs opacity-70">{driver.license || 'N/A'}</td>
                                        <td className="px-4 py-3">{driver.phone}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-black ${driver.status === 'Active' ? 'bg-emerald-100/10 text-emerald-500' : 'bg-orange-100/10 text-orange-500'}`}>
                                                {driver.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bus Modal */}
            {showBusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md p-6 rounded-[2rem] shadow-2xl ${darkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black">{editingItem ? 'Edit Bus' : 'Add New Bus'}</h3>
                            <button onClick={() => setShowBusModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Bus Number</label>
                                <input type="text" value={busForm.number} onChange={e => setBusForm({ ...busForm, number: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-indigo-500' : 'border-slate-200 focus:border-indigo-500'} outline-none`} placeholder="KA-01-AB-1234" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Capacity</label>
                                    <input type="number" value={busForm.capacity} onChange={e => setBusForm({ ...busForm, capacity: parseInt(e.target.value) })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-indigo-500' : 'border-slate-200 focus:border-indigo-500'} outline-none`} />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Model</label>
                                    <input type="text" value={busForm.model} onChange={e => setBusForm({ ...busForm, model: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-indigo-500' : 'border-slate-200 focus:border-indigo-500'} outline-none`} />
                                </div>
                            </div>
                            <button onClick={handleSaveBus} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                                {editingItem ? 'Update Bus' : 'Add Bus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Route Modal */}
            {showRouteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md p-6 rounded-[2rem] shadow-2xl ${darkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black">{editingItem ? 'Edit Route' : 'Create Route'}</h3>
                            <button onClick={() => setShowRouteModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Route Name</label>
                                <input type="text" value={routeForm.name} onChange={e => setRouteForm({ ...routeForm, name: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-indigo-500' : 'border-slate-200 focus:border-indigo-500'} outline-none`} placeholder="Route 1A" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Start Point</label>
                                    <input type="text" value={routeForm.start} onChange={e => setRouteForm({ ...routeForm, start: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-indigo-500' : 'border-slate-200 focus:border-indigo-500'} outline-none`} />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">End Point</label>
                                    <input type="text" value={routeForm.end} onChange={e => setRouteForm({ ...routeForm, end: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-indigo-500' : 'border-slate-200 focus:border-indigo-500'} outline-none`} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Stops (comma separated)</label>
                                <input type="text" value={routeForm.stops} onChange={e => setRouteForm({ ...routeForm, stops: e.target.value })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-indigo-500' : 'border-slate-200 focus:border-indigo-500'} outline-none`} placeholder="Stop 1, Stop 2..." />
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-1 block">Monthly Fee (₹)</label>
                                <input type="number" value={routeForm.fees} onChange={e => setRouteForm({ ...routeForm, fees: parseInt(e.target.value) })} className={`w-full p-3 rounded-xl font-bold bg-transparent border-2 ${darkMode ? 'border-slate-700 focus:border-indigo-500' : 'border-slate-200 focus:border-indigo-500'} outline-none`} />
                            </div>
                            <button onClick={handleSaveRoute} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                                {editingItem ? 'Update Route' : 'Create Route'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
