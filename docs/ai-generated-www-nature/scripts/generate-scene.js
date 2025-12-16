#!/usr/bin/env node
import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function generateScene() {
  const previousScene = JSON.parse(fs.readFileSync('../previous-scene.json', 'utf8'));
  const seasonInfo = JSON.parse(fs.readFileSync('current-season.json', 'utf8'));
  
  const totalDay = parseInt(process.env.TOTAL_DAY);
  const cycleYear = parseInt(process.env.CYCLE_YEAR);
  const dayInCycle = parseInt(process.env.DAY_IN_CYCLE);
  const season = process.env.SEASON;
  const seasonEn = process.env.SEASON_EN;
  const seasonPhase = process.env.SEASON_PHASE;
  const isNewYear = process.env.IS_NEW_YEAR === 'true';
  const currentMonth = parseInt(process.env.CURRENT_MONTH);
  
  const prompt = `あなたは「永続的に成長する自然」を生成するAIです。

## 解像度設定
- **4pxピクセル、200×150グリッド**の高精細ドット絵
- X座標: 0-200
- Y座標: 0-150  
- 地面のY座標: 95

## 現在の状態
- **Total Day**: ${totalDay}
- **Cycle Year**: ${cycleYear}
- **Day in Cycle**: ${dayInCycle}
- **Season**: ${season} (${seasonEn})
- **Phase**: ${seasonPhase}
- **Month**: ${currentMonth}月
- **Is New Year**: ${isNewYear}

## 前日のシーン
\`\`\`json
${JSON.stringify(previousScene, null, 2)}
\`\`\`

## タスク: 1日分の成長を生成

### 1. 長期的成長（年単位）

${isNewYear ? `
**🎊 新年の処理 (Year ${cycleYear} 開始)**

#### 既存の木の成長
- すべての木の幹と葉が1年分成長
- 計算式: 
  - actualHeight = baseTrunkHeight + (trunkGrowthRate × (${cycleYear} - yearPlanted))
  - actualLeafRadius = baseLeafRadius + (leafRadiusGrowthRate × (${cycleYear} - yearPlanted))

#### 新しい要素の追加
- **新しい苗木**: Year ${cycleYear >= 2 ? '2-3年に1本' : '稀に1本'}
- **低木**: Year ${cycleYear >= 3 ? '追加可能' : '未出現'}
- **鳥の巣**: Year ${cycleYear >= 4 ? '高い木に追加可能' : '未出現'}
- **キノコ**: Year ${cycleYear >= 4 ? 'コロニー拡大' : '未出現'}
- **倒木**: Year ${cycleYear >= 8 ? '古い木が稀に倒れる可能性' : '未出現'}

#### 苔・土壌の成長
- 岩の苔: +0.1 (最大1.0)
- 古い木(樹齢5年以上)に苔が生える
- 土壌の肥沃度: +0.05
` : `
**通常の日（季節変化のみ）**
- 長期的成長要素は変更しない
- 季節に応じた変化のみ適用
`}

### 2. 季節サイクル（365日）

#### 冬 (12月〜2月) の変化
- 葉: ほぼ無し (radius × 0.1, density 0.1)
- 草: 短く枯れ色 (height × 0.3-0.5)
- 花: 無し
- キノコ: 無し
- 動物: 鳥のみ（少数）

#### 春 (3月〜5月) の変化
${season === '春' ? `
- **現在は春です！**
- 序盤(3月): 新芽が出る、草が伸び始める
- 中盤(4月): 花が咲き始める、木の葉が増える
- 終盤(5月): 満開、草が茂る
- 葉: radius × 0.7-1.0, 薄緑 → 緑
- 草: height × 0.6-1.0, 1-2本/日追加
- 花: 2-3輪/日追加
- 蝶: 出現
` : ''}

#### 夏 (6月〜8月) の変化
${season === '夏' ? `
- **現在は夏です！**
- 最も成長が活発
- 葉: フルサイズ (radius × 1.0)、濃い緑
- 草: 最大の高さ
- 花: 満開
- 動物: 鳥・蝶が最も活発
` : ''}

#### 秋 (9月〜11月) の変化
${season === '秋' ? `
- **現在は秋です！**
- 序盤(9月): 色づき始める
- 中盤(10月): 紅葉ピーク、キノコ出現
- 終盤(11月): 落葉、花が枯れる
- 葉: radius × 0.8-0.5, 黄色 → 赤
- 草: height × 0.8-0.6
- 花: 徐々に減る
- キノコ: 出現（Year 4以降）
` : ''}

## データ構造（必須）

\`\`\`json
{
  "metadata": {
    "resolution": "medium",
    "pixelSize": 4,
    "gridWidth": 200,
    "gridHeight": 150,
    "baseY": 95,
    "dayNumber": ${totalDay},
    "cycleYear": ${cycleYear},
    "dayInCycle": ${dayInCycle},
    "season": "${season}",
    "seasonEn": "${seasonEn}"
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
    "maturityLevel": ...,
    "biodiversityScore": ...,
    "soilQuality": ...,
    "moistureLevel": ...,
    "canopyCover": ...
  }
}
\`\`\`

## 重要な制約
1. 急激な変化を避ける（1日あたりの変化は小さく）
2. 座標は0-200, 0-150の範囲内
3. 要素の重なりを避ける（3-5px spacing）
4. JSONのみ出力（マークダウン記法や説明文は不要）
5. 出力は valid JSON のみ

**出力してください:**`;

  console.log('🤖 Calling Claude API...');
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });
  
  let responseText = message.content[0].text;
  
  // JSONの抽出
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  const newScene = JSON.parse(responseText);
  
  fs.writeFileSync('../generated-scene.json', JSON.stringify(newScene, null, 2));
  
  console.log('✅ Scene generated successfully!');
  console.log(`📊 Trees: ${newScene.permanentElements.trees.length}`);
  console.log(`🪨 Rocks: ${newScene.permanentElements.rocks.length}`);
  console.log(`🌿 Grasses: ${newScene.seasonalElements.grasses.length}`);
  console.log(`🌸 Flowers: ${newScene.seasonalElements.flowers.length}`);
}

generateScene().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
