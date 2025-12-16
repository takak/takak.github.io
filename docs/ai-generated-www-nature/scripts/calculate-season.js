#!/usr/bin/env node
import fs from 'fs';

const START_DATE = new Date('2026-01-01T00:00:00+09:00');

function getSeasonFromMonth(month) {
  if (month === 12 || month === 1 || month === 2) {
    return { name: '冬', nameEn: 'Winter', emoji: '❄️' };
  } else if (month >= 3 && month <= 5) {
    return { name: '春', nameEn: 'Spring', emoji: '🌸' };
  } else if (month >= 6 && month <= 8) {
    return { name: '夏', nameEn: 'Summer', emoji: '🌞' };
  } else {
    return { name: '秋', nameEn: 'Autumn', emoji: '🍂' };
  }
}

function getSeasonPhase(month) {
  const season = getSeasonFromMonth(month);
  if (season.name === '冬') {
    if (month === 12) return '序盤';
    if (month === 1) return '中盤';
    return '終盤';
  }
  const startMonth = { '春': 3, '夏': 6, '秋': 9 }[season.name];
  if (month === startMonth) return '序盤';
  if (month === startMonth + 1) return '中盤';
  return '終盤';
}

const now = new Date();
const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
const diffTime = jstNow.getTime() - START_DATE.getTime();
const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
const cycleYear = Math.floor((totalDays - 1) / 365) + 1;
const dayInCycle = ((totalDays - 1) % 365) + 1;
const month = jstNow.getMonth() + 1;
const season = getSeasonFromMonth(month);
const phase = getSeasonPhase(month);

console.log(`total_day=${totalDays}`);
console.log(`cycle_year=${cycleYear}`);
console.log(`day_in_cycle=${dayInCycle}`);
console.log(`season_name=${season.name}`);
console.log(`season_name_en=${season.nameEn}`);
console.log(`season_emoji=${season.emoji}`);
console.log(`season_phase=${phase}`);
console.log(`current_month=${month}`);
console.log(`is_new_year=${dayInCycle === 1 ? 'true' : 'false'}`);
console.log(`date_string=${jstNow.toISOString().split('T')[0]}`);

const info = {
  totalDays, cycleYear, dayInCycle,
  season: season.name, seasonEn: season.nameEn, seasonEmoji: season.emoji,
  seasonPhase: phase, currentMonth: month,
  isNewYear: dayInCycle === 1,
  date: jstNow.toISOString().split('T')[0]
};

fs.writeFileSync('current-season.json', JSON.stringify(info, null, 2));
