// 季節ごとの色パレット定義

const SEASON_PALETTES = {
  winter: {
    sky: ['#B0C4DE', '#C0C0C0', '#D3D3D3'],
    grass: ['#A9A9A9', '#808080', '#696969'],
    leaf: ['#8B7355', '#6F5438'],
    trunk: ['#3E2723', '#2E1A1A', '#4E342E'],
    trunkHighlight: '#5D4037',
    trunkShadow: '#1A0A0A',
    flower: [],
    rock: ['#808080', '#696969', '#A9A9A9', '#778899'],
    moss: ['#4F7942', '#556B2F'],
    lichen: ['#B8860B', '#DAA520'],
    mushroom: [],
    shrub: ['#556B2F', '#6B8E23'],
    fallenTree: ['#654321', '#5D4037'],
    bird: ['#4169E1', '#1E90FF', '#000000', '#FFFFFF'],
    butterfly: [],
    flowerCenter: '',
    ground: {
      poor: ['#A9A9A9', '#C0C0C0', '#D3D3D3'],
      medium: ['#9E9E9E', '#BDBDBD', '#CFCFCF'],
      rich: ['#808080', '#A9A9A9', '#BEBEBE']
    }
  },
  
  spring: {
    sky: ['#87CEEB', '#B0E0E6', '#E0F6FF'],
    grass: ['#90EE90', '#98FB98', '#ADFF2F', '#32CD32'],
    leaf: ['#32CD32', '#00FF00', '#7FFF00', '#3CB371'],
    trunk: ['#8B4513', '#A0522D', '#654321', '#5D4037'],
    trunkHighlight: '#CD853F',
    trunkShadow: '#3E2723',
    flower: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFA07A'],
    rock: ['#808080', '#696969', '#A9A9A9', '#778899'],
    moss: ['#4F7942', '#6B8E23', '#556B2F', '#8FBC8F'],
    lichen: ['#DAA520', '#FFD700'],
    mushroom: ['#DC143C', '#8B4513', '#FFEB3B'],
    shrub: ['#2E7D32', '#388E3C', '#4CAF50'],
    fallenTree: ['#654321', '#5D4037', '#4E342E'],
    bird: ['#4169E1', '#1E90FF', '#000000', '#FFFFFF'],
    butterfly: ['#FF1493', '#FFD700', '#FF69B4'],
    flowerCenter: '#FFEB3B',
    ground: {
      poor: ['#8B7355', '#A0826D', '#6F5438'],
      medium: ['#704214', '#5C3317', '#483C32'],
      rich: ['#4A2A1A', '#3E1F14', '#32190F']
    }
  },
  
  summer: {
    sky: ['#87CEEB', '#ADD8E6', '#E0F6FF'],
    grass: ['#228B22', '#32CD32', '#3CB371', '#00FF00'],
    leaf: ['#228B22', '#2E8B57', '#3CB371', '#006400'],
    trunk: ['#8B4513', '#A0522D', '#654321', '#5D4037'],
    trunkHighlight: '#CD853F',
    trunkShadow: '#3E2723',
    flower: ['#FF1493', '#FF69B4', '#FFA500', '#FFD700'],
    rock: ['#808080', '#696969', '#A9A9A9', '#778899'],
    moss: ['#556B2F', '#6B8E23', '#8FBC8F', '#9ACD32'],
    lichen: ['#FFD700', '#FFA500'],
    mushroom: ['#DC143C', '#8B4513', '#FFEB3B'],
    shrub: ['#228B22', '#2E7D32', '#388E3C'],
    fallenTree: ['#654321', '#5D4037', '#4E342E'],
    bird: ['#4169E1', '#1E90FF', '#000000', '#FFFFFF'],
    butterfly: ['#FF1493', '#FFD700', '#FF69B4', '#FF6347'],
    flowerCenter: '#FFEB3B',
    ground: {
      poor: ['#8B7355', '#A0826D', '#6F5438'],
      medium: ['#704214', '#5C3317', '#483C32'],
      rich: ['#4A2A1A', '#3E1F14', '#32190F']
    }
  },
  
  autumn: {
    sky: ['#87CEEB', '#B0C4DE', '#D3D3D3'],
    grass: ['#9ACD32', '#8FBC8F', '#6B8E23'],
    leaf: ['#FFD700', '#FF6347', '#DC143C', '#8B4513'],
    trunk: ['#8B4513', '#A0522D', '#654321', '#5D4037'],
    trunkHighlight: '#CD853F',
    trunkShadow: '#3E2723',
    flower: ['#DDA0DD', '#DA70D6', '#C71585'],
    rock: ['#808080', '#696969', '#A9A9A9', '#778899'],
    moss: ['#6B8E23', '#556B2F', '#8FBC8F'],
    lichen: ['#B8860B', '#DAA520', '#CD853F'],
    mushroom: ['#DC143C', '#8B4513', '#FFEB3B', '#FF8C00'],
    shrub: ['#8B4513', '#A0522D', '#CD853F'],
    fallenTree: ['#654321', '#5D4037', '#4E342E'],
    bird: ['#4169E1', '#1E90FF', '#000000', '#FFFFFF'],
    butterfly: ['#FF8C00', '#FFD700'],
    flowerCenter: '#8B4513',
    ground: {
      poor: ['#8B7355', '#A0826D', '#6F5438'],
      medium: ['#704214', '#5C3317', '#483C32'],
      rich: ['#4A2A1A', '#3E1F14', '#32190F']
    }
  }
};

// グローバルスコープに公開
window.SEASON_PALETTES = SEASON_PALETTES;
