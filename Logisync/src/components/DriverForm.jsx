import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DriverForm({ driver, onSave, onCancel }) {
  const [form, setForm] = useState(driver || {
    name: "", phone: "", email: "", license_number: "",
    license_expiry: "", status: "Available", total_trips: 0, rating: 5,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form };
    if (data.total_trips) data.total_trips = Number(data.total_trips);
    if (data.rating) data.rating = Number(data.rating);
    if (driver) await base44.entities.Driver.update(driver.id, data);
    else await base44.entities.Driver.create(data);
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Full Name</Label><Input value={form.name} onChange={e => set("name", e.target.value)} required /></div>
        <div><Label>Phone</Label><Input value={form.phone} onChange={e => set("phone", e.target.value)} required /></div>
      </div>
      <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>License Number</Label><Input value={form.license_number} onChange={e => set("license_number", e.target.value)} required /></div>
        <div><Label>License Expiry</Label><Input type="date" value={form.license_expiry || ""} onChange={e => set("license_expiry", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={v => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Available","On Trip","Off Duty","On Leave"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Total Trips</Label><Input type="number" value={form.total_trips} onChange={e => set("total_trips", e.target.value)} /></div>
        <div><Label>Rating (1-5)</Label><Input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => set("rating", e.target.value)} /></div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : driver ? "Update" : "Add Driver"}</Button>
      </div>
    </form>
  );
}