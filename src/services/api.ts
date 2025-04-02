import { MarkerType } from "../types/marker";

const API_URL = "http://localhost:8000/marcadores"; // Substitua pela URL da sua API

export const getMarkers = async (): Promise<MarkerType[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar os marcadores");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};