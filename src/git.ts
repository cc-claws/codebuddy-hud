import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { GitStatus } from './types.js';

const execFileAsync = promisify(execFile);

export async function getGitStatus(
  cwd?: string,
  options?: { aheadBehind?: boolean },
): Promise<GitStatus | null> {
  if (!cwd) return null;

  try {
    const { stdout: branchOut } = await execFileAsync(
      'git', ['rev-parse', '--abbrev-ref', 'HEAD'],
      { cwd, timeout: 1000, encoding: 'utf8' },
    );
    const branch = branchOut.trim();
    if (!branch) return null;

    // Run status and aheadBehind in parallel for performance
    const [statusResult, aheadBehindResult] = await Promise.all([
      execFileAsync(
        'git', ['--no-optional-locks', 'status', '--porcelain'],
        { cwd, timeout: 1000, encoding: 'utf8' },
      ).then(({ stdout }) => stdout.trim().length > 0).catch(() => false),
      options?.aheadBehind
        ? execFileAsync(
            'git', ['rev-list', '--left-right', '--count', '@{upstream}...HEAD'],
            { cwd, timeout: 1000, encoding: 'utf8' },
          ).then(({ stdout }) => {
            const parts = stdout.trim().split(/\s+/);
            if (parts.length === 2) {
              return { behind: parseInt(parts[0], 10) || 0, ahead: parseInt(parts[1], 10) || 0 };
            }
            return { behind: 0, ahead: 0 };
          }).catch(() => ({ behind: 0, ahead: 0 }))
        : Promise.resolve({ behind: 0, ahead: 0 }),
    ]);

    return {
      branch,
      isDirty: statusResult,
      ahead: aheadBehindResult.ahead,
      behind: aheadBehindResult.behind,
    };
  } catch {
    return null;
  }
}
