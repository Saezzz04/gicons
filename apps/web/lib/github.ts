import { Octokit } from '@octokit/rest';

const owner = process.env.GITHUB_OWNER ?? 'gicons';
const repo = process.env.GITHUB_REPO ?? 'gicons';

function getOctokit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN environment variable is required');
  return new Octokit({ auth: token });
}

export async function createBranchFromMain(branchName: string): Promise<string> {
  const octokit = getOctokit();

  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: 'heads/main',
  });

  const sha = ref.object.sha;

  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha,
  });

  return sha;
}

export async function commitFiles(
  branch: string,
  files: Array<{ path: string; content: string }>,
  message: string,
): Promise<string> {
  const octokit = getOctokit();

  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });

  const baseTreeSha = ref.object.sha;

  const blobs = await Promise.all(
    files.map(async (file) => {
      const { data } = await octokit.git.createBlob({
        owner,
        repo,
        content: Buffer.from(file.content).toString('base64'),
        encoding: 'base64',
      });
      return { path: file.path, sha: data.sha, mode: '100644' as const, type: 'blob' as const };
    }),
  );

  const { data: tree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: blobs,
  });

  const { data: commit } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: tree.sha,
    parents: [baseTreeSha],
  });

  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: commit.sha,
  });

  return commit.sha;
}

export async function createPR(
  branch: string,
  title: string,
  body: string,
): Promise<{ url: string; number: number }> {
  const octokit = getOctokit();

  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title,
    body,
    head: branch,
    base: 'main',
  });

  return { url: pr.html_url, number: pr.number };
}
