import os
import json
import requests
from datetime import datetime, timedelta

"""
Instagram Graph API Sync Tool for JRMGraphy
Populates `src/data/ig_metrics.json` to be consumed by the Obsidian Dashboard.

Setup:
1. Ensure your `.env` contains INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID
2. Run this script directly `python scripts/sync_ig_metrics.py` (or let a cron job do it).
"""

# Load minimal ENV without external libraries if possible, or use standard python logic 
# (assuming python-dotenv isn't guaranteed to be installed yet, though it's recommended).

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value.strip('"').strip("'")

load_env()

ACCESS_TOKEN = os.environ.get('INSTAGRAM_ACCESS_TOKEN')
ACCOUNT_ID = os.environ.get('INSTAGRAM_BUSINESS_ACCOUNT_ID')

BASE_URL = "https://graph.facebook.com/v19.0"

if not ACCESS_TOKEN or not ACCOUNT_ID:
    print("❌ Error: Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID in .env")
    exit(1)

def get_account_profile():
    """Fetch high level profile numbers (followers, posts)."""
    url = f"{BASE_URL}/{ACCOUNT_ID}"
    params = {
        'fields': 'id,username,profile_picture_url,followers_count,follows_count,media_count,biography',
        'access_token': ACCESS_TOKEN
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print("❌ Error fetching profile:", response.json())
        return None
    return response.json()

def get_account_insights():
    """Fetch account-level metric lifetime insights."""
    url = f"{BASE_URL}/{ACCOUNT_ID}/insights"
    params = {
        'metric': 'impressions,reach,profile_views',
        'period': 'day',
        'since': int((datetime.now() - timedelta(days=30)).timestamp()),
        'until': int(datetime.now().timestamp()),
        'access_token': ACCESS_TOKEN
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print("⚠️ Warning fetching insights (Requires proper tokens):", response.json())
        return None
    return response.json()

def get_recent_media():
    """Fetch recent posts and their engagement metrics."""
    url = f"{BASE_URL}/{ACCOUNT_ID}/media"
    params = {
        'fields': 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
        'limit': 15,
        'access_token': ACCESS_TOKEN
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print("❌ Error fetching media:", response.json())
        return []
    
    media_data = response.json().get('data', [])
    
    # Optional: We could do a secondary call here to get deep insights (saves/shares) per post
    # but likes and comments are included in the basic media node.
    return media_data

def main():
    print("🤖 Starting IG Metrics Sync...")
    
    profile = get_account_profile()
    if not profile:
        return
        
    print(f"✅ Authenticated as @{profile.get('username')}")
    print(f"📊 Followers: {profile.get('followers_count')} | Posts: {profile.get('media_count')}")

    insights = get_account_insights()
    recent_posts = get_recent_media()
    
    output_data = {
        "last_synced": datetime.now().isoformat(),
        "profile": profile,
        "insights_30d": insights.get('data', []) if insights else [],
        "recent_posts": recent_posts
    }
    
    # Save to src/data for the web app
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    out_file = os.path.join(data_dir, 'ig_metrics.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
        
    print(f"💾 Successfully saved metrics to {out_file}")
    
    # Additionally, let's output a markdown snippet directly to Obsidian
    obsidian_dashboard = "/Users/javierrangel/Library/CloudStorage/GoogleDrive-javaramu04@gmail.com/My Drive/ObsNote/04 - Photography/00 - Photography Dashboard.md"
    if os.path.exists(obsidian_dashboard):
        print("🔗 Ready to merge into Obsidian Dashboard once you configure the automation.")

if __name__ == "__main__":
    main()
