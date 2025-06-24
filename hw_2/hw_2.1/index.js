#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Укажите имя файла для логирования.");
  process.exit(1);
}

const logFilePath = path.resolve(args[0]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getRandomResult() {
  return Math.floor(Math.random() * 2) + 1;
}

function writeLog(playerChoice, result, win) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    playerChoice,
    result,
    outcome: win ? "win" : "lose",
  };

  const logLine = JSON.stringify(logEntry) + "\n";

  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error("Ошибка при записи в лог:", err.message);
    }
  });
}

function startGame() {
  rl.question("Угадайте: орёл (1) или решка (2)? ", (answer) => {
    const playerChoice = parseInt(answer);

    if (playerChoice !== 1 && playerChoice !== 2) {
      console.log("Введите 1 или 2!");
      return startGame();
    }

    const result = getRandomResult();
    const win = playerChoice === result;

    console.log(`Выпало: ${result === 1 ? "орёл" : "решка"}`);
    if (win) {
      console.log("Вы угадали!");
    } else {
      console.log("Не угадали!");
    }

    writeLog(playerChoice, result, win);

    rl.question("Хотите сыграть ещё раз? (Да(y) / Нет(n)): ", (again) => {
      if (again.toLowerCase() === "y") {
        startGame();
      } else {
        console.log("Игра окончена. Спасибо за игру!");
        rl.close();
      }
    });
  });
}

console.log("Добро пожаловать в игру «Орёл или решка»!");

startGame();
