import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VehicleForm({ vehicle, onSave, onCancel }) {
  const [form, setForm] = useState(vehicle || {
    registration_number: "", vehicle_type: "Truck", make: "", model: "",
    year: "", capacity_tons: "", fuel_type: "Diesel", status: "Available",
    mileage_km: "", last_service_date: "", insurance_expiry: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form };
    if (data.year) data.year = Number(data.year);
    if (data.capacity_tons) data.capacity_tons = Number(data.capacity_tons);
    if (data.mileage_km) data.mileage_km = Number(data.mileage_km);
    if (vehicle) await base44.entities.Vehicle.update(vehicle.id, data);
    else await base44.entities.Vehicle.create(data);
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Registration Number</Label><Input value={form.registration_number} onChange={e => set("registration_number", e.target.value)} required /></div>
        <div>
          <Label>Vehicle Type</Label>
          <Select value={form.vehicle_type} onValueChange={v => set("vehicle_type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Truck","Van","Trailer","Tanker","Flatbed"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Make</Label><Input value={form.make} onChange={e => set("make", e.target.value)} /></div>
        <div><Label>Model</Label><Input value={form.model} onChange={e => set("model", e.target.value)} /></div>
        <div><Label>Year</Label><Input type="number" value={form.year} onChange={e => set("year", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Capacity (Tons)</Label><Input type="number" value={form.capacity_tons} onChange={e => set("capacity_tons", e.target.value)} /></div>
        <div>
          <Label>Fuel Type</Label>
          <Select value={form.fuel_type} onValueChange={v => set("fuel_type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Diesel","Petrol","Electric","CNG"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={v => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Available","In Transit","Maintenance","Out of Service"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Mileage (KM)</Label><Input type="number" value={form.mileage_km} onChange={e => set("mileage_km", e.target.value)} /></div>
        <div><Label>Last Service</Label><Input type="date" value={form.last_service_date || ""} onChange={e => set("last_service_date", e.target.value)} /></div>
        <div><Label>Insurance Expiry</Label><Input type="date" value={form.insurance_expiry || ""} onChange={e => set("insurance_expiry", e.target.value)} /></div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : vehicle ? "Update" : "Add Vehicle"}</Button>
      </div>
    </form>
  );
}