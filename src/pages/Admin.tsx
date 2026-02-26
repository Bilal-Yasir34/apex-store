import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Plus, Trash2, Edit, Package, ShoppingBag, X, Star, Zap, 
  Upload, Tag, Minus, Layers, Search, CheckCircle, Clock, XCircle, RefreshCw, Mail, Phone, MapPin, ExternalLink
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

  // --- UPDATED CATEGORY LIST ---
  const CATEGORIES = [
    { label: 'Woolen Shawls', value: 'woolen_shawls_category' },
    { label: 'Prayer Mats', value: 'prayer_mats_category' },
    { label: 'Bedsheets', value: 'bedsheets_category' },
    { label: 'Comforters', value: 'comforters_category' },
    { label: 'Cushion Covers', value: 'cushion_covers_category' },
    { label: 'Curtains', value: 'curtains_category' },
    { label: 'Blankets', value: 'blankets_category' },
    { label: 'Towels', value: 'towels_category' },
    { label: 'Floor Rugs', value: 'floor_rugs_category' }
  ];

  const initialFormState = {
    name: '',
    price: '',
    compare_at_price: '', 
    category: 'woolen_shawls_category',
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

  async function fetchOrders() {
    setOrdersLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data || []);
    setOrdersLoading(false);
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (confirm('Delete this order record?')) {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (!error) setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  function startEdit(product: any) {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || '',
      category: product.category,
      images: Array.isArray(product.images) ? product.images : [product.image_url],
      description: product.description || '',
      stock: product.stock || 0,
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
    if (newProduct.images.length === 0) return alert("Upload at least one image.");
    setLoading(true);

    const productData = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      compare_at_price: parseFloat(newProduct.compare_at_price) || 0,
      category: newProduct.category,
      images: newProduct.images,
      image_url: newProduct.images[0], 
      description: newProduct.description,
      stock: newProduct.stock,
      section: newProduct.section.toLowerCase() 
    };

    try {
      const { error } = editingId 
        ? await supabase.from('products').update(productData).eq('id', editingId)
        : await supabase.from('products').insert([productData]);
      
      if (error) throw error;
      setIsModalOpen(false);
      setEditingId(null);
      setNewProduct(initialFormState);
      fetchData();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id?.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-24 pb-20 px-4 md:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic text-slate-900 flex items-center gap-3">
              Sakoon <span className="text-[#D4AF37] not-italic font-light">|</span> <span className="text-sm not-italic font-black uppercase tracking-[0.4em] text-slate-400">Studio</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Inventory & Logistics Control</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { fetchData(); fetchOrders(); }} className="p-4 bg-white rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 shadow-sm">
              <RefreshCw size={18} className={loading || ordersLoading ? "animate-spin text-[#D4AF37]" : "text-slate-400"} />
            </button>
            <button onClick={() => { setEditingId(null); setNewProduct(initialFormState); setIsModalOpen(true); }} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all hover:bg-[#D4AF37] hover:shadow-lg active:scale-95">
              <Plus size={16} strokeWidth={3} /> Add New Piece
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-10 bg-slate-100/50 p-1.5 rounded-[2rem] w-fit border border-slate-200/50">
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
            <Package size={14} /> Catalog
          </button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
            <ShoppingBag size={14} /> Client Orders <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] ${orders.length > 0 ? 'bg-[#D4AF37] text-white' : 'bg-slate-200 text-slate-500'}`}>{orders.length}</span>
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] uppercase text-slate-400 font-black tracking-[0.2em] border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6">Product Detail</th>
                    <th className="px-8 py-6">Category</th>
                    <th className="px-8 py-6">Price</th>
                    <th className="px-8 py-6">Availability</th>
                    <th className="px-8 py-6 text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <img src={Array.isArray(p.images) ? p.images[0] : p.image_url} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" alt="" />
                          <div>
                            <span className="font-black text-xs text-slate-900 uppercase tracking-tight block">{p.name}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest mt-1 inline-block px-2 py-0.5 rounded ${p.section === 'featured' ? 'bg-amber-100 text-[#D4AF37]' : p.section === 'bestseller' ? 'bg-blue-100 text-blue-600' : 'text-slate-400'}`}>
                              {p.section !== 'none' ? p.section : 'Standard'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                          {p.category?.replace('_category', '').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-black text-sm">£ {p.price?.toLocaleString()}</span>
                          {p.compare_at_price > 0 && <span className="text-slate-300 text-[10px] line-through font-bold">£ {p.compare_at_price.toLocaleString()}</span>}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${p.stock < 5 ? 'border-red-100 text-red-500 bg-red-50' : 'border-emerald-100 text-emerald-600 bg-emerald-50'}`}>
                           {p.stock} units
                         </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEdit(p)} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"><Edit size={16} /></button>
                          <button onClick={() => deleteProduct(p.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="relative max-w-md">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search Client or Order ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-3xl py-5 pl-14 pr-6 text-slate-900 outline-none focus:border-[#D4AF37] transition-all font-bold text-xs placeholder:text-slate-300 shadow-sm"
              />
            </div>

            <div className="grid gap-8">
              {ordersLoading ? (
                <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100">
                  <RefreshCw className="w-10 h-10 animate-spin mx-auto text-[#D4AF37] mb-4" />
                  <p className="text-slate-400 uppercase text-[10px] font-black tracking-[0.3em]">Syncing Orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-100 mb-6" />
                  <p className="text-slate-400 uppercase text-[10px] font-black tracking-[0.3em]">No orders found</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                    <div className="p-8 flex flex-wrap justify-between items-center gap-6 bg-slate-50/50 border-b border-slate-100">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white">
                          <span className="text-[8px] font-black opacity-50 uppercase">ID</span>
                          <span className="font-black text-sm italic">#{order.id.toString().slice(-4).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-900 uppercase text-xs tracking-tight">{order.customer_name || 'Anonymous Guest'}</span>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                              ${order.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                                order.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-500' : 
                                order.status === 'confirmed' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-amber-50 border-amber-100 text-[#D4AF37]'}`}>
                              {order.status || 'pending'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Confirm</button>
                        <button onClick={() => updateOrderStatus(order.id, 'completed')} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Deliver</button>
                        <button onClick={() => deleteOrder(order.id)} className="p-3 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={20}/></button>
                      </div>
                    </div>

                    <div className="p-10 grid md:grid-cols-3 gap-16">
                      <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.3em] flex items-center gap-2">Client Details</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={16}/></div>
                            <span className="font-bold text-sm text-slate-600">{order.customer_email}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={16}/></div>
                            <span className="font-bold text-sm text-slate-600">{order.customer_phone}</span>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><MapPin size={16}/></div>
                            <span className="font-bold text-sm text-slate-900 leading-relaxed">{order.address}, <br/>{order.city}</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-6">
                        <h3 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.3em]">Boutique Selection</h3>
                        <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                          <div className="space-y-4">
                            {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                  <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{item.quantity}</span>
                                  <span className="text-slate-900 font-black uppercase text-[11px] tracking-tight">{item.name}</span>
                                </div>
                                <span className="text-slate-600 font-bold">£ {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end">
                            <div>
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Order Value</p>
                                <span className="text-3xl text-slate-900 font-black italic tracking-tighter">£ {order.total_amount?.toLocaleString()}</span>
                            </div>
                            <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Clock size={12}/> Cash on Delivery
                            </div>
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

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500 border border-slate-100">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">{editingId ? 'Refine Piece' : 'Curate New Piece'}</h3>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Database Update Portal</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto hide-scrollbar">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visual Gallery</label>
                <div className="grid grid-cols-4 gap-4">
                  {newProduct.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-100 rounded-2xl cursor-pointer hover:border-[#D4AF37] hover:bg-amber-50/30 transition-all group">
                    <Upload size={24} className="text-slate-200 group-hover:text-[#D4AF37] transition-colors" />
                    <span className="text-[9px] text-slate-300 mt-2 font-black uppercase group-hover:text-[#D4AF37]">Add Image</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Artisan Price (Sale)</label>
                  <div className="relative">
                    <input required type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 outline-none focus:border-[#D4AF37] pl-14 font-black text-xl" 
                      placeholder="0" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] font-black">£</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Original Price (Strikethrough)</label>
                  <div className="relative">
                    <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 outline-none focus:border-[#D4AF37] pl-14 font-black text-xl opacity-60" 
                      placeholder="Optional" value={newProduct.compare_at_price} onChange={(e) => setNewProduct({...newProduct, compare_at_price: e.target.value})} />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">£</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Product Nomenclature</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 outline-none focus:border-[#D4AF37] font-black text-sm uppercase tracking-tight" 
                    placeholder="e.g. Fine Cashmere Shawl" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Units Available</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 outline-none focus:border-[#D4AF37] font-black" 
                      value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Collection</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 outline-none focus:border-[#D4AF37] appearance-none font-black text-xs uppercase tracking-widest"
                        value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                      <Layers size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Exclusivity Tag (Homepage Placement)</label>
                  <div className="flex gap-4">
                    {['none', 'featured', 'bestseller'].map((sec) => (
                      <button key={sec} type="button" onClick={() => setNewProduct({...newProduct, section: sec})}
                        className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${newProduct.section === sec ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-300 hover:text-slate-900'}`}>
                        {sec === 'none' ? 'Standard' : sec}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Artisan Narrative (Description)</label>
                  <textarea required className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-5 text-slate-700 outline-none focus:border-[#D4AF37] h-40 font-medium text-sm leading-relaxed" 
                    placeholder="Tell the story of this piece..." value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                </div>
              </div>

              <div className="pt-6">
                <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white font-black uppercase tracking-[0.3em] py-6 rounded-[2rem] transition-all shadow-xl hover:bg-[#D4AF37] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                  {loading ? <RefreshCw className="animate-spin" size={20}/> : (editingId ? 'Update Collection' : 'Publish Piece')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}