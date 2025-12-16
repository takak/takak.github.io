#!/usr/bin/env node
import fs from 'fs';

const date = process.argv[2];
if (!date) {
  console.error('Usage: node create-day-page.js YYYY-MM-DD');
  process.exit(1);
}

const sceneData = JSON.parse(fs.readFileSync(`../days/${date}/scene.json`, 'utf8'));
const seasonInfo = JSON.parse(fs.readFileSync('current-season.json', 'utf8'));

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Day ${sceneData.metadata.dayNumber}: ${seasonInfo.seasonEmoji} ${seasonInfo.season}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: linear-gradient(to bottom, #0a0a0a, #1a1a2e);
      color: #fff;
      font-family: 'Courier New', monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    h1 {
      color: #6c6;
      text-shadow: 0 0 10px #6c6;
    }
    .info {
      background: #16213e;
      border: 2px solid #0f3460;
      border-radius: 10px;
      padding: 15px 25px;
      margin-bottom: 20px;
      text-align: center;
    }
    canvas {
      border: 3px solid #0f3460;
      background: #000;
      box-shadow: 0 0 30px rgba(108, 198, 108, 0.3);
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    .nav {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
    .nav a {
      background: #16213e;
      color: #6c6;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      border: 2px solid #0f3460;
    }
    .nav a:hover {
      background: #0f3460;
    }
  </style>
</head>
<body>
  <div class="info">
    <div>${date} | ${seasonInfo.seasonEmoji} ${seasonInfo.season} (${seasonInfo.seasonPhase}) | Year ${sceneData.metadata.cycleYear}</div>
  </div>

  <canvas id="nature" width="800" height="600"></canvas>

  <div class="nav">
    <a href="../../index.html">← ホーム</a>
  </div>

  <script src="../../shared/season-colors.js"></script>
  <script src="../../shared/nature-engine.js"></script>
  <script>
    const sceneData = ${JSON.stringify(sceneData)};
    const engine = new NatureEngine('nature', sceneData);
    engine.start();
  </script>
</body>
</html>`;

fs.writeFileSync(`../days/${date}/index.html`, html);
console.log(`✅ Created page for ${date}`);
