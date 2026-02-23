import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, QrCode, Eye, Trash2, Copy, Check,
  Image, Video, MessageSquare, ExternalLink, Play, Filter,
  ToggleLeft, PowerOff, Loader
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { Button, Card, Badge, Spinner, Modal, Toggle, Empty } from '../components/UI';

/* ── Media grid thumbnail ───────────────────────────────────────────────── */
function Thumb({ item, onDelete }) {
  const [hov, setHov] = useState(false);

  if (item.type === 'message') return (
    <div className="aspect-square rounded-[var(--r-md)] overflow-hidden flex flex-col items-center justify-center p-4 text-center"
      style={{ background: 'linear-gradient(135deg,#fafaf9,#f0ebe0)' }}>
      <MessageSquare size={18} className="mb-2 text-[var(--gold-400)]" />
      <p className="text-xs text-[var(--stone-700)] italic line-clamp-4">"{item.message_body}"</p>
      <p className="text-xs text-[var(--stone-400)] mt-2">— {item.uploader_name || 'Guest'}</p>
    </div>
  );

  return (
    <div
      className="aspect-square rounded-[var(--r-md)] overflow-hidden relative bg-[var(--stone-100)] group cursor-pointer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {item.thumbnail_url || item.original_url ? (
        <img src={item.thumbnail_url||item.original_url} alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[var(--stone-300)]">
          <Image size={28} />
        </div>
      )}
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
            <Play size={14} className="ml-0.5" />
          </div>
        </div>
      )}

      <AnimatePresence>
        {hov && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 bg-[var(--stone-900)] bg-opacity-70 flex flex-col items-center justify-center gap-2 p-2">
            <p className="text-white text-xs text-center font-medium">{item.uploader_name || 'Guest'}</p>
            <p className="text-white text-xs opacity-60">{format(new Date(item.created_at),'MMM d, h:mm a')}</p>
            <div className="flex gap-2 mt-1">
              {item.original_url && (
                <a href={item.original_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 flex items-center justify-center text-white transition">
                  <ExternalLink size={13}/>
                </a>
              )}
              <button onClick={() => onDelete(item)}
                className="w-8 h-8 rounded-full bg-rose-500 bg-opacity-80 hover:bg-opacity-100 flex items-center justify-center text-white transition">
                <Trash2 size={13}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!item.is_approved && (
        <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Hidden</span>
      )}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function AdminEventPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();

  const [event,    setEvent]    = useState(null);
  const [media,    setMedia]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [dlBusy,   setDlBusy]   = useState(false);
  const [showQR,   setShowQR]   = useState(false);
  const [delTarget,setDelTarget]= useState(null);
  const [copied,   setCopied]   = useState(false);

  const publicUrl = event ? `${window.location.origin}/e/${event.upload_token}` : '';

  const load = useCallback(async () => {
    try {
      const [evR, medR] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/media?limit=300`),
      ]);
      setEvent(evR.data);
      setMedia(medR.data.items);
    } catch { toast('Failed to load','error'); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const download = async () => {
    setDlBusy(true);
    try {
      const res = await api.post(`/events/${id}/download`, {}, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      Object.assign(document.createElement('a'), { href: url, download: `${event.title.replace(/\s+/g,'_')}_photos.zip` }).click();
      URL.revokeObjectURL(url);
      toast('Download started!', 'success');
    } catch { toast('Download failed','error'); }
    setDlBusy(false);
  };

  const toggleActive = async () => {
    try {
      const { data } = await api.put(`/events/${id}`, { is_active: !event.is_active });
      setEvent(data);
      toast(data.is_active ? 'Event activated' : 'Event deactivated','info');
    } catch { toast('Update failed','error'); }
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    try {
      await api.delete(`/events/${id}/media/${delTarget.id}`);
      setMedia(p => p.filter(m => m.id !== delTarget.id));
      toast('Item deleted','success');
    } catch { toast('Delete failed','error'); }
    setDelTarget(null);
  };

  const copy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = filter === 'all' ? media : media.filter(m => m.type === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={44}/></div>;
  if (!event)  return <div className="min-h-screen flex items-center justify-center text-[var(--stone-500)]">Event not found</div>;

  const stats = [
    { label: 'Photos',   value: event.photo_count   ?? 0, icon: Image },
    { label: 'Videos',   value: event.video_count   ?? 0, icon: Video },
    { label: 'Messages', value: event.message_count ?? 0, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[var(--stone-50)]">
      {/* Sticky header */}
      <header className="bg-white border-b border-[var(--stone-100)] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => nav('/admin')}
            className="w-9 h-9 rounded-full hover:bg-[var(--stone-100)] flex items-center justify-center transition">
            <ArrowLeft size={18}/>
          </button>
          <h1 className="font-display text-xl flex-1 truncate">{event.title}</h1>
          <Badge variant={event.is_active ? 'green' : 'default'}>
            {event.is_active ? 'Active' : 'Closed'}
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Info card */}
          <Card className="lg:col-span-2 p-6">
            {/* URL bar */}
            <div className="flex items-center gap-2 bg-[var(--stone-50)] rounded-[var(--r-md)] px-3 py-2.5 mb-5 border border-[var(--stone-100)]">
              <span className="text-xs text-[var(--stone-500)] flex-1 truncate">{publicUrl}</span>
              <button onClick={copy} className="text-[var(--gold-500)] hover:text-[var(--gold-600)] transition shrink-0">
                {copied ? <Check size={15}/> : <Copy size={15}/>}
              </button>
            </div>
            {/* Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button variant="secondary" size="sm" onClick={() => setShowQR(true)}>
                <QrCode size={14}/> QR Code
              </Button>
              <Button variant="secondary" size="sm" onClick={() => window.open(publicUrl,'_blank')}>
                <Eye size={14}/> Guest view
              </Button>
              <Button variant="secondary" size="sm"
                onClick={() => window.open(`/e/${event.upload_token}/slideshow`, '_blank')}>
                <Play size={14}/> Slideshow
              </Button>
              <Button variant="secondary" size="sm"
                onClick={() => window.open(`/e/${event.upload_token}/gallery`, '_blank')}>
                <Image size={14}/> Gallery
              </Button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center p-4 rounded-[var(--r-lg)] bg-[var(--stone-50)] border border-[var(--stone-100)]">
                  <Icon size={20} className="text-[var(--gold-400)] mx-auto mb-2"/>
                  <p className="font-display text-3xl">{value}</p>
                  <p className="text-xs text-[var(--stone-400)] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions card */}
          <Card className="p-6 flex flex-col gap-3">
            <p className="text-xs font-medium text-[var(--stone-400)] uppercase tracking-wider mb-1">Actions</p>
            <Button variant="gold" className="w-full" onClick={download} loading={dlBusy}>
              <Download size={16}/> Download All
            </Button>
            <Button variant="secondary" className="w-full" onClick={toggleActive}>
              {event.is_active ? <><PowerOff size={16}/> Deactivate uploads</> : <><ToggleLeft size={16}/> Activate uploads</>}
            </Button>
            <div className="mt-2 pt-3 border-t border-[var(--stone-100)] flex flex-col gap-3">
              <Toggle
                checked={event.settings?.allow_public_view ?? true}
                label="Public gallery"
                onChange={async v => {
                  const { data } = await api.put(`/events/${id}`, { settings: { allow_public_view: v } });
                  setEvent(data);
                }}
              />
              <Toggle
                checked={event.settings?.moderation_enabled ?? false}
                label="Moderate uploads"
                onChange={async v => {
                  const { data } = await api.put(`/events/${id}`, { settings: { moderation_enabled: v } });
                  setEvent(data);
                }}
              />
            </div>
          </Card>
        </div>

        {/* Media gallery */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-2xl flex-1">Gallery</h2>
            {/* Filter tabs */}
            <div className="flex gap-1 p-1 bg-[var(--stone-100)] rounded-[var(--r-lg)]">
              {['all','photo','video','message'].map(f => (
                <button key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-[var(--r-md)] text-xs font-medium transition capitalize
                    ${filter===f ? 'bg-white shadow-sm text-[var(--stone-900)]' : 'text-[var(--stone-500)] hover:text-[var(--stone-800)]'}
                  `}
                >{f}</button>
              ))}
            </div>
            <span className="text-sm text-[var(--stone-400)]">{filtered.length}</span>
          </div>

          {filtered.length === 0 ? (
            <Empty icon={Image} title={`No ${filter === 'all' ? 'media' : filter + 's'} yet`}
              body="Uploads from guests will appear here in real time." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
              <AnimatePresence>
                {filtered.map(item => (
                  <motion.div key={item.id} layout initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.9}}>
                    <Thumb item={item} onDelete={setDelTarget} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* QR Modal */}
      <Modal open={showQR} onClose={() => setShowQR(false)} title="QR Code">
        <div className="flex flex-col items-center gap-5">
          {event.qr_data_url && (
            <img src={event.qr_data_url} alt="QR Code" className="w-56 h-56 rounded-[var(--r-lg)] border border-[var(--stone-100)]"/>
          )}
          <p className="text-sm text-[var(--stone-500)] text-center">Print or display this at your venue</p>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => {
              const a = document.createElement('a');
              a.href = event.qr_data_url;
              a.download = `${event.title.replace(/\s+/g,'_')}_qr.png`;
              a.click();
            }}>
              <Download size={14}/> Download
            </Button>
            <Button size="sm" onClick={copy}>
              {copied ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy link</>}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delTarget} onClose={() => setDelTarget(null)} title="Delete item">
        <p className="text-[var(--stone-600)] mb-6">Permanently remove this {delTarget?.type}?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDelTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
