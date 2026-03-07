import os, subprocess, json

FOLDERS = {
    "Grade_7": "1z0jsg8ZVa7rCeVLY1sms-W7C6whFuK8L",
    "Grade_8": "1ClTb8TrhvaQBIi43z7TKxOG1RuYWdywC",
    "Grade_9": "1uBFrJRqKJo8o6Rbgylqz0htxvthZ1dOn",
    "High_School": "1ev590-eH5ikT3VG7ZsfDocq-pfE1t1Sz",
    "Questions": "1RWUaqYgxE9nMm9kfHDF1CTHsPqD7lTHB",
    "Mekhavnim": "1rvMYdiQ65_ZAoi_U0AcHBrqw4FcdozhX"
}

def run_sync():
    print("🚀 Starting Global Drive Sync...")
    for label, folder_id in FOLDERS.items():
        print(f"📥 Syncing {label}...")
        target = f"site/pdf/{label}/"
        os.makedirs(target, exist_ok=True)
        # שימוש ב-gdown לשאיבה אגרסיבית
        subprocess.run(["gdown", "--folder", "--id", folder_id, "-O", target, "--remaining"])

    print("📊 Updating Metadata...")
    subprocess.run(["python", "extract_meta.py"])

    print("☁️ Pushing to GitHub...")
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", "⚡ ATOMIC SYNC: Automated folder synchronization"])
    subprocess.run(["git", "push", "origin", "main"])
    print("✅ System fully synchronized!")

if __name__ == "__main__":
    run_sync()
