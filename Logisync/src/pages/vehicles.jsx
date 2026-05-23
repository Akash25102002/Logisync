import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Truck, Plus, Search, Trash2, Edit, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import VehicleForm from "../components/VehicleForm";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    base44.entities.Vehicle.list("-created_date", 100).then(v => { setVehicles(v); setLoading(false); });
  };
  useEffect(load, []);

  const filtered = vehicles.filter(v => !search || [v.registration_number, v.make, v.model, v.vehicle_type].some(f => f?.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Fleet Vehicles</h2>
          <p className="text-sm text-muted-foreground">{vehicles.length} vehicles in fleet</p>
        </div>
        <Button onClick={() => { setEditItem(null); setDialogOpen(true); }} className="gap-2"><Plus className="w-4 h-4" /> Add Vehicle</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicles..." className="pl-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Truck} title="No vehicles found" description="Add your first vehicle to the fleet" action={<Button onClick={() => { setEditItem(null); setDialogOpen(true); }}>Add Vehicle</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(v => (
            <div key={v.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <StatusBadge status={v.status} />
              </div>
              <h3 className="font-bold text-sm">{v.registration_number}</h3>
              <p className="text-xs text-muted-foreground">{v.make} {v.model} {v.year ? `(${v.year})` : ""}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>{v.vehicle_type}</span>
                {v.capacity_tons && <span>{v.capacity_tons}T</span>}
                {v.fuel_type && <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{v.fuel_type}</span>}
              </div>
              <div className="flex gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { setEditItem(v); setDialogOpen(true); }}><Edit className="w-3 h-3" /> Edit</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={async () => { await base44.entities.Vehicle.delete(v.id); load(); }}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle></DialogHeader>
          <VehicleForm vehicle={editItem} onSave={() => { setDialogOpen(false); load(); }} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}