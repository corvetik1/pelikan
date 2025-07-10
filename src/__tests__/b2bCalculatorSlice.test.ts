import reducer, { setQuoteId, setQuoteStatus, resetCalculator, addItem } from '@/redux/b2bCalculatorSlice';
import type { B2BCalculatorState } from '@/redux/b2bCalculatorSlice';

describe('b2bCalculatorSlice', () => {
  const initial: B2BCalculatorState = {
    productId: '',
    quantity: 0,
    prices: {},
    items: [],
    quoteId: undefined,
    quoteStatus: undefined,
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initial);
  });

  it('should set quoteId', () => {
    const next = reducer(initial, setQuoteId('q123'));
    expect(next.quoteId).toBe('q123');
  });

  it('should set quoteStatus', () => {
    const next = reducer(initial, setQuoteStatus('pending'));
    expect(next.quoteStatus).toBe('pending');
  });

  it('should reset state', () => {
    const modified = reducer(initial, addItem({ id: 'p1', quantity: 2 }));
    const reset = reducer(modified, resetCalculator());
    expect(reset).toEqual(initial);
  });
});
