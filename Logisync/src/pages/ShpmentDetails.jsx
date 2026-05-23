import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Truck, User, Package, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatusBadge from "../components/StatusBadge";
import ShipmentForm from "../components/ShipmentForm";
import moment from "moment";

const steps = ["Pending", "Dispatched", "In Transit", "Delivered"];

export default function ShipmentDetail() {
  const { shipmentId } = useParams();
  const [shipment, setShipment] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const s = await base44.entities.Shipment.get(shipmentId);
    setShipment(s);
    if (s.vehicle_id) base44.entities.Vehicle.get(s.vehicle_id).then(setVehicle).catch(() => {});
    if (s.driver_id) base44.entities.Driver.get(s.driver_id).then(setDriver).catch(() => {});
    setLoading(false);
  };
  useEffect(() => { load(); }, [shipmentId]);

  if (loading || !shipment) return <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const stepIndex = steps.indexOf(shipment.status);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/shipments"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight font-mono">{shipment.tracking_id}</h2>
          <p className="text-sm text-muted-foreground">{shipment.origin} &rarr; {shipment.destination}</p>
        </div>
        <StatusBadge status={shipment.status} />
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}><Edit className="w-3.5 h-3.5" /> Edit</Button>
      </div>

      {shipment.status !== "Cancelled" && (
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= stepIndex ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </div>
                  <span className="text-[10px] mt-1.5 font-medium text-muted-foreground">{step}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded ${i < stepIndex ? "bg-secondary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard title="Shipment Details" icon={Package}>
          <Row label="Cargo" value={shipment.cargo_description || "—"} />
          <Row label="Weight" value={shipment.weight_tons ? `${shipment.weight_tons} tons` : "—"} />
          <Row label="Distance" value={shipment.distance_km ? `${shipment.distance_km} km` : "—"} />
          <Row label="Priority" value={<StatusBadge status={shipment.priority} />} />
        </InfoCard>
        <InfoCard title="Schedule" icon={Clock}>
          <Row label="Sched. Departure" value={shipment.scheduled_departure ? moment(shipment.scheduled_departure).format("MMM D, YYYY HH:mm") : "—"} />
          <Row label="Sched. Arrival" value={shipment.scheduled_arrival ? moment(shipment.scheduled_arrival).format("MMM D, YYYY HH:mm") : "—"} />
          <Row label="Actual Departure" value={shipment.actual_departure ? moment(shipment.actual_departure).format("MMM D, YYYY HH:mm") : "—"} />
          <Row label="Actual Arrival" value={shipment.actual_arrival ? moment(shipment.actual_arrival).format("MMM D, YYYY HH:mm") : "—"} />
        </InfoCard>
        <InfoCard title="Vehicle" icon={Truck}>
          {vehicle ? (
            <>
              <Row label="Registration" value={vehicle.registration_number} />
              <Row label="Type" value={vehicle.vehicle_type} />
              <Row label="Status" value={<StatusBadge status={vehicle.status} />} />
            </>
          ) : <p className="text-xs text-muted-foreground">No vehicle assigned</p>}
        </InfoCard>
        <InfoCard title="Driver and Customer" icon={User}>
          <Row label="Driver" value={driver?.name || "Not assigned"} />
          <Row label="Customer" value={shipment.customer_name || "—"} />
          <Row label="Customer Phone" value={shipment.customer_phone || "—"} />
        </InfoCard>
      </div>

      {shipment.notes && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground">{shipment.notes}</p>
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Shipment</DialogTitle></DialogHeader>
          <ShipmentForm shipment={shipment} onSave={() => { setEditOpen(false); load(); }} onCancel={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2"><Icon className="w-4 h-4 text-secondary" /> {title}</h3>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}