import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ShortcutsModal from '../ShortcutsModal';

describe('ShortcutsModal', () => {
  it('renders shortcuts when open', () => {
    render(
      <ShortcutsModal
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /keyboard shortcuts/i })).toBeInTheDocument();

    // Check that all shortcut keys are rendered
    const keys = ['Ctrl + O', 'Ctrl + Z', 'Ctrl + F', 'Ctrl + A', 'Ctrl + K', 'Esc'];
    keys.forEach((key) => {
      expect(screen.getByText(key)).toBeInTheDocument();
    });

    // Check one of the descriptions is rendered
    expect(screen.getByText(/open create task modal/i)).toBeInTheDocument();
  });

  it('does not render modal content when closed', () => {
    render(
      <ShortcutsModal
        isOpen={false}
        onClose={vi.fn()}
      />
    );
    expect(screen.queryByRole('heading', { name: /keyboard shortcuts/i })).not.toBeInTheDocument();
  });

  it('calls onClose when clicking outside the modal content', async () => {
    const onClose = vi.fn();
    render(
      <ShortcutsModal
        isOpen={true}
        onClose={onClose}
      />
    );

    const backdropLayer = screen.getByTestId('modal-backdrop').parentElement!;

    // wait for active to become true after useEffect timeout
    await waitFor(() => {
      expect(backdropLayer).toHaveClass('backdrop-blur-sm'); // class that appears when active === true
    });

    fireEvent.mouseDown(backdropLayer);
    fireEvent.click(backdropLayer);

    expect(onClose).toHaveBeenCalled();
  });
});
