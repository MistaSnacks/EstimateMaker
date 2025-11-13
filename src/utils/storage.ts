import type { Estimate } from '../types/estimate';

export interface StorageAdapter {
  saveEstimate(estimate: Estimate): Promise<void>;
  getEstimate(id: string): Promise<Estimate | null>;
  getAllEstimates(): Promise<Estimate[]>;
  deleteEstimate(id: string): Promise<void>;
}

class LocalStorageAdapter implements StorageAdapter {
  private readonly STORAGE_KEY = 'estimates';

  async saveEstimate(estimate: Estimate): Promise<void> {
    try {
      const allEstimates = await this.getAllEstimates();
      const index = allEstimates.findIndex(e => e.id === estimate.id);
      
      if (index >= 0) {
        allEstimates[index] = estimate;
      } else {
        allEstimates.push(estimate);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allEstimates));
    } catch (error) {
      console.error('Error saving estimate:', error);
      throw error;
    }
  }

  async getEstimate(id: string): Promise<Estimate | null> {
    try {
      const allEstimates = await this.getAllEstimates();
      return allEstimates.find(e => e.id === id) || null;
    } catch (error) {
      console.error('Error getting estimate:', error);
      return null;
    }
  }

  async getAllEstimates(): Promise<Estimate[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all estimates:', error);
      return [];
    }
  }

  async deleteEstimate(id: string): Promise<void> {
    try {
      const allEstimates = await this.getAllEstimates();
      const filtered = allEstimates.filter(e => e.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting estimate:', error);
      throw error;
    }
  }
}

export const storage = new LocalStorageAdapter();
