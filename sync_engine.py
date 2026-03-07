import os, subprocess, json, datetime

FOLDERS = {
    "Grade_7": "1z0jsg8ZVa7rCeVLY1sms-W7C6whFuK8L",
    "Grade_8": "1ClTb8TrhvaQBIi43z7TKxOG1RuYWdywC",
    "Grade_9": "1uBFrJRqKJo8o6Rbgylqz0htxvthZ1dOn",
    "High_School": "1ev590-eH5ikT3VG7ZsfDocq-pfE1t1Sz",
    "Questions": "1RWUaqYgxE9nMm9kfHDF1CTHsPqD7lTHB",
    "Mekhavnim": "1rvMYdiQ65_ZAoi_U0AcHBrqw4FcdozhX"
}

def notify(msg):
    # שליחת התראה ישירות למכשיר האנדרואיד שלך
    subprocess.run(["termux-notification", "-t", "🚀 DigitalBook Sync", "-c", msg, "--priority", "high"])

def check_integrity():
    # שימוש ב-jq לוודא שה-JSON תקין
    res = subprocess.run(["jq", ".", "site/generated/chapters.json"], capture_output=True)
    return res.returncode == 0

def run_sync():
    print("🛰️ Sovereign Sync Started...")
    count_new = 0
    try:
        for label, folder_id in FOLDERS.items():
            target = f"site/pdf/{label}/"
            os.makedirs(target, exist_ok=True)
            subprocess.run(["gdown", "--folder", "--id", folder_id, "-O", target, "--remaining"])
        
        subprocess.run(["python", "extract_meta.py"])
        
        if check_integrity():
            subprocess.run(["git", "add", "."])
            subprocess.run(["git", "commit", "-m", "🌌 SOVEREIGN-AUTO: System integrity verified and synced"])
            subprocess.run(["git", "push", "origin", "main"])
            notify("הסנכרון הושלם בהצלחה! האתר מעודכן ב-GitHub.")
        else:
            notify("⚠️ שגיאת Integrity! קובץ המטא-דאטה פגום.")
            
    except Exception as e:
        notify(f"❌ קריסה בסנכרון: {str(e)}")

if __name__ == "__main__":
    run_sync()
