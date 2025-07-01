"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AdminStore } from "@/types/admin";

export interface StoreDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: AdminStore | null;
  onSave: (data: Omit<AdminStore, "id"> & { id?: string }) => void;
}

export default function StoreDialog({ open, onClose, initial, onSave }: StoreDialogProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");
  const [lat, setLat] = useState("0");
  const [lng, setLng] = useState("0");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setAddress(initial.address);
      setRegion(initial.region);
      setLat(initial.lat.toString());
      setLng(initial.lng.toString());
      setIsActive(initial.isActive);
    } else {
      setName("");
      setAddress("");
      setRegion("");
      setLat("0");
      setLng("0");
      setIsActive(true);
    }
  }, [initial]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id,
      name,
      address,
      region,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      isActive,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? "Редактировать магазин" : "Добавить магазин"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Название" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
          <TextField label="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
          <TextField label="Регион" value={region} onChange={(e) => setRegion(e.target.value)} fullWidth />
          <TextField label="Широта" value={lat} onChange={(e) => setLat(e.target.value)} type="number" fullWidth />
          <TextField label="Долгота" value={lng} onChange={(e) => setLng(e.target.value)} type="number" fullWidth />
          <FormControlLabel control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Активен" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSave} disabled={!name.trim()}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
