import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GameScore {
  id?: number;
  user_id: number;
  score: number;
  game_duration?: number; // in seconds
  difficulty?: string;
  created_at?: string;
}

export interface UserStats {
  id?: number;
  user_id: number;
  best_score: number;
  median_score: number;
  average_score: number;
  total_games: number;
  score_trend: number[]; // array of recent scores for trend analysis
  created_at?: string;
  updated_at?: string;
}

export interface OverallStats {
  total_users: number;
  global_best_score: number;
  global_average_score: number;
  global_median_score: number;
  score_distribution: { score_range: string; count: number }[];
  recent_activity: { date: string; games_played: number }[];
}

export interface Stats {
  id?: number;
  created_at?: string;
  user?: number;
  best_score?: number;
  median_score?: number;
  average_score?: number;
  graph?: string;
}

export const apiService = {
  // Game Score API
  submitGameScore: async (score: GameScore): Promise<GameScore> => {
    const response = await api.post('/game-scores/', score);
    return response.data;
  },

  getUserGameScores: async (userId: number): Promise<GameScore[]> => {
    const response = await api.get(`/game-scores/user/${userId}/`);
    return response.data;
  },

  // User Stats API
  getUserStats: async (userId: number): Promise<UserStats> => {
    const response = await api.get(`/user-stats/${userId}/`);
    return response.data;
  },

  updateUserStats: async (userId: number, stats: Partial<UserStats>): Promise<UserStats> => {
    const response = await api.put(`/user-stats/${userId}/`, stats);
    return response.data;
  },

  // Overall Stats API
  getOverallStats: async (): Promise<OverallStats> => {
    const response = await api.get('/overall-stats/');
    return response.data;
  },

  getScoreDistribution: async (): Promise<{ score_range: string; count: number }[]> => {
    const response = await api.get('/overall-stats/distribution/');
    return response.data;
  },

  // Legacy Stats API (keeping for backward compatibility)
  getLegacyUserStats: async (): Promise<Stats[]> => {
    const response = await api.get('/stats/');
    return response.data;
  },

  createStats: async (stats: Partial<Stats>): Promise<Stats> => {
    const response = await api.post('/stats/', stats);
    return response.data;
  },

  updateStats: async (id: number, stats: Partial<Stats>): Promise<Stats> => {
    const response = await api.put(`/stats/${id}/`, stats);
    return response.data;
  },

  deleteStats: async (id: number): Promise<void> => {
    await api.delete(`/stats/${id}/`);
  },

  syncToFirestore: async (): Promise<any> => {
    const response = await api.post('/stats/sync_to_firestore/');
    return response.data;
  },

  // Firestore API
  getFirestoreOverallStats: async (): Promise<any[]> => {
    const response = await api.get('/firestore/stats/');
    return response.data;
  },

  getFirestoreUserStats: async (id: string): Promise<any> => {
    const response = await api.get(`/firestore/stats/${id}/`);
    return response.data;
  },

  updateFirestoreStats: async (id: string, data: any): Promise<any> => {
    const response = await api.put(`/firestore/stats/${id}/`, data);
    return response.data;
  },

  deleteFirestoreStats: async (id: string): Promise<any> => {
    const response = await api.delete(`/firestore/stats/${id}/`);
    return response.data;
  },

  syncFromFirestore: async (userId: number): Promise<any> => {
    const response = await api.post(`/firestore/sync/${userId}/`);
    return response.data;
  },
};

export default api;
