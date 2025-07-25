import { create } from 'zustand';
import { Task } from '@/types/index';

export type UndoAction =
  | { type: 'delete'; task: Task }
  | { type: 'create'; task: Task }
  | { type: 'toggle'; task: Task; prevStatus: Task['status'] };

interface UndoRedoState {
  undoStack: UndoAction[];
  redoStack: UndoAction[];
  pushAction: (action: UndoAction) => void;
  undo: () => UndoAction | undefined;
  redo: () => UndoAction | undefined;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}

export const useUndoRedo = create<UndoRedoState>((set, get) => ({
  undoStack: [],
  redoStack: [],
  pushAction: (action) =>
    set((state) => ({ undoStack: [...state.undoStack, action].slice(-50), redoStack: [] })),
  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return undefined;
    const action = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, action].slice(-50),
    });
    return action;
  },
  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return undefined;
    const action = redoStack[redoStack.length - 1];
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, action].slice(-50),
    });
    return action;
  },
  canUndo: false,
  canRedo: false,
  clear: () => set({ undoStack: [], redoStack: [] }),
}));

// Keep canUndo/canRedo in sync
useUndoRedo.subscribe((state) => {
  state.canUndo = state.undoStack.length > 0;
  state.canRedo = state.redoStack.length > 0;
});
