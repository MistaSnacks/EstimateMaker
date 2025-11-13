import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Estimate, LineItem, Allocation, ScopeDetails } from '../types/estimate';
import { storage } from '../utils/storage';
import { calculateLineItemTotal } from '../utils/calculations';

interface EstimateContextType {
  estimate: Estimate | null;
  setEstimate: (estimate: Estimate) => void;
  updateEstimate: (updates: Partial<Estimate>) => void;
  addLineItem: (item: LineItem) => void;
  updateLineItem: (id: string, updates: Partial<LineItem>) => void;
  deleteLineItem: (id: string) => void;
  addAllocation: (allocation: Allocation) => void;
  updateAllocation: (id: string, updates: Partial<Allocation>) => void;
  deleteAllocation: (id: string) => void;
  updateScope: (scope: Partial<ScopeDetails>) => void;
  saveEstimate: () => Promise<void>;
  loadEstimate: (id: string) => Promise<void>;
  createNewEstimate: () => void;
}

const EstimateContext = createContext<EstimateContextType | undefined>(undefined);

export function EstimateProvider({ children }: { children: React.ReactNode }) {
  const [estimate, setEstimateState] = useState<Estimate | null>(null);

  const setEstimate = useCallback((newEstimate: Estimate) => {
    setEstimateState(newEstimate);
  }, []);

  const updateEstimate = useCallback((updates: Partial<Estimate>) => {
    if (estimate) {
      const updated = { ...estimate, ...updates, updatedAt: new Date().toISOString() };
      setEstimateState(updated);
    }
  }, [estimate]);

  const addLineItem = useCallback((item: LineItem) => {
    if (estimate) {
      const total = calculateLineItemTotal(item);
      const newItem = { ...item, total };
      updateEstimate({ lineItems: [...estimate.lineItems, newItem] });
    }
  }, [estimate, updateEstimate]);

  const updateLineItem = useCallback((id: string, updates: Partial<LineItem>) => {
    if (estimate) {
      const updatedItems = estimate.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          return { ...updated, total: calculateLineItemTotal(updated) };
        }
        return item;
      });
      updateEstimate({ lineItems: updatedItems });
    }
  }, [estimate, updateEstimate]);

  const deleteLineItem = useCallback((id: string) => {
    if (estimate) {
      const updatedItems = estimate.lineItems.filter(item => item.id !== id);
      const updatedAllocations = estimate.allocations.filter(alloc => alloc.lineItemId !== id);
      updateEstimate({ lineItems: updatedItems, allocations: updatedAllocations });
    }
  }, [estimate, updateEstimate]);

  const addAllocation = useCallback((allocation: Allocation) => {
    if (estimate) {
      updateEstimate({ allocations: [...estimate.allocations, allocation] });
    }
  }, [estimate, updateEstimate]);

  const updateAllocation = useCallback((id: string, updates: Partial<Allocation>) => {
    if (estimate) {
      const updatedAllocs = estimate.allocations.map(alloc =>
        alloc.id === id ? { ...alloc, ...updates } : alloc
      );
      updateEstimate({ allocations: updatedAllocs });
    }
  }, [estimate, updateEstimate]);

  const deleteAllocation = useCallback((id: string) => {
    if (estimate) {
      updateEstimate({ allocations: estimate.allocations.filter(alloc => alloc.id !== id) });
    }
  }, [estimate, updateEstimate]);

  const updateScope = useCallback((scope: Partial<ScopeDetails>) => {
    if (estimate) {
      updateEstimate({ scope: { ...estimate.scope, ...scope } });
    }
  }, [estimate, updateEstimate]);

  const saveEstimate = useCallback(async () => {
    if (estimate) {
      await storage.saveEstimate(estimate);
    }
  }, [estimate]);

  const loadEstimate = useCallback(async (id: string) => {
    const loaded = await storage.getEstimate(id);
    if (loaded) {
      setEstimateState(loaded);
    }
  }, []);

  const createNewEstimate = useCallback(() => {
    const newEstimate: Estimate = {
      id: `estimate_${Date.now()}`,
      projectName: '',
      address: '',
      client: '',
      bidDate: new Date().toISOString().split('T')[0],
      projectType: 'Multi-Family',
      buildings: 1,
      units: 1,
      lineItems: [],
      allocations: [],
      scope: {
        inclusions: [],
        exclusions: [],
        deliveryTerms: [],
        comments: '',
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEstimateState(newEstimate);
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (estimate) {
      const timer = setTimeout(() => {
        storage.saveEstimate(estimate);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [estimate]);

  return (
    <EstimateContext.Provider
      value={{
        estimate,
        setEstimate,
        updateEstimate,
        addLineItem,
        updateLineItem,
        deleteLineItem,
        addAllocation,
        updateAllocation,
        deleteAllocation,
        updateScope,
        saveEstimate,
        loadEstimate,
        createNewEstimate,
      }}
    >
      {children}
    </EstimateContext.Provider>
  );
}

export function useEstimate() {
  const context = useContext(EstimateContext);
  if (context === undefined) {
    throw new Error('useEstimate must be used within an EstimateProvider');
  }
  return context;
}
