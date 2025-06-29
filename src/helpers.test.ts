import '@testing-library/jest-dom';
import { throttle, debounce } from './helpers';

jest.useFakeTimers();

describe('throttle', () => {
  let mockFunction: jest.Mock;

  beforeEach(() => {
    mockFunction = jest.fn();
  });

  it('should call the function immediately on the first call', () => {
    const throttledFunction = throttle(mockFunction, 1000);

    throttledFunction();
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('should not call the function again within the throttle limit', () => {
    const throttledFunction = throttle(mockFunction, 1000);

    throttledFunction();
    throttledFunction();
    jest.advanceTimersByTime(500);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('should call the function again after the throttle limit', () => {
    const throttledFunction = throttle(mockFunction, 1000);

    throttledFunction();
    jest.advanceTimersByTime(1000);
    throttledFunction();

    expect(mockFunction).toHaveBeenCalledTimes(2);
  });

  it('should preserve the context and arguments when calling the function', () => {
    const context = { value: 42 };
    const throttledFunction = throttle(function (this: typeof context, arg: number) {
      expect(this.value).toBe(42);
      expect(arg).toBe(7);
    }, 1000);

    throttledFunction.call(context, 7);
  });
});

describe('debounce', () => {
  it('should delay the execution of the function', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 200);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should reset the timer if called again within the wait time', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 200);

    debouncedFn();
    jest.advanceTimersByTime(100);
    debouncedFn();
    jest.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should call the function immediately if immediate is true', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 200, true);

    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(200);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not call the function again if immediate is true and called within the wait time', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 200, true);

    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(200);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should preserve the context when calling the function', () => {
    const mockFn = jest.fn(function (this: { value: number }) {
      return this.value;
    });
    const context = { value: 42 };
    const debouncedFn = debounce(mockFn.bind(context), 200);

    debouncedFn();
    jest.advanceTimersByTime(200);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn.mock.instances[0]).toBe(context);
  });
});
