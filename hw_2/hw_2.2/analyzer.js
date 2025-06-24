#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Укажите путь к файлу логов.");
  process.exit(1);
}

const logFilePath = path.resolve(args[0]);

if (!fs.existsSync(logFilePath)) {
  console.error(`Файл "${logFilePath}" не найден.`);
  process.exit(1);
}

let totalGames = 0;
let wins = 0;

const data = fs.readFileSync(logFilePath, "utf-8");
const lines = data.split("\n");

for (const line of lines) {
  if (!line.trim()) continue;

  let entry;
  try {
    entry = JSON.parse(line);
  } catch (err) {
    console.warn("Неверный формат строки в логе:", line);
    continue;
  }

  totalGames++;
  if (entry.outcome === "win") {
    wins++;
  }
}

const losses = totalGames - wins;
const winPercent = totalGames ? ((wins / totalGames) * 100).toFixed(2) : 0;

console.log("📊 Анализ игровых логов:");
console.log(`Общее количество партий: ${totalGames}`);
console.log(`Количество побед: ${wins}`);
console.log(`Количество поражений: ${losses}`);
console.log(`Процент побед: ${winPercent}%`);