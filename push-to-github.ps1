param(
  [string]$RemoteName = "origin",
  [string]$RepoSsh = "git@github.com:joshua31324324/eaikw.git",
  [switch]$Force,
  [switch]$Verify
)

# Ensure git is available
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCmd) {
  # Try typical Windows installation path
  $gitPath = 'C:\Program Files\Git\cmd\git.exe'
  if (Test-Path $gitPath) {
    $gitCmd = $gitPath
  } else {
    Write-Error "git is not installed or not in PATH. Please install from https://git-scm.com/download/win"
    exit 1
  }
} else {
  $gitCmd = 'git'
}

# Ensure we're in a git repo
$inside = & $gitCmd rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Error "Not inside a git repository. Run this from the repository root."
  exit 1
}

# Determine current branch
$branch = & $gitCmd rev-parse --abbrev-ref HEAD

# Check existing remote
$existing = $null
try { $existing = & $gitCmd remote get-url $RemoteName 2>$null } catch { $existing = $null }

if (-not $existing) {
  & $gitCmd remote add $RemoteName $RepoSsh
  Write-Output "Added remote $RemoteName -> $RepoSsh"
} elseif ($existing -ne $RepoSsh) {
  if ($Force) {
    & $gitCmd remote set-url $RemoteName $RepoSsh
    Write-Output "Updated remote $RemoteName -> $RepoSsh"
  } else {
    Write-Warning "Remote '$RemoteName' exists with URL '$existing'. Use -Force to overwrite or remove the remote manually."
    exit 1
  }
} else {
  Write-Output "Remote $RemoteName already set to $RepoSsh"
}

if ($Verify) {
  Write-Output "Running verification checks..."

  # Check ssh-agent keys
  $sshAdd = & ssh-add -l 2>&1
  if ($LASTEXITCODE -ne 0 -or $sshAdd -match "The agent has no identities") {
    Write-Warning "No SSH keys loaded in ssh-agent. Use 'ssh-add <key>' to add your private key."
  } else {
    Write-Output "ssh-agent keys:"
    $sshAdd
  }

  # Test SSH connection to GitHub
  Write-Output "Testing SSH auth to github.com (no push will be performed)..."
  $sshTest = & ssh -o BatchMode=yes -T git@github.com 2>&1
  if ($sshTest -match "successfully authenticated") {
    Write-Output "SSH authentication to GitHub appears successful."
  } else {
    Write-Warning "SSH test did not confirm authentication. Output:"
    $sshTest
  }

  # Verify remote URL
  if ($existing) {
    Write-Output "Remote '$RemoteName' => $existing"
    if ($existing -ne $RepoSsh) {
      Write-Warning "Remote URL differs from expected $RepoSsh. Use -Force to set it."
    }
  } else {
    Write-Warning "No remote named '$RemoteName' exists locally. The script would add $RepoSsh."
  }

  # Dry-run push (will attempt to connect but will not update remote refs)
  Write-Output "Performing a dry-run push to verify remote reachability (no refs will change)..."
  if ($existing) {
    & $gitCmd push --dry-run $RemoteName $branch 2>&1 | Tee-Object -Variable dryOut
  } else {
    & $gitCmd push --dry-run $RepoSsh $branch 2>&1 | Tee-Object -Variable dryOut
  }
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Dry-run push reported issues or failed. Output:"
    $dryOut
    Write-Output "Verification completed with warnings. Fix issues and re-run with -Verify."
    exit 1
  }

  Write-Output "Verification completed successfully. You should be able to push from this machine once keys and remote are configured."
  exit 0
}

# Warn about uncommitted changes
$status = & $gitCmd status --porcelain
if ($status) {
  Write-Warning "You have uncommitted changes. Commit or stash them before pushing."
  & $gitCmd status --short
  exit 1
}

# Push current branch
& $gitCmd push -u $RemoteName $branch
if ($LASTEXITCODE -ne 0) {
  Write-Error "Push failed with exit code $LASTEXITCODE."
  exit $LASTEXITCODE
} else {
  Write-Output "Push successful: $branch -> $RemoteName"
}
