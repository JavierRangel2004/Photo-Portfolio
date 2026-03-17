import sys
import os

tax_path = r"C:\Users\javar\GITHUB\PhotoCat\docs\TAXONOMY_PORTFOLIO_ALIGNMENT_PLAN.md"
csv_plan_path = r"C:\Users\javar\GITHUB\PhotoCat\docs\CORRECTED_CSV_ORGANIZE_FLOW_PLAN.md"

with open(tax_path, 'r', encoding='utf-8') as f:
    tax_content = f.read()

tax_old = """### Mappings that need a second decision layer

These should not be blindly mapped:

| PhotoCat effective genre | Possible portfolio category | Why manual/secondary mapping is needed |
|---|---|---|
| `Branding & Portrait` | `portraits` or `creativity` | Some images are straight portraiture, others are more conceptual/editorial |
| `Street Documentary` | `city` or `creativity` | Some are urban documentary, others are more author-led or experimental |
| `Travel & Architecture` | `city` or `travel-cityscape` | Architecture-heavy city frames differ from scenic travel atmosphere |
| `Wedding Photography` | `portraits`, `creativity`, or exclude from portfolio export | Portfolio repo has no wedding category |
| `Other Photography` | `creativity`, `city`, `travel-cityscape`, or exclude | This bucket is too ambiguous for automatic export |

### Critical recommendation for wedding

Do not auto-map all `Wedding Photography` rows to a single portfolio category.

For portfolio export, wedding should be treated as a reviewed source genre that still needs one of:

- `portraits`
- `creativity`
- excluded from portfolio export

If needed later, a dedicated portfolio category can be added in the portfolio repo, but that is a business/product decision, not just a PhotoCat classifier decision."""

tax_new = """### Mappings that need a second decision layer (Risk of Oversaturation)

These should not be blindly mapped. Forcing these genres into portfolio categories creates noise and dilutes the quality of the final staging site:

| PhotoCat effective genre | Possible portfolio category | Why manual/secondary mapping is needed |
|---|---|---|
| `Branding & Portrait` | `portraits`, `creativity` or `exclude` | Some images are straight portraiture, others are more conceptual/editorial. **Do not force** generic branding into creativity. |
| `Street Documentary` | `city`, `creativity` or `exclude` | Some are urban documentary, others are more experimental. Avoid forcing noisy street scenes into `city` or `creativity`. |
| `Travel & Architecture` | `city`, `travel-cityscape` or `exclude` | Architecture-heavy city frames differ from scenic travel atmosphere. If neither fits perfectly, default to `exclude`. |
| `Wedding Photography` | `exclude` (default), `portraits`, or `creativity` | Portfolio repo has no wedding category. **Do not force** wedding shots into portraits unless they are exceptionally strong standalone portraits. |
| `Other Photography` | `exclude` (default) | This bucket is too ambiguous for automatic export. Defaulting to `exclude` prevents random images from saturating `creativity` or `city`. |

### Critical recommendation for Noise Reduction & Exclusion

To maintain the high visual standard of the Photo Portfolio, **exclusion must be a first-class mapping option, not an afterthought.**

1. **Default to Exclude for Missing Genres:** `Wedding Photography` and `Other Photography` should default to `exclude` from portfolio export. Do not auto-map them to `creativity` or `portraits`.
2. **Prevent Oversaturation in `creativity`:** The `creativity` category should be reserved for truly conceptual or author-led work. Do not use it as a dump for ambiguous `Branding & Portrait` or `Street Documentary` shots.
3. **If in doubt, leave it out:** The portfolio benefits more from a tight, coherent selection than from maximizing the total image count.

If needed later, a dedicated portfolio category can be added in the portfolio repo, but that is a business/product decision, not just a PhotoCat classifier decision."""

if tax_old in tax_content:
    tax_content = tax_content.replace(tax_old, tax_new)
    with open(tax_path, 'w', encoding='utf-8') as f:
        f.write(tax_content)
    print("Updated TAXONOMY_PORTFOLIO_ALIGNMENT_PLAN.md")
else:
    print("Could not find the target string in TAXONOMY_PORTFOLIO_ALIGNMENT_PLAN.md")

with open(csv_plan_path, 'r', encoding='utf-8') as f:
    csv_content = f.read()

csv_old_1 = """Recommendation:

- `effective_genre = user_genre if present else final_genre`
- `portfolio_group` derived from `portfolio_category`
- `dest_relpath = photos/<portfolio_category>/<filename>`"""

csv_new_1 = """Recommendation:

- `effective_genre = user_genre if present else final_genre`
- `portfolio_group` derived from `portfolio_category`
- `export_include = True if portfolio_category != 'exclude' else False`
- `dest_relpath = photos/<portfolio_category>/<filename>` (if `export_include` is true)
- (Optional) `dest_relpath = excluded/<effective_genre>/<filename>` (if `export_include` is false, to park files safely without losing them)"""

csv_old_2 = """### Phase G. Photo Portfolio-ready output

Final output root should match the portfolio repo contract:

- `/photos/portraits/...`
- `/photos/concert/...`
- `/photos/city/...`
- `/photos/nature/...`
- `/photos/product/...`
- `/photos/creativity/...`
- `/photos/travel-cityscape/...`

If the workflow also needs `photos.json` generation later, that should be a separate export stage, not mixed into raw organizing."""

csv_new_2 = """### Phase G. Photo Portfolio-ready output

Final output root should match the portfolio repo contract **exactly**. This means no forced or invented categories:

- `/photos/portraits/...`
- `/photos/concert/...`
- `/photos/city/...`
- `/photos/nature/...`
- `/photos/product/...`
- `/photos/creativity/...`
- `/photos/travel-cityscape/...`

**Crucially:** Add a path for skipped/excluded files so they do not pollute the final portfolio staging site but are kept for reference:
- `/excluded/<review_genre>/...` (or strictly omit them based on `export_include=False`).

If the workflow also needs `photos.json` generation later, that should be a separate export stage, not mixed into raw organizing."""

modified = False
if csv_old_1 in csv_content:
    csv_content = csv_content.replace(csv_old_1, csv_new_1)
    modified = True
else:
    print("Could not find old_1 in CORRECTED_CSV_ORGANIZE_FLOW_PLAN.md")

if csv_old_2 in csv_content:
    csv_content = csv_content.replace(csv_old_2, csv_new_2)
    modified = True
else:
    print("Could not find old_2 in CORRECTED_CSV_ORGANIZE_FLOW_PLAN.md")

if modified:
    with open(csv_plan_path, 'w', encoding='utf-8') as f:
        f.write(csv_content)
    print("Updated CORRECTED_CSV_ORGANIZE_FLOW_PLAN.md")
