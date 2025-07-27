import { render } from '@testing-library/react';
import Providers from '@/providers/Providers';
import EventEmitter from 'events';
import { store } from '@/redux/store';
import { emptySplitApi } from '@/redux/api';
import { showSnackbar } from '@/redux/snackbarSlice';

// Create a fake socket that extends Node EventEmitter
class FakeSocket extends EventEmitter {
  disconnect = jest.fn();
}

const fakeSocket = new FakeSocket();

// Mock useSocket to return our fake socket immediately
jest.mock('@/hooks/useSocket', () => () => fakeSocket);

// Helper to reset spies between tests
const spyDispatch = jest.spyOn(store, 'dispatch');

beforeEach(() => {
  spyDispatch.mockClear();
});

describe('Providers – Socket invalidate handling', () => {
  it('invalidates RTK tags and shows snackbar', async () => {
    render(
      <Providers>
        <div>child</div>
      </Providers>
    );

    // Emit invalidate event
    const payload = { tags: ['Products'], message: 'updated' } as Parameters<typeof fakeSocket.emit>[1];
    fakeSocket.emit('invalidate', payload);

    await import('@testing-library/react').then(({ waitFor }) => waitFor(() => {
      expect(spyDispatch).toHaveBeenCalledWith(emptySplitApi.util.invalidateTags(payload.tags));
      expect(spyDispatch).toHaveBeenCalledWith(showSnackbar({ message: payload.message, severity: 'success' }));
    }));
  });

  it('handles multiple tag objects without message', async () => {
    render(
      <Providers>
        <div>child</div>
      </Providers>
    );

    const payload = {
      tags: [
        { type: 'AdminProduct', id: 'LIST' },
        { type: 'Theme', id: 'LIST' },
      ],
    } as Parameters<typeof fakeSocket.emit>[1];
    fakeSocket.emit('invalidate', payload);

    await import('@testing-library/react').then(({ waitFor }) => waitFor(() => {
      expect(spyDispatch).toHaveBeenCalledWith(emptySplitApi.util.invalidateTags(payload.tags));
      // should NOT show snackbar because no message
      expect(spyDispatch).not.toHaveBeenCalledWith(expect.objectContaining(showSnackbar({ message: '', severity: 'success' })));
    }));
  });
});
