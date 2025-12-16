// Nature Engine - 中解像度（4px）対応描画エンジン

class NatureEngine {
  constructor(canvasId, sceneData) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.scene = sceneData;
    this.time = 0;
    
    this.PIXEL_SIZE = sceneData.metadata.pixelSize;
    this.GRID_W = sceneData.metadata.gridWidth;
    this.GRID_H = sceneData.metadata.gridHeight;
    this.BASE_Y = sceneData.metadata.baseY;
    
    this.loadPalettes();
  }
  
  loadPalettes() {
    this.palettes = window.SEASON_PALETTES[this.scene.metadata.seasonEn.toLowerCase()] || window.SEASON_PALETTES.spring;
  }
  
  drawPixel(x, y, color, glow = 0) {
    if (x < 0 || x >= this.GRID_W || y < 0 || y >= this.GRID_H) return;
    
    if (glow > 0) {
      this.ctx.shadowBlur = glow;
      this.ctx.shadowColor = color;
    }
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, this.PIXEL_SIZE, this.PIXEL_SIZE);
    if (glow > 0) {
      this.ctx.shadowBlur = 0;
    }
  }
  
  drawBackground() {
    // 空
    const skyHeight = 60;
    for (let y = 0; y < skyHeight; y++) {
      const progress = y / skyHeight;
      const colorIdx = Math.floor(progress * (this.palettes.sky.length - 1));
      const color = this.palettes.sky[colorIdx];
      for (let x = 0; x < this.GRID_W; x++) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, this.PIXEL_SIZE, this.PIXEL_SIZE);
      }
    }
    
    // 地面
    const groundColors = this.getGroundColors();
    for (let y = this.BASE_Y; y < this.GRID_H; y++) {
      for (let x = 0; x < this.GRID_W; x++) {
        const seed = x * 1000 + y;
        const noise = (seed * 9301 + 49297) % 233280 % groundColors.length;
        this.ctx.fillStyle = groundColors[noise];
        this.ctx.fillRect(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, this.PIXEL_SIZE, this.PIXEL_SIZE);
      }
    }
  }
  
  getGroundColors() {
    const fertility = this.scene.ecosystem.soilQuality;
    if (fertility > 0.7) return this.palettes.ground.rich;
    if (fertility > 0.4) return this.palettes.ground.medium;
    return this.palettes.ground.poor;
  }
  
  drawRock(rock) {
    const { x, y, size, mossGrowth, lichenGrowth } = rock;
    
    // 岩本体
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const distance = Math.sqrt(
          Math.pow(dx - size/2, 2) + Math.pow(dy - size/2, 2)
        );
        
        if (distance < size/2) {
          const seed = dx * 100 + dy;
          const colorIdx = (seed * 9301) % this.palettes.rock.length;
          const isTop = dy < size * 0.3;
          let color = this.palettes.rock[colorIdx];
          if (isTop) {
            color = this.palettes.rock[Math.min(colorIdx + 1, this.palettes.rock.length - 1)];
          }
          this.drawPixel(x + dx, y - dy, color);
        }
      }
    }
    
    // 苔
    if (mossGrowth > 0) {
      const mossPoints = Math.floor(size * size * mossGrowth * 0.5);
      for (let i = 0; i < mossPoints; i++) {
        const dx = Math.floor(Math.random() * size);
        const dy = Math.floor(Math.random() * size);
        const distance = Math.sqrt(Math.pow(dx - size/2, 2) + Math.pow(dy - size/2, 2));
        if (distance < size/2 && Math.random() < 0.7) {
          const mossColor = this.palettes.moss[Math.floor(Math.random() * this.palettes.moss.length)];
          this.drawPixel(x + dx, y - dy, mossColor);
        }
      }
    }
    
    // 地衣類
    if (lichenGrowth > 0) {
      const lichenPoints = Math.floor(lichenGrowth * 5);
      for (let i = 0; i < lichenPoints; i++) {
        const dx = Math.floor(Math.random() * size);
        const dy = Math.floor(Math.random() * size);
        if (Math.random() < lichenGrowth) {
          this.drawPixel(x + dx, y - dy, this.palettes.lichen[0]);
        }
      }
    }
  }
  
  drawTree(tree) {
    const { x, baseTrunkHeight, baseTrunkWidth, trunkGrowthRate, yearPlanted } = tree;
    const cycleYear = this.scene.metadata.cycleYear;
    
    const actualHeight = baseTrunkHeight + (trunkGrowthRate * (cycleYear - yearPlanted));
    const width = baseTrunkWidth || 2;
    
    const sway = Math.sin(this.time * 0.001) * 0.5;
    
    // 幹
    for (let h = 0; h < actualHeight; h++) {
      const trunkSway = Math.floor(sway * (h / actualHeight));
      const heightRatio = h / actualHeight;
      
      for (let w = 0; w < width; w++) {
        const seed = h * 100 + w;
        const baseColorIdx = Math.floor((seed * 9301 + heightRatio * 1000) % this.palettes.trunk.length);
        
        let color = this.palettes.trunk[baseColorIdx];
        if (w === 0 && width > 1) {
          color = this.palettes.trunkShadow;
        } else if (w === width - 1 && width > 1) {
          color = this.palettes.trunkHighlight;
        }
        
        this.drawPixel(x + w + trunkSway, this.BASE_Y - h, color);
      }
      
      // 苔（古い木）
      if (tree.hasMoss && h < actualHeight * 0.3 && Math.random() < 0.3) {
        this.drawPixel(x + trunkSway, this.BASE_Y - h, this.palettes.moss[0]);
      }
    }
    
    // 葉（季節要素から取得）
    const leafData = this.scene.seasonalElements.leaves.find(l => l.treeId === tree.id);
    if (leafData && leafData.seasonalRadius > 0) {
      this.drawLeaves(x + Math.floor(width/2), this.BASE_Y - actualHeight, leafData, sway);
    }
  }
  
  drawLeaves(x, y, leafData, sway) {
    const { seasonalRadius, color, density } = leafData;
    const leafSway = Math.floor(sway);
    
    for (let dy = -seasonalRadius; dy <= seasonalRadius; dy++) {
      for (let dx = -seasonalRadius; dx <= seasonalRadius; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const irregularity = Math.sin(dx * 0.5) * Math.cos(dy * 0.5) * 0.3;
        const adjustedRadius = seasonalRadius + irregularity;
        
        if (distance <= adjustedRadius) {
          const isOuter = distance > adjustedRadius * 0.7;
          const seed = (dx + 100) * 1000 + (dy + 100);
          const rand = (seed * 9301 + 49297) % 233280 / 233280;
          
          if (rand < density && (!isOuter || rand > 0.3)) {
            const leafWobble = Math.floor(Math.sin(this.time * 0.002 + dx + dy) * 0.5);
            this.drawPixel(x + dx + leafSway + leafWobble, y + dy, color);
          }
        }
      }
    }
  }
  
  drawShrub(shrub) {
    const { x, baseHeight, baseWidth, heightGrowthRate, widthGrowthRate, yearPlanted } = shrub;
    const cycleYear = this.scene.metadata.cycleYear;
    
    const actualHeight = baseHeight + (heightGrowthRate * (cycleYear - yearPlanted));
    const actualWidth = baseWidth + (widthGrowthRate * (cycleYear - yearPlanted));
    
    const sway = Math.sin(this.time * 0.002 + x) * 0.3;
    
    for (let h = 0; h < actualHeight; h++) {
      for (let w = 0; w < actualWidth; w++) {
        const currentSway = Math.floor(sway * (h / actualHeight));
        const colorIdx = Math.floor((h / actualHeight) * (this.palettes.shrub.length - 1));
        const color = this.palettes.shrub[colorIdx];
        this.drawPixel(x + w + currentSway, this.BASE_Y - h, color);
      }
    }
  }
  
  drawFallenTree(fallen) {
    const { x, length, decompositionStage } = fallen;
    const y = this.BASE_Y - 1;
    
    for (let i = 0; i < length; i++) {
      if (Math.random() > decompositionStage * 0.2) {
        const colorIdx = i % this.palettes.fallenTree.length;
        this.drawPixel(x + i, y, this.palettes.fallenTree[colorIdx]);
      }
    }
  }
  
  drawGrass(grass) {
    const { x, height, color } = grass;
    const sway = Math.sin(this.time * 0.003 + x * 0.5) * 0.8;
    
    for (let h = 0; h < height; h++) {
      const bendFactor = h / height;
      const currentSway = Math.floor(sway * bendFactor);
      const glow = (h === height - 1) ? 2 : 0;
      this.drawPixel(x + currentSway, this.BASE_Y - h, color, glow);
    }
  }
  
  drawFlower(flower) {
    const { x, y, type, size, stemHeight, color } = flower;
    
    // 茎
    for (let h = 0; h < stemHeight; h++) {
      this.drawPixel(x, y - h, this.palettes.grass[0]);
    }
    
    const bloomFactor = Math.sin(this.time * 0.002 + x) * 0.5 + 0.5;
    if (bloomFactor > 0.3) {
      const flowerY = y - stemHeight;
      
      // 花びら
      for (let i = -size; i <= size; i++) {
        this.drawPixel(x + i, flowerY, color, 2);
        this.drawPixel(x, flowerY + i, color, 2);
      }
      
      // 中心
      this.drawPixel(x, flowerY, this.palettes.flowerCenter, 4);
    }
  }
  
  drawMushroom(mushroom) {
    const { x, y, size } = mushroom;
    
    // キャップ
    for (let i = -size; i <= size; i++) {
      this.drawPixel(x + i, y - 2, this.palettes.mushroom[0]);
    }
    this.drawPixel(x, y - 3, this.palettes.mushroom[2]);
    
    // 茎
    for (let h = 0; h < 2; h++) {
      this.drawPixel(x, y - h, this.palettes.mushroom[1]);
    }
  }
  
  drawBird(animal) {
    const tree = this.scene.permanentElements.trees.find(t => t.id === animal.treeId);
    if (!tree) return;
    
    const { offsetX, offsetY } = animal;
    const x = tree.x + offsetX;
    const y = this.BASE_Y + offsetY;
    
    const flap = Math.sin(this.time * 0.05) > 0;
    
    // 体
    this.drawPixel(x, y, this.palettes.bird[0]);
    this.drawPixel(x + 1, y, this.palettes.bird[0]);
    
    // 頭
    this.drawPixel(x, y - 1, this.palettes.bird[2]);
    
    // 翼
    if (flap) {
      this.drawPixel(x - 1, y - 1, this.palettes.bird[1]);
      this.drawPixel(x + 2, y - 1, this.palettes.bird[1]);
    } else {
      this.drawPixel(x - 1, y, this.palettes.bird[1]);
      this.drawPixel(x + 2, y, this.palettes.bird[1]);
    }
  }
  
  drawButterfly(animal) {
    const { x, y } = animal;
    const flutter = Math.sin(this.time * 0.08 + x) * 2;
    
    // 体
    this.drawPixel(x, y, this.palettes.butterfly[2]);
    
    // 翼
    const wingY = Math.floor(flutter);
    this.drawPixel(x - 1, y + wingY, this.palettes.butterfly[0]);
    this.drawPixel(x + 1, y + wingY, this.palettes.butterfly[0]);
    this.drawPixel(x - 1, y + wingY - 1, this.palettes.butterfly[1]);
    this.drawPixel(x + 1, y + wingY - 1, this.palettes.butterfly[1]);
  }
  
  draw() {
    this.drawBackground();
    
    // レイヤー順に描画
    this.scene.permanentElements.rocks.forEach(rock => this.drawRock(rock));
    this.scene.permanentElements.fallenTrees?.forEach(fallen => this.drawFallenTree(fallen));
    this.scene.permanentElements.shrubs?.forEach(shrub => this.drawShrub(shrub));
    this.scene.permanentElements.trees.forEach(tree => this.drawTree(tree));
    this.scene.seasonalElements.grasses.forEach(grass => this.drawGrass(grass));
    this.scene.seasonalElements.flowers?.forEach(flower => this.drawFlower(flower));
    this.scene.seasonalElements.mushrooms?.forEach(mushroom => this.drawMushroom(mushroom));
    this.scene.seasonalElements.animals?.forEach(animal => {
      if (animal.type === 'bird') this.drawBird(animal);
      else if (animal.type === 'butterfly') this.drawButterfly(animal);
    });
  }
  
  animate() {
    this.draw();
    this.time++;
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  start() {
    this.animate();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  loadScene(newScene) {
    this.scene = newScene;
    this.loadPalettes();
  }
}
