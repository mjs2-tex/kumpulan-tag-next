'use client';
import { Suspense, useState } from 'react';

import { printLabels } from './PrintLabels';

interface ItemData {
    id: number;
    color: string;
    length: string;
    barcode: string;
}

const TagCrudGrid = () => {
    const [items, setItems] = useState<ItemData[]>([]);
    const [form, setForm] = useState({ color: '', length: '', barcode: '' });

    // Fungsi Tambah Data (Create)
    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.color || !form.length || !form.barcode) return;

        const newItem: ItemData = {
            id: items.length > 0 ? items[items.length - 1].id + 1 : 1, // Auto-increment ID
            color: form.color,
            length: form.length,
            barcode: form.barcode,
        };

        setItems([...items, newItem]);
        setForm({ color: '', length: '', barcode: '' }); // Reset form
    };

    // Fungsi Hapus (Delete)
    const deleteItem = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    return (
        <div className="relative z-10 w-full max-w-4xl p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">SABRINA TAG</h2>

            {/* --- FORM INPUT --- */}
            <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div>
                    <label className="block text-xs mb-1 opacity-70">Color</label>
                    <input
                        type="text"
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="e.g. Red"
                    />
                </div>
                <div>
                    <label className="block text-xs mb-1 opacity-70">Length</label>
                    <input
                        type="text"
                        value={form.length}
                        onChange={(e) => setForm({ ...form, length: e.target.value })}
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="e.g. 10cm"
                    />
                </div>
                <div>
                    <label className="block text-xs mb-1 opacity-70">Barcode</label>
                    <input
                        type="text"
                        value={form.barcode}
                        onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                        className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="889231..."
                    />
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-all shadow-lg"
                    >
                        + Add Data
                    </button>
                </div>
            </form>

            {/* --- DATA GRID / TABLE --- */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/20">
                        <tr>
                            <th className="p-3 text-sm font-semibold">No</th>
                            <th className="p-3 text-sm font-semibold">Color</th>
                            <th className="p-3 text-sm font-semibold">Length</th>
                            <th className="p-3 text-sm font-semibold">Barcode</th>
                            <th className="p-3 text-sm font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-3 text-sm">{index + 1}</td>
                                    <td className="p-3 text-sm">
                                        <span className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full border border-white/50"
                                                style={{ backgroundColor: item.color.toLowerCase() }}
                                            ></div>
                                            {item.color}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm">{item.length}</td>
                                    <td className="p-3 text-sm font-mono text-blue-300">{item.barcode}</td>
                                    <td className="p-3 text-sm text-center">
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white px-3 py-1 rounded-md border border-red-500/50 transition-all text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-white/40 italic">
                                    No data available. Add some above!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-end justify-end mt-3 w-full">
                <button
                    onClick={async() => await printLabels(items)}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Print Data
                </button>

            </div>


        </div>
    );
}


 const Page = () => {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <TagCrudGrid />
        </Suspense>
    )
}

export default Page