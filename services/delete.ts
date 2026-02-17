import { apiFetch } from './api';

export async function deletePhone(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/PP/PhoneDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deletePC(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/PP/PCDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteLocation(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/Geo/LocationDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteBuilding(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/Geo/BuildingDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteFloor(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/Geo/FloorDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteOffice(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/Geo/OfficeDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteManufactor(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/Printer/ManufactorDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteCartridge(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/Printer/CartridgeDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deletePrinterModel(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/Printer/PrinterModelDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deletePrinter(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/Printer/PrinterDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteUser(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/User/UserDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteADUser(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/User/ADUserDelete', {
    method: 'POST',
    body: formData,
  });
  return response;
}