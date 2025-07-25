import Modal from '../ui/modal';

const SHORTCUTS = [
  { keys: 'Ctrl + O', description: 'Open create task modal' },
  { keys: 'Ctrl + Z', description: 'Undo last action' },
  { keys: 'Ctrl + F', description: 'Focus search input' },
  { keys: 'Ctrl + A', description: 'Select all tasks' },
  { keys: 'Ctrl + K', description: 'Show this shortcuts modal' },
  { keys: 'Esc', description: 'Close modals/menus' },
];

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    className="max-w-md w-full p-6 bg-[var(--color-bg-paper)] rounded-lg shadow-lg"
  >
    <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">Keyboard Shortcuts</h2>
    <ul className="space-y-3">
      {SHORTCUTS.map((sc) => (
        <li
          key={sc.keys}
          className="flex items-center gap-4"
        >
          <span className="font-mono bg-[var(--color-bg-neutral)] px-2 py-1 rounded text-sm text-[var(--color-text-primary)] min-w-[90px] text-center">
            {sc.keys}
          </span>
          <span className="text-[var(--color-text-secondary)] text-sm">{sc.description}</span>
        </li>
      ))}
    </ul>
  </Modal>
);

export default ShortcutsModal;
