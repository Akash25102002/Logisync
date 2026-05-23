import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Truck, Package, Users, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(222,47%,20%)", "hsl(38,92%,50%)", "hsl(160,60%,45%)", "hsl(0,84%,60%)", "hsl(220,9%,70%)"];

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Vehicle.list(),
      base44.entities.Driver.list(),
      base44.entities.Shipment.list("-created_date", 50),
    ]).then(([v, d, s]) => {
      setVehicles(v);
      setDrivers(d);
      setShipments(s);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const activeShipments = shipments.filter(s => ["Dispatched", "In Transit"].includes(s.status)).length;
  const availableVehicles = vehicles.filter(v => v.status === "Available").length;
  const availableDrivers = drivers.filter(d => d.status === "Available").length;
  const maintenanceVehicles = vehicles.filter(v => v.status === "Maintenance").length;

  const shipmentStatusData = ["Pending", "Dispatched", "In Transit", "Delivered", "Cancelled"].map(s => ({
    name: s,
    value: shipments.filter(sh => sh.status === s).length,
  })).filter(d => d.value > 0);

  const vehicleStatusData = ["Available", "In Transit", "Maintenance", "Out of Service"].map(s => ({
    name: s,
    count: vehicles.filter(v => v.status === s).length,
  }));

  const recentShipments = shipments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Transport operations overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Vehicles" value={vehicles.length} subtitle={`${availableVehicles} available`} icon={Truck} color="primary" />
        <StatCard label="Active Shipments" value={activeShipments} subtitle={`${shipments.length} total`} icon={Package} color="secondary" />
        <StatCard label="Drivers" value={drivers.length} subtitle={`${availableDrivers} available`} icon={Users} color="green" />
        <StatCard label="In Maintenance" value={maintenanceVehicles} subtitle="Vehicles" icon={AlertTriangle} color="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Vehicle Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vehicleStatusData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(222,47%,20%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Shipment Breakdown</h3>
          {shipmentStatusData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={shipmentStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {shipmentStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {shipmentStatusData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="font-semibold ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No shipments yet</p>
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">Recent Shipments</h3>
          <Link to="/shipments" className="text-xs text-secondary font-medium hover:underline">View all →</Link>
        </div>
        {recentShipments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No shipments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left px-5 py-3 font-medium">Tracking ID</th>
                  <th className="text-left px-5 py-3 font-medium">Origin → Destination</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <Link to={`/shipments/${s.id}`} className="font-mono text-xs font-semibold text-secondary hover:underline">{s.tracking_id}</Link>
                    </td>
                    <td className="px-5 py-3 text-xs">{s.origin} → {s.destination}</td>
                    <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-3"><StatusBadge status={s.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}