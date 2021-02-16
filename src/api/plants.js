import axios from 'axios';
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
