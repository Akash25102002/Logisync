import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Plus, Search, Trash2, Edit, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import DriverForm from "../components/DriverForm";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    base44.entities.Driver.list("-created_date", 100).then(d => { setDrivers(d); setLoading(false); });
  };
  useEffect(load, []);

  const filtered = drivers.filter(d => !search || [d.name, d.phone, d.license_number].some(f => f?.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Drivers</h2>
          <p className="text-sm text-muted-foreground">{drivers.length} registered drivers</p>
        </div>
        <Button onClick={() => { setEditItem(null); setDialogOpen(true); }} className="gap-2"><Plus className="w-4 h-4" /> Add Driver</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drivers..." className="pl-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No drivers found" description="Add your first driver to get started" action={<Button onClick={() => { setEditItem(null); setDialogOpen(true); }}>Add Driver</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(d => (
            <div key={d.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {d.name?.charAt(0)?.toUpperCase()}
                </div>
                <StatusBadge status={d.status} />
              </div>
              <h3 className="font-bold text-sm">{d.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{d.phone}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>License: {d.license_number}</span>
                {d.rating && <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{d.rating}</span>}
              </div>
              {d.total_trips > 0 && <p className="text-xs text-muted-foreground mt-1">{d.total_trips} trips completed</p>}
              <div className="flex gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { setEditItem(d); setDialogOpen(true); }}><Edit className="w-3 h-3" /> Edit</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={async () => { await base44.entities.Driver.delete(d.id); load(); }}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Driver" : "Add Driver"}</DialogTitle></DialogHeader>
          <DriverForm driver={editItem} onSave={() => { setDialogOpen(false); load(); }} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}