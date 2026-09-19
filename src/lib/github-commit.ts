import "server-only";

/**
 * Commit one or more files to a GitHub repository via the Git Data API.
 *
 * Uses the low-level blobs → tree → commit → update-ref workflow so that
 * multiple files land in a single atomic commit (no partial states).
 *
 * Required env vars:
 *   GITHUB_TOKEN  — fine-grained PAT with Contents: Read and write
 *   GITHUB_REPO   — "owner/repo" (e.g. "rushanhaque/Velora")
 *   GITHUB_BRANCH — target branch, defaults to "main"
 */

const GITHUB_API = "https://api.github.com";

function env(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

function token(): string {
  const t = env("GITHUB_TOKEN");
  if (!t) throw new GitHubCommitError("GITHUB_TOKEN is not set.");
  return t;
}

function repo(): string {
  const r = env("GITHUB_REPO");
  if (!r) throw new GitHubCommitError("GITHUB_REPO is not set.");
  return r;
}

function branch(): string {
  return env("GITHUB_BRANCH", "main");
}

export class GitHubCommitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubCommitError";
  }
}

/** Whether GitHub committing is configured (all required env vars present). */
export function isGitHubConfigured(): boolean {
  return Boolean(env("GITHUB_TOKEN") && env("GITHUB_REPO"));
}

interface FileToCommit {
  /** Path relative to the repo root, e.g. "public/product-photos/abc123.webp" */
  path: string;
  /** File content — string for text, Buffer/Uint8Array for binary */
  content: string | Buffer | Uint8Array;
  /** If true, content is base64-encoded binary. Default: auto-detect from content type. */
  binary?: boolean;
}

async function ghFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Record<string, unknown>> {
  const url = endpoint.startsWith("http") ? endpoint : `${GITHUB_API}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new GitHubCommitError(
      `GitHub API ${res.status} on ${endpoint}: ${body.slice(0, 300)}`,
    );
  }

  return (await res.json()) as Record<string, unknown>;
}

/**
 * Commit one or more files to the repository in a single commit.
 *
 * Flow:
 *  1. Get the current commit SHA for the branch
 *  2. Get the tree SHA from that commit
 *  3. Create blobs for each file
 *  4. Create a new tree with the blobs
 *  5. Create a new commit pointing to that tree
 *  6. Update the branch ref to the new commit
 */
export async function commitFiles(
  files: FileToCommit[],
  message: string,
): Promise<{ commitSha: string; commitUrl: string }> {
  if (!files.length) throw new GitHubCommitError("No files to commit.");

  const r = repo();
  const b = branch();

  // 1. Get current branch HEAD
  const refData = await ghFetch(`/repos/${r}/git/ref/heads/${b}`);
  const headSha = ((refData.object as Record<string, unknown>)?.sha as string) ?? "";
  if (!headSha) throw new GitHubCommitError("Could not resolve branch HEAD.");

  // 2. Get the tree from HEAD commit
  const commitData = await ghFetch(`/repos/${r}/git/commits/${headSha}`);
  const baseTreeSha = ((commitData.tree as Record<string, unknown>)?.sha as string) ?? "";

  // 3. Create blobs for each file
  const treeItems: Array<{
    path: string;
    mode: string;
    type: string;
    sha: string;
  }> = [];

  for (const file of files) {
    const isBinary =
      file.binary ?? (file.content instanceof Buffer || file.content instanceof Uint8Array);

    let contentStr: string;
    let encoding: string;

    if (isBinary) {
      const buf =
        file.content instanceof Buffer
          ? file.content
          : Buffer.from(
              file.content instanceof Uint8Array ? file.content : (file.content as string),
            );
      contentStr = buf.toString("base64");
      encoding = "base64";
    } else {
      contentStr = file.content as string;
      encoding = "utf-8";
    }

    const blobData = await ghFetch(`/repos/${r}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: contentStr, encoding }),
    });

    treeItems.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blobData.sha as string,
    });
  }

  // 4. Create new tree
  const treeData = await ghFetch(`/repos/${r}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
  });
  const newTreeSha = treeData.sha as string;

  // 5. Create commit
  const newCommitData = await ghFetch(`/repos/${r}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: newTreeSha,
      parents: [headSha],
    }),
  });
  const newCommitSha = newCommitData.sha as string;

  // 6. Update branch ref
  await ghFetch(`/repos/${r}/git/refs/heads/${b}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommitSha }),
  });

  return {
    commitSha: newCommitSha,
    commitUrl: `https://github.com/${r}/commit/${newCommitSha}`,
  };
}

/**
 * Read a file from the repo via the GitHub Contents API.
 * Returns the decoded content as a string, or null if the file doesn't exist.
 */
export async function readFileFromGitHub(filePath: string): Promise<string | null> {
  const r = repo();
  const b = branch();

  try {
    const data = await ghFetch(
      `/repos/${r}/contents/${encodeURIComponent(filePath)}?ref=${b}`,
    );
    const content = data.content as string | undefined;
    if (!content) return null;
    // GitHub returns base64-encoded content
    return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf-8");
  } catch {
    return null;
  }
}
