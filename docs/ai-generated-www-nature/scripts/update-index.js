#!/usr/bin/env node
import fs from 'fs';

const daysDir = '../days';
const days = fs.readdirSync(daysDir)
  .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
  .sort();

if (days.length === 0) {
  console.log('No days found yet');
  process.exit(0);
}

const latestDay = days[days.length - 1];
const latestScene = JSON.parse(fs.readFileSync(`${daysDir}/${latestDay}/scene.json`, 'utf8'));

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Day ${latestScene.metadata.dayNumber}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(to bottom, #0a0a0a, #1a1a2e);
      color: #fff;
      font-family: 'Courier New', monospace;
    }
    .header {
      text-align: center;
      padding: 40px 20px;
    }
    h1 {
      font-size: 3em;
      color: #6c6;
      text-shadow: 0 0 20px #6c6;
      margin: 0;
    }
    .subtitle {
      color: #aaa;
      margin-top: 10px;
    }
    .main-canvas-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    canvas {
      border: 3px solid #0f3460;
      background: #000;
      box-shadow: 0 0 30px rgba(108, 198, 108, 0.3);
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    .info-panel {
      max-width: 800px;
      margin: 0 auto 40px;
      padding: 20px;
      background: #16213e;
      border: 2px solid #0f3460;
      border-radius: 10px;
    }
    .stat {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #0f3460;
    }
    .stat:last-child {
      border-bottom: none;
    }
    .stat-label {
      color: #6c6;
    }
    .timeline {
      max-width: 820px;
      margin: 40px auto;
      padding: 20px;
    }
    .timeline-control {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 20px;
    }
    .timeline-control button {
      background: #16213e;
      color: #6c6;
      border: 2px solid #0f3460;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-family: 'Courier New', monospace;
    }
    .timeline-control button:hover {
      background: #0f3460;
    }
    .timeline-control input[type="range"] {
      flex: 1;
    }
    .day-list {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .day-link {
      display: block;
      background: #16213e;
      border: 2px solid #0f3460;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 5px;
      color: #6c6;
      text-decoration: none;
      transition: all 0.3s;
    }
    .day-link:hover {
      background: #0f3460;
      transform: translateX(5px);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Day ${latestScene.metadata.dayNumber}</h1>
  </div>
  
  <div class="main-canvas-container">
    <canvas id="nature" width="800" height="600"></canvas>
  </div>

  <div class="timeline">
    <h2 style="color: #6c6; text-align: center;">⏱️ Timeline</h2>
    <div class="timeline-control">
      <button id="first">⏮️ 最初</button>
      <button id="prev">⏪ 前</button>
      <button id="play">▶️ 再生</button>
      <input type="range" id="slider" min="1" max="${days.length}" value="${days.length}">
      <button id="next">⏩ 次</button>
      <button id="latest">⏭️ 最新</button>
      <span id="current-day">Day ${days.length}</span>
    </div>
  </div>
  
  <div class="day-list">
    <h2 style="color: #6c6; text-align: center;">📅 全ての日</h2>
    ${days.reverse().map(day => {
      const scene = JSON.parse(fs.readFileSync(`${daysDir}/${day}/scene.json`, 'utf8'));
      return `<a href="days/${day}/index.html" class="day-link">
        ${scene.metadata.season} Day ${scene.metadata.dayNumber} - ${day}
      </a>`;
    }).join('\n    ')}
  </div>
  
  <script src="shared/season-colors.js"></script>
  <script src="shared/nature-engine.js"></script>
  <script src="shared/timeline.js"></script>
  <script>
    const latestScene = ${JSON.stringify(latestScene)};
    const engine = new NatureEngine('nature', latestScene);
    engine.start();
    
    const timeline = new Timeline(engine, ${JSON.stringify(days.reverse())});
  </script>
</body>
</html>`;

fs.writeFileSync('../index.html', html);
console.log(`✅ Updated index.html with ${days.length} days`);
