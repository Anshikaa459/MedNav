import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/components/ui/sonner";

export default function AdminAmbulances() {
  const { ambulances, hospitals, addAmbulance, updateAmbulance, deleteAmbulance } = useAdmin();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const empty = {
    vehicleNumber: "", hospitalId: hospitals[0]?.id || "", hospitalName: hospitals[0]?.name || "",
    driver: "", phone: "", type: "Basic", status: "Available", lat: 0, lng: 0,
  };
  const [form, setForm] = useState(empty);

  const filtered = ambulances.filter((a) =>
    [a.vehicleNumber, a.driver, a.hospitalName].some((x) => x.toLowerCase().includes(search.toLowerCase()))
  );

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (a) => { setEditing(a); const { id, ...rest } = a; setForm(rest); setOpen(true); };

  const submit = (e) => {
    e.preventDefault();
    if (!form.vehicleNumber || !form.driver) { toast.error("Vehicle # and driver required"); return; }
    const hospital = hospitals.find((h) => h.id === form.hospitalId);
    const payload = { ...form, hospitalName: hospital?.name || form.hospitalName };
    if (editing) { updateAmbulance(editing.id, payload); toast.success("Ambulance updated"); }
    else { addAmbulance(payload); toast.success("Ambulance added"); }
    setOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Manage Ambulances</h1>
          <p className="text-sm text-muted-foreground">{ambulances.length} units in fleet</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" />Add Ambulance</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by vehicle, driver..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle #</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-sm font-medium flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <AmbIcon className="h-4 w-4 text-primary" />
                    </div>
                    {a.vehicleNumber}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{a.driver}</div>
                    <div className="text-xs text-muted-foreground">{a.phone}</div>
                  </TableCell>
                  <TableCell className="text-sm">{a.hospitalName}</TableCell>
                  <TableCell><span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{a.type}</span></TableCell>
                  <TableCell>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      a.status === "Available" ? "bg-success/10 text-success" :
                      a.status === "On Trip" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    }`}>{a.status}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No ambulances found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Ambulance" : "Add Ambulance"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Vehicle #</Label>
                <Input value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Driver</Label>
                <Input value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Hospital</Label>
                <Select value={form.hospitalId} onValueChange={(v) => setForm({ ...form, hospitalId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {hospitals.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="On Trip">On Trip</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? "Save Changes" : "Add Ambulance"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ambulance?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (confirmDelete) { deleteAmbulance(confirmDelete); toast.success("Ambulance deleted"); } setConfirmDelete(null); }}
            >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
