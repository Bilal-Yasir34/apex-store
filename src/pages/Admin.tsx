import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Plus, Trash2, Edit, Package, ShoppingBag, X, Star, Zap, 
  Upload, Tag, Minus, Layers, Search, CheckCircle, Clock, XCircle, RefreshCw, Mail, Phone, MapPin
} from 'lucide-react';

export default function Admin() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const CATEGORIES = [
    { label: 'Smart Watches', value: 'smart-watches' },
    { label: 'AirPods', value: 'airpods' },
    { label: 'Headphones', value: 'headphones' },
    { label: 'Wireless Chargers', value: 'wireless-chargers' },
    { label: 'Cases', value: 'cases' }
  ];

  const initialFormState = {
    name: '',
    price: '',
    compare_at_price: '', 
    category: 'smart-watches',
    images: [] as string[],
    description: '',
    stock: 10,
    section: 'none'
  };

  const [newProduct, setNewProduct] = useState(initialFormState);

  useEffect(() => {
    fetchData();
    fetchOrders(); 
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (p) setProducts(p);
    setLoading(false);
  }

  // --- ORDER MANAGEMENT ---
  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Fetch Orders Error:", error);
    } else {
      setOrders(data || []);
    }
    setOrdersLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrdersLoading(true);
    try {
      // 1. Update the database
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select(); // Select forces the return of data to confirm it worked

      if (error) throw error;

      // 2. Update local state immediately for the UI
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error: any) {
      console.error("Failed to update status:", error);
      alert("Database Error: Status was not saved. Check your Supabase RLS policies. " + error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (confirm('Permanently delete this order record?')) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        alert("Failed to delete order: " + error.message);
      } else {
        setOrders(orders.filter(order => order.id !== orderId));
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- PRODUCT MANAGEMENT ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  function startEdit(product: any) {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || '',
      category: product.category,
      images: product.images || [],
      description: product.description,
      stock: product.stock,
      section: product.section || 'none'
    });
    setIsModalOpen(true);
  }

  async function deleteProduct(id: string) {
    if (confirm('Delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newProduct.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    setLoading(true);

    const productData = {
      name: newProduct.name,
      price: parseFloat(newProduct.price as string),
      compare_at_price: parseFloat(newProduct.compare_at_price as string) || 0,
      category: newProduct.category.toLowerCase().trim(),
      description: newProduct.description,
      stock: newProduct.stock,
      section: newProduct.section,
      images: newProduct.images,
      image_url: newProduct.images[0]
    };

    try {
      let error;
      if (editingId) {
        const { error: err } = await supabase.from('products').update(productData).eq('id', editingId);
        error = err;
      } else {
        const { error: err } = await supabase.from('products').insert([productData]);
        error = err;
      }
      if (error) throw error;
      setIsModalOpen(false);
      setEditingId(null);
      setNewProduct(initialFormState);
      fetchData();
    } catch (error: any) {
      alert("Error saving product: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent italic tracking-tighter">
              APEX ADMIN
            </h1>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.3em]">Command Center</p>
          </div>
          <button onClick={() => { fetchData(); fetchOrders(); }} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10">
            <RefreshCw size={20} className={loading || ordersLoading ? "animate-spin text-purple-500" : "text-gray-400"} />
          </button>
        </div>

        <div className="flex space-x-2 mb-8 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/10">
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white'}`}>
            <Package size={16} /> Products
          </button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white'}`}>
            <ShoppingBag size={16} /> Orders <span className="ml-1 bg-black/20 px-2 py-0.5 rounded-md text-[10px]">{orders.length}</span>
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 flex justify-between items-center border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-xl font-black italic uppercase tracking-tight">Product Inventory</h2>
              <button onClick={() => { setEditingId(null); setNewProduct(initialFormState); setIsModalOpen(true); }} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:bg-purple-500 hover:text-white active:scale-95">
                <Plus size={16} strokeWidth={3} /> New Product
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.03] text-[10px] uppercase text-gray-500 font-black tracking-[0.2em]">
                  <tr>
                    <th className="px-6 py-5">Product</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Pricing</th>
                    <th className="px-6 py-5">Stock</th>
                    <th className="px-6 py-5">Tag</th>
                    <th className="px-6 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={p.images?.[0] || p.image_url} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                          <span className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 uppercase text-[10px] font-black tracking-widest text-gray-500">
                        {p.category ? p.category.replace(/-/g, ' ') : 'uncategorized'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-black text-sm">Rs. {p.price.toLocaleString()}</span>
                          {p.compare_at_price > 0 && (
                            <span className="text-red-500 text-[10px] line-through font-bold">Rs. {p.compare_at_price.toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`text-[10px] font-black px-2 py-1 rounded-md ${p.stock < 5 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                           {p.stock} units
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.section === 'featured' ? (
                          <span className="flex items-center gap-1 text-purple-400 text-[9px] font-black uppercase tracking-wider bg-purple-400/10 px-2 py-1 rounded-lg w-fit">
                            <Star size={10} fill="currentColor" /> Featured
                          </span>
                        ) : p.section === 'bestseller' ? (
                          <span className="flex items-center gap-1 text-yellow-500 text-[9px] font-black uppercase tracking-wider bg-yellow-500/10 px-2 py-1 rounded-lg w-fit">
                            <Zap size={10} fill="currentColor" /> Bestseller
                          </span>
                        ) : (
                          <span className="text-gray-600 text-[9px] font-bold uppercase tracking-widest">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEdit(p)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"><Edit size={18} /></button>
                          <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* --- ORDERS MANAGEMENT TAB --- */
          <div className="space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by customer, email or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all font-bold text-sm placeholder:text-gray-600"
              />
            </div>

            <div className="grid gap-6">
              {ordersLoading ? (
                 <div className="text-center py-32 bg-white/5 rounded-[2rem] border border-white/10">
                   <RefreshCw className="w-10 h-10 animate-spin mx-auto text-purple-500 mb-4" />
                   <p className="text-gray-500 uppercase text-[10px] font-black tracking-[0.3em]">Fetching Live Orders...</p>
                 </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-32 bg-white/5 rounded-[2rem] border border-white/10">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-800 mb-4" />
                  <p className="text-gray-500 uppercase text-[10px] font-black tracking-[0.3em]">No Cloud Orders Found</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all group">
                    <div className="p-6 flex flex-wrap justify-between items-center gap-4 bg-white/[0.02] border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-500 font-black italic">
                          #{order.id.toString().slice(-4).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-white uppercase tracking-tighter">Order Processing</span>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest 
                              ${order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' : 
                                order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 
                                order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-500' : 'bg-amber-500/20 text-amber-500'}`}>
                              {order.status || 'pending'}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                            {new Date(order.created_at).toLocaleDateString()} — {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 text-[10px] font-black uppercase tracking-widest transition-all hover:text-white" title="Confirm"><Clock size={14} /> Ship</button>
                        <button onClick={() => updateOrderStatus(order.id, 'completed')} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 text-[10px] font-black uppercase tracking-widest transition-all hover:text-white" title="Complete"><CheckCircle size={14} /> Deliver</button>
                        <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 text-[10px] font-black uppercase tracking-widest transition-all hover:text-white" title="Cancel"><XCircle size={14} /> Cancel</button>
                        <button onClick={() => deleteOrder(order.id)} className="p-2 bg-white/5 text-gray-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-3 gap-12">
                      {/* Customer info */}
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] flex items-center gap-2"><Plus size={12}/> Shipping Info</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400"><Mail size={14}/></div>
                            <span className="font-bold text-white">{order.customer_email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400"><Phone size={14}/></div>
                            <span className="font-bold text-white">{order.customer_phone}</span>
                          </div>
                          <div className="flex items-start gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 shrink-0"><MapPin size={14}/></div>
                            <span className="font-bold text-purple-400">{order.address}, {order.city}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] flex items-center gap-2"><ShoppingBag size={12}/> Order Content</h3>
                        <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                          <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm group/item">
                                <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-black">{item.quantity}x</span>
                                  <span className="text-gray-300 font-bold uppercase text-[11px] tracking-tight">{item.name}</span>
                                </div>
                                <span className="text-white font-black">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-gray-500">Order Amount</span>
                            <span className="text-2xl text-purple-500 font-black italic tracking-tighter">Rs. {order.total_amount?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- PRODUCT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center text-white">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{editingId ? 'Edit Product' : 'Add New Item'}</h3>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Update Cloud Database</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Product Images</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {newProduct.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all group">
                    <Upload size={24} className="text-gray-600 group-hover:text-purple-500 transition-colors" />
                    <span className="text-[9px] text-gray-600 mt-2 font-black uppercase group-hover:text-purple-500">Upload</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Selling Price</label>
                  <div className="relative">
                    <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500 pl-12 font-black text-lg" 
                      placeholder="0" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-500 font-bold">Rs</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-red-500 italic">Discount Price</label>
                  <div className="relative">
                    <input type="number" className="w-full bg-red-500/5 border border-red-500/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-500 pl-12 font-black text-lg" 
                      placeholder="Optional" value={newProduct.compare_at_price} onChange={(e) => setNewProduct({...newProduct, compare_at_price: e.target.value})} />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500 font-bold opacity-50">Rs</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Full Product Title</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500 font-bold" 
                    placeholder="e.g. Ultra Smart Watch Gen-2" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Stock Units</label>
                    <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500 font-bold" 
                      value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Category</label>
                    <div className="relative">
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500 appearance-none font-bold"
                        value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value} className="bg-[#0d0d0d]">{cat.label}</option>
                        ))}
                      </select>
                      <Layers size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Highlight Status</label>
                  <div className="flex gap-4">
                    {['none', 'featured', 'bestseller'].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setNewProduct({...newProduct, section: sec})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${newProduct.section === sec ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                      >
                        {sec === 'none' ? 'Standard' : sec}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                  <textarea required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500 h-40 font-medium text-sm leading-relaxed" 
                    placeholder="Describe the product features..." value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button disabled={loading} type="submit" className="w-full bg-white text-black font-black uppercase tracking-[0.3em] py-5 rounded-[1.5rem] transition-all shadow-2xl hover:bg-purple-600 hover:text-white active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                  {loading ? <RefreshCw className="animate-spin" size={20}/> : (editingId ? 'Save Changes' : 'Publish to Store')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}