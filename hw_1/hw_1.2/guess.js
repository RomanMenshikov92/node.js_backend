#!/usr/bin/env node

import * as readline from "node:readline/promises";

const min = 0;
const max = 100;
const secret = Math.floor(Math.random() * (max - min + 1)) + min;

console.log(`Загадано число в диапазоне от ${min} до ${max}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "",
});

rl.on("line", (line) => {
  const guess = Number(line.trim());

  if (Number.isNaN(guess)) {
    console.log("Пожалуйста, введите число");
  } else if (guess < secret) {
    console.log("Больше");
  } else if (guess > secret) {
    console.log("Меньше");
  } else {
    console.log(`Отгадано число ${secret}`);
    rl.close();
  }
});
