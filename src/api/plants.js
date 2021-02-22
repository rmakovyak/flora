import apiClient from './apiClient';

export function searchPlants(q) {
  return apiClient.get(`/plants/search/${q}`);
}

export function getPlants() {
  return apiClient.get('/plants');
}

export function createPlant(body) {
  return apiClient.post('/plants', body);
}

export function deletePlant(id) {
  return apiClient.delete(`/plants/${id}`);
}

export function createPlantWatering(plantId) {
  return apiClient.post(`/watering/${plantId}`);
}

export function getPlantWaterings() {
  return apiClient.get(`/watering`);
}

export function deleteWatering(id) {
  return apiClient.delete(`/watering/${id}`);
}

export function createLocation(plantId, location) {
  return apiClient.post(`/locations/${plantId}/${location}`);
}

export function deleteLocation(id) {
  return apiClient.delete(`/locations/${id}`);
}
