import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ShipmentForm({ shipment, onSave, onCancel }) {
  const [form, setForm] = useState(shipment || {
    tracking_id: `SHP-${Date.now().toString(36).toUpperCase()}`,
    origin: "", destination: "", status: "Pending", priority: "Medium",
    cargo_description: "", weight_tons: "", distance_km: "",
    customer_name: "", customer_phone: "", notes: "",
    scheduled_departure: "", scheduled_arrival: "",
    vehicle_id: "", driver_id: "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([base44.entities.Vehicle.list(), base44.entities.Driver.list()])
      .then(([v, d]) => { setVehicles(v); setDrivers(d); });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form };
    if (data.weight_tons) data.weight_tons = Number(data.weight_tons);
    if (data.distance_km) data.distance_km = Number(data.distance_km);
    if (shipment) {
      await base44.entities.Shipment.update(shipment.id, data);
    } else {
      await base44.entities.Shipment.create(data);
    }
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Tracking ID</Label><Input value={form.tracking_id} onChange={e => set("tracking_id", e.target.value)} required /></div>
        <div>
          <Label>Priority</Label>
          <Select value={form.priority} onValueChange={v => set("priority", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Low","Medium","High","Urgent"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Origin</Label><Input value={form.origin} onChange={e => set("origin", e.target.value)} placeholder="Plant / Warehouse" required /></div>
        <div><Label>Destination</Label><Input value={form.destination} onChange={e => set("destination", e.target.value)} required /></div>
      </div>
      <div><Label>Cargo Description</Label><Textarea value={form.cargo_description} onChange={e => set("cargo_description", e.target.value)} rows={2} /></div>
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Weight (Tons)</Label><Input type="number" value={form.weight_tons} onChange={e => set("weight_tons", e.target.value)} /></div>
        <div><Label>Distance (KM)</Label><Input type="number" value={form.distance_km} onChange={e => set("distance_km", e.target.value)} /></div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={v => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Pending","Dispatched","In Transit","Delivered","Cancelled"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Vehicle</Label>
          <Select value={form.vehicle_id || ""} onValueChange={v => set("vehicle_id", v)}>
            <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
            <SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.registration_number} - {v.vehicle_type}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Driver</Label>
          <Select value={form.driver_id || ""} onValueChange={v => set("driver_id", v)}>
            <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
            <SelectContent>{drivers.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Scheduled Departure</Label><Input type="datetime-local" value={form.scheduled_departure?.slice(0,16) || ""} onChange={e => set("scheduled_departure", e.target.value)} /></div>
        <div><Label>Scheduled Arrival</Label><Input type="datetime-local" value={form.scheduled_arrival?.slice(0,16) || ""} onChange={e => set("scheduled_arrival", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Customer Name</Label><Input value={form.customer_name} onChange={e => set("customer_name", e.target.value)} /></div>
        <div><Label>Customer Phone</Label><Input value={form.customer_phone} onChange={e => set("customer_phone", e.target.value)} /></div>
      </div>
      <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} /></div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : shipment ? "Update" : "Create Shipment"}</Button>
      </div>
    </form>
  );
}