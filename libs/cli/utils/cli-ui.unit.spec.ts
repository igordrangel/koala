import { describe, it, expect, vi } from 'vitest';
import { logHeader, logStep, logSuccess, logWarning, logError, logList } from './cli-ui';

describe('CLI UI Logging Functions', () => {
  describe('logHeader', () => {
    it('should call log with cyan title and separators', () => {
      const mockLog = vi.fn();
      logHeader(mockLog, 'Test Title');

      expect(mockLog).toHaveBeenCalledTimes(3);
      expect(mockLog.mock.calls[1][0]).toContain('Test Title');
    });

    it('should include subtitle when provided', () => {
      const mockLog = vi.fn();
      logHeader(mockLog, 'Test Title', 'Subtitle');

      expect(mockLog).toHaveBeenCalledTimes(4);
      expect(mockLog.mock.calls[2][0]).toContain('Subtitle');
    });

    it('should not include subtitle when not provided', () => {
      const mockLog = vi.fn();
      logHeader(mockLog, 'Test Title');

      expect(mockLog).toHaveBeenCalledTimes(3);
    });
  });

  describe('logStep', () => {
    it('should log message with [STEP] prefix', () => {
      const mockLog = vi.fn();
      logStep(mockLog, 'Installing components');

      expect(mockLog).toHaveBeenCalledOnce();
      expect(mockLog.mock.calls[0][0]).toContain('[STEP]');
      expect(mockLog.mock.calls[0][0]).toContain('Installing components');
    });
  });

  describe('logSuccess', () => {
    it('should log message with [OK] prefix', () => {
      const mockLog = vi.fn();
      logSuccess(mockLog, 'Installation completed');

      expect(mockLog).toHaveBeenCalledOnce();
      expect(mockLog.mock.calls[0][0]).toContain('[OK]');
      expect(mockLog.mock.calls[0][0]).toContain('Installation completed');
    });
  });

  describe('logWarning', () => {
    it('should log message with [WARN] prefix', () => {
      const mockLog = vi.fn();
      logWarning(mockLog, 'Some components already installed');

      expect(mockLog).toHaveBeenCalledOnce();
      expect(mockLog.mock.calls[0][0]).toContain('[WARN]');
      expect(mockLog.mock.calls[0][0]).toContain('Some components already installed');
    });
  });

  describe('logError', () => {
    it('should log message with [FAIL] prefix', () => {
      const mockLog = vi.fn();
      logError(mockLog, 'Installation failed');

      expect(mockLog).toHaveBeenCalledOnce();
      expect(mockLog.mock.calls[0][0]).toContain('[FAIL]');
      expect(mockLog.mock.calls[0][0]).toContain('Installation failed');
    });
  });

  describe('logList', () => {
    it('should log label with comma-separated values', () => {
      const mockLog = vi.fn();
      logList(mockLog, 'Components', ['button', 'input', 'select']);

      expect(mockLog).toHaveBeenCalledOnce();
      expect(mockLog.mock.calls[0][0]).toBe('Components: button, input, select');
    });

    it('should not call log when values array is empty', () => {
      const mockLog = vi.fn();
      logList(mockLog, 'Components', []);

      expect(mockLog).not.toHaveBeenCalled();
    });

    it('should handle single value', () => {
      const mockLog = vi.fn();
      logList(mockLog, 'Component', ['button']);

      expect(mockLog).toHaveBeenCalledOnce();
      expect(mockLog.mock.calls[0][0]).toBe('Component: button');
    });
  });
});
