# AI Generated Nature Scene

This project generates a continuously growing nature scene using AI. Every day, a new scene is generated based on the previous day's state, with seasonal changes and long-term growth.

## Project Structure

- `days/YYYY-MM-DD/` - Each day's generated scene
  - `scene.json` - The scene data
  - `index.html` - The day's page
- `scripts/` - Generation scripts
  - `calculate-season.js` - Calculates current season info
  - `create-day-page.js` - Creates HTML page for a day
  - `update-index.js` - Updates the main index page
  - `initial-scene.json` - Initial scene data for Day 1
- `shared/` - Shared JavaScript libraries
- `index.html` - Main page with timeline

## Daily Generation Process

1. Calculate season info (season, phase, year, day)
2. Get previous day's scene (or initial scene for Day 1)
3. Generate new scene with Claude
4. Save scene.json and create day page
5. Update index.html
6. Commit changes

## Scene Generation Rules

When generating a new scene, output ONLY valid JSON with no markdown formatting or explanations.

### Resolution Settings
- **4px pixels, 200x150 grid**
- X coordinate: 0-200
- Y coordinate: 0-150
- Ground Y: 95

### JSON Structure

```json
{
  "metadata": {
    "resolution": "medium",
    "pixelSize": 4,
    "gridWidth": 200,
    "gridHeight": 150,
    "baseY": 95,
    "dayNumber": <total_day>,
    "cycleYear": <cycle_year>,
    "dayInCycle": <day_in_cycle>,
    "season": "<season_ja>",
    "seasonEn": "<season_en>"
  },
  "permanentElements": {
    "trees": [...],
    "rocks": [...],
    "shrubs": [...],
    "fallenTrees": [...],
    "grassPatches": [...],
    "fungiColonies": [...],
    "nests": [...]
  },
  "seasonalElements": {
    "leaves": [...],
    "grasses": [...],
    "flowers": [...],
    "mushrooms": [...],
    "animals": [...]
  },
  "ecosystem": {
    "maturityLevel": <0.0-1.0>,
    "biodiversityScore": <0.0-1.0>,
    "soilQuality": <0.0-1.0>,
    "moistureLevel": <0.0-1.0>,
    "canopyCover": <0.0-1.0>
  }
}
```

### Important Constraints

1. Avoid sudden changes (small daily changes only)
2. Coordinates must be within 0-200, 0-150
3. Avoid overlapping elements (3-5px spacing)
4. Output ONLY valid JSON (no markdown, no explanations)
5. Preserve permanent elements from previous scene
