import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateAndDownload, type GenerateState } from '../generating';

const mockFetch = vi.fn();
(window as any).fetch = mockFetch;

const mockCreateObjectURL = vi.fn(() => 'mocked-url');
const mockRevokeObjectURL = vi.fn();

(window as any).URL.createObjectURL = mockCreateObjectURL;
(window as any).URL.revokeObjectURL = mockRevokeObjectURL;


// Mock document methods
const mockLink = {
  href: '',
  download: '',
  click: vi.fn(),
};

const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => mockLink),
});

Object.defineProperty(document.body, 'appendChild', {
  value: mockAppendChild,
});

Object.defineProperty(document.body, 'removeChild', {
  value: mockRemoveChild,
});



// Mock response
const mockBlob = new Blob(['test data'], { type: 'text/csv' });
const mockResponse = {
  ok: true,
  blob: vi.fn().mockResolvedValue(mockBlob),
};

// Mock store
let state: GenerateState = null;
const stateHistory: GenerateState[] = [];
const setState = (newState: GenerateState) => {
  stateHistory.push(newState);
  state = newState;
};


describe('CSV Генератор', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLink.href = '';
    mockLink.download = '';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('generateAndDownload скачивает файл', async () => {
    mockFetch.mockResolvedValue(mockResponse);

    await generateAndDownload(setState, 5, 'off', 500);

    expect(state).toBe('completed');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/report?size=5&withErrors=off&maxSpend=500'
    );
    expect(mockResponse.blob).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.href).toBe('mocked-url');
    expect(mockLink.download).toBe('report.csv');
    expect(mockLink.click).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
    expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mocked-url');
  });


  it('generateAndDownload устанавливает state в processing и completed', async () => {
    mockFetch.mockResolvedValue(mockResponse);

    await generateAndDownload(setState);

    expect(stateHistory[0]).toBe('processing');
    expect(stateHistory[stateHistory.length - 1]).toBe('completed');
  });

  it('при ошибке сети статус становится error, а файл не скачивается', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await generateAndDownload(setState);

    expect(state).toBe('error');
    expect(mockFetch).toHaveBeenCalled();
    expect(mockLink.click).not.toHaveBeenCalled();
  });

  it('при ошибке HTTP статус становится error, а файл не скачивается', async () => {
    const mockResponse = {
      ok: false,
    };

    mockFetch.mockResolvedValue(mockResponse);

    await generateAndDownload(setState);

    expect(state).toBe('error');
    expect(mockFetch).toHaveBeenCalled();
    expect(mockLink.click).not.toHaveBeenCalled();
  });
});
