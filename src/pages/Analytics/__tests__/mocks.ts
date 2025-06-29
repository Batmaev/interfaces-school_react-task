import { vi } from 'vitest';
import type { ProcessingResult } from '../../History/historyStore';

export const mockProcessingResults: ProcessingResult[] = [{
  total_spend_galactic: 1000,
  rows_affected: 100,
  less_spent_at: 50,
  big_spent_at: 200,
  less_spent_value: 10,
  big_spent_value: 500,
  average_spend_galactic: 100,
  big_spent_civ: 'TestCiv1',
  less_spent_civ: 'TestCiv2',
}, {
  total_spend_galactic: 2000,
  rows_affected: 200,
  less_spent_at: 100,
  big_spent_at: 400,
  less_spent_value: 20,
  big_spent_value: 1000,
  average_spend_galactic: 200,
  big_spent_civ: 'TestCiv3',
  less_spent_civ: 'TestCiv4',
}]

export const mockMultipleResultsFetch = () => {
  const mockResponseData = JSON.stringify(mockProcessingResults[0]) + '\n' +
    JSON.stringify(mockProcessingResults[1]) + '\n';

  const mockReadableStream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(mockResponseData));
      controller.close();
    },
  });

  const mockResponse = {
    ok: true,
    body: mockReadableStream,
  };

  const mockFetch = vi.fn().mockResolvedValue(mockResponse);
  vi.stubGlobal('fetch', mockFetch);

  return mockFetch;
};

export const mockNetworkErrorFetch = () => {
  const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
  vi.stubGlobal('fetch', mockFetch);

  return mockFetch;
};

export const mockHttpErrorFetch = (status = 400, errorMessage = 'Bad Request') => {
  const mockResponse = {
    ok: false,
    status,
    json: vi.fn().mockResolvedValue({ error: errorMessage }),
  };

  const mockFetch = vi.fn().mockResolvedValue(mockResponse);
  vi.stubGlobal('fetch', mockFetch);

  return mockFetch;
}; 