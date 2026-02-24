import { apiFetch } from './api';

export async function deletePhone(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/PP/Phone/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deletePC(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/PP/PC/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteLocation(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/Geo/Location/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteBuilding(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/Geo/Building/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteFloor(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/Geo/Floor/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteOffice(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/Geo/Office/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteManufactor(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/Printer/Manufactor/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteCartridge(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/Printer/Cartridge/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deletePrinterModel(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/Printer/PrinterModel/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deletePrinter(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/Printer/Printer/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteUser(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/User/User/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteADUser(id: number) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await apiFetch<{ success: boolean }>('/api/User/ADUser/Delete', {
    method: 'POST',
    body: formData,
  });
  return response;
}