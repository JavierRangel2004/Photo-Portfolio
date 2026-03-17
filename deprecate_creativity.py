import os
import json

# 1. Update TAXONOMY_PORTFOLIO_ALIGNMENT_PLAN.md
tax_path = r"C:\Users\javar\GITHUB\PhotoCat\docs\TAXONOMY_PORTFOLIO_ALIGNMENT_PLAN.md"
with open(tax_path, "r", encoding="utf-8") as f:
    tax_content = f.read()

tax_replacements = [
    ("  - `creativity`\n", ""),
    ("  - `branding` -> `portraits`, `product`, `creativity`", "  - `branding` -> `portraits`, `product`"),
    ("- `creativity`: `45`\n", ""),
    ("| `Branding & Portrait` | `portraits`, `creativity` or `exclude` | Some images are straight portraiture, others are more conceptual/editorial. **Do not force** generic branding into creativity. |", 
     "| `Branding & Portrait` | `portraits` or `exclude` | Some images are straight portraiture, others are more conceptual/editorial. **Do not force** generic branding. |"),
    ("| `Street Documentary` | `city`, `creativity` or `exclude` | Some are urban documentary, others are more experimental. Avoid forcing noisy street scenes into `city` or `creativity`. |",
     "| `Street Documentary` | `city` or `exclude` | Some are urban documentary, others are more experimental. Avoid forcing noisy street scenes into `city`. |"),
    ("| `Wedding Photography` | `exclude` (default), `portraits`, or `creativity` | Portfolio repo has no wedding category. **Do not force** wedding shots into portraits unless they are exceptionally strong standalone portraits. |",
     "| `Wedding Photography` | `exclude` (default) or `portraits` | Portfolio repo has no wedding category. **Do not force** wedding shots into portraits unless they are exceptionally strong standalone portraits. |"),
    ("| `Other Photography` | `exclude` (default) | This bucket is too ambiguous for automatic export. Defaulting to `exclude` prevents random images from saturating `creativity` or `city`. |",
     "| `Other Photography` | `exclude` (default) | This bucket is too ambiguous for automatic export. Defaulting to `exclude` prevents random images from saturating portfolio categories. |"),
    ("1. **Default to Exclude for Missing Genres:** `Wedding Photography` and `Other Photography` should default to `exclude` from portfolio export. Do not auto-map them to `creativity` or `portraits`.",
     "1. **Default to Exclude for Missing Genres:** `Wedding Photography` and `Other Photography` should default to `exclude` from portfolio export. Do not auto-map them to `portraits`."),
    ("2. **Prevent Oversaturation in `creativity`:** The `creativity` category should be reserved for truly conceptual or author-led work. Do not use it as a dump for ambiguous `Branding & Portrait` or `Street Documentary` shots.",
     "2. **Strict Curation:** Do not use portfolio categories as a dump for ambiguous `Branding & Portrait` or `Street Documentary` shots.")
]

for old_s, new_s in tax_replacements:
    tax_content = tax_content.replace(old_s, new_s)

with open(tax_path, "w", encoding="utf-8") as f:
    f.write(tax_content)


# 2. Update CORRECTED_CSV_ORGANIZE_FLOW_PLAN.md
csv_plan_path = r"C:\Users\javar\GITHUB\PhotoCat\docs\CORRECTED_CSV_ORGANIZE_FLOW_PLAN.md"
with open(csv_plan_path, "r", encoding="utf-8") as f:
    csv_content = f.read()

csv_content = csv_content.replace("- `/photos/creativity/...`\n", "")

with open(csv_plan_path, "w", encoding="utf-8") as f:
    f.write(csv_content)


# 3. Update src/data/photos.json to remove creativity entries
photos_json_path = r"C:\Users\javar\GITHUB\Photo-Portfolio\src\data\photos.json"
with open(photos_json_path, "r", encoding="utf-8") as f:
    photos_data = json.load(f)

# Filter out creativity category
filtered_photos = [p for p in photos_data if p.get("category") != "creativity"]

with open(photos_json_path, "w", encoding="utf-8") as f:
    json.dump(filtered_photos, f, indent=2)

print("Finished deprecating 'creativity' in docs and JSON.")
