import { Injectable, signal } from '@angular/core';

export interface RepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdated: string;
  defaultBranch: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  public repoStats = signal<RepoStats>({
    stars: 12,
    forks: 3,
    openIssues: 0,
    lastUpdated: 'Recently updated',
    defaultBranch: 'master'
  });

  constructor() {
    this.fetchRepoDetails();
  }

  private async fetchRepoDetails(): Promise<void> {
    try {
      const res = await fetch('https://api.github.com/repos/MrTBK/solar');
      if (res.ok) {
        const data = await res.json();
        this.repoStats.set({
          stars: data.stargazers_count ?? 12,
          forks: data.forks_count ?? 3,
          openIssues: data.open_issues_count ?? 0,
          lastUpdated: new Date(data.pushed_at).toLocaleDateString(),
          defaultBranch: data.default_branch || 'master'
        });
      }
    } catch {
      // Offline or rate-limited fallback remains active
    }
  }
}
