const { execSync } = require("child_process");
const core = require("@actions/core");

(async () => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const actor = process.env.GITHUB_ACTOR?.toLowerCase() || "unknown";
    const eventName = process.env.GITHUB_EVENT_NAME;
    const eventPath = process.env.GITHUB_EVENT_PATH;
    const backupBranch = core.getInput("branch_name") || "Emergency-Theme";

    console.log("🛠️ Configuring Git user...");
    execSync(`git config user.name "github-actions[bot]"`);
    execSync(`git config user.email "github-actions[bot]@users.noreply.github.com"`);

    console.log("📦 Fetching all branches...");
    execSync("git fetch --all");

    console.log(`🔍 Checking if branch "${backupBranch}" exists...`);
    const existing = execSync(`git ls-remote --heads origin ${backupBranch}`).toString().trim();

    if (existing) {
      console.log("🟢 Updating existing Emergency Theme branch...");
      execSync(`git checkout ${backupBranch}`);
      execSync(`git pull origin ${backupBranch}`);
    } else {
      console.log("🟡 Creating Emergency Theme branch from main...");
      execSync(`git checkout -b ${backupBranch} origin/main`);
    }

    // Build commit message
    let commitMsg;
    if (eventName === "pull_request") {
      const event = require(eventPath);
      const prTitle = event?.pull_request?.title || "unknown PR";
      commitMsg = `${date} - ${actor} - ${prTitle}`;
    } else {
      commitMsg = `${date} - ${actor} - direct push`;
    }

    console.log("📝 Creating empty commit...");
    execSync(`git commit --allow-empty -m "${commitMsg}"`);
    execSync(`git push origin ${backupBranch}`);

    console.log(`✅ Backup completed successfully! Branch: ${backupBranch}`);
  } catch (error) {
    core.setFailed(`❌ Backup failed: ${error.message}`);
  }
})();
