import { renderHook } from '@ver0/react-hooks-testing';
import { describe, expect, test, vi } from 'vitest';
import { useSetup } from './use-setup.hook';

describe('useSetup()', () => {
  test('only run once on render', async () => {
    const mock = vi.fn();

    const { rerender, unmount } = await renderHook(() => useSetup(mock));

    expect(mock).toHaveBeenCalledTimes(1);

    await rerender();

    expect(mock).toHaveBeenCalledTimes(1);

    await unmount();

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
