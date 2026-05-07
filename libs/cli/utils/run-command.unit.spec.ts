import { describe, it, expect, vi, beforeEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import { runCommand } from './run-command';

vi.mock('node:child_process');

describe('runCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute command successfully', () => {
    const mockResult = { status: 0, error: null, encoding: 'utf-8' };
    vi.mocked(spawnSync).mockReturnValue(mockResult as any);

    const result = runCommand('npm install');

    const calls = vi.mocked(spawnSync).mock.calls;
    expect(calls[0][0]).toBe('npm install');
    expect(calls[0][1]).toHaveProperty('encoding', 'utf-8');
    expect(calls[0][1]).toHaveProperty('shell', true);
    expect(result.status).toBe(0);
  });

  it('should throw error when command fails with non-zero exit code', () => {
    const mockResult = { status: 1, error: null };
    vi.mocked(spawnSync).mockReturnValue(mockResult as any);

    expect(() => runCommand('npm install')).toThrow(
      'Command failed with exit code 1: npm install',
    );
  });

  it('should throw error when spawnSync produces an error', () => {
    const mockError = new Error('ENOENT: command not found');
    const mockResult = { status: null, error: mockError };
    vi.mocked(spawnSync).mockReturnValue(mockResult as any);

    expect(() => runCommand('invalid-command')).toThrow(mockError);
  });

  it('should pass custom options to spawnSync', () => {
    const mockResult = { status: 0, error: null };
    vi.mocked(spawnSync).mockReturnValue(mockResult as any);

    const customOptions = { cwd: '/home/user' };
    runCommand('npm install', customOptions);

    const calls = vi.mocked(spawnSync).mock.calls;
    expect(calls[0][1]).toHaveProperty('cwd', '/home/user');
    expect(calls[0][1]).toHaveProperty('encoding', 'utf-8');
    expect(calls[0][1]).toHaveProperty('shell', true);
  });
});
