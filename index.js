const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

// Extract the current version from _version.py
const getCurrentVersion = () => {
  const versionString = fs.readFileSync('_version.py', 'utf8');
  return versionString.split('"')[1];
};

// Calculate the new version based on the current version and the bump type
const getNewVersion = (current, bumpType) => {
  const parts = current.split('.');
  if (bumpType === 'major') {
    parts[0] = Number(parts[0]) + 1;
  } else if (bumpType === 'minor') {
    parts[1] = Number(parts[1]) + 1;
  } else {
    parts[2] = Number(parts[2]) + 1;
  }
  return parts.join('.');
};

// Update the version in _version.py
const updateVersionFile = (newVersion) => {
  fs.writeFileSync('_version.py', `__version__ = "${newVersion}"`);
};

(async () => {
  try {
    // Set working directory if user defined PACKAGEJSON_DIR
    if (process.env.PACKAGEJSON_DIR) {
      process.env.GITHUB_WORKSPACE = `${process.env.GITHUB_WORKSPACE}/${process.env.PACKAGEJSON_DIR}`;
      process.chdir(process.env.GITHUB_WORKSPACE);
    }

    const currentVersion = getCurrentVersion();
    // ... (Determine the bump type based on the commit messages)
    // Use the same logic from the original code to determine the bump type

    const newVersion = getNewVersion(currentVersion, bumpType);

    // Set git user
    await exec.exec('git', ['config', 'user.name', `"${process.env.GITHUB_USER || 'Automated Version Bump'}"`]);
    await exec.exec('git', ['config', 'user.email', `"${process.env.GITHUB_EMAIL || 'gh-action-bump-version@users.noreply.github.com'}"`]);

    // ... (Handle branch and pull request logic)
    // Use the same logic from the original code to handle branches and pull requests

    updateVersionFile(newVersion);

    await exec.exec('git', ['commit', '-a', '-m', `ci: version bump to ${newVersion}`]);

    // ... (Push changes and tags to the remote repository)
    // Use the same logic from the original code to push changes and tags to the remote repository

    core.setOutput('newTag', newVersion);
    core.info('Version bumped!');
  } catch (error) {
    core.setFailed(`Failed to bump version: ${error.message}`);
  }
})();
