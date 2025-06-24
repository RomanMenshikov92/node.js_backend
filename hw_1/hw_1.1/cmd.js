#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .command(
    "current",
    "Показать текущую дату и время",
    (yargs) => {
      return yargs
        .option("year", {
          alias: "y",
          type: "boolean",
          description: "Показать текущий год",
        })
        .option("month", {
          alias: "m",
          type: "boolean",
          description: "Показать текущий месяц",
        })
        .option("date", {
          alias: "d",
          type: "boolean",
          description: "Показать дату в календарном месяце",
        });
    },
    (argv) => {
      const now = new Date();
      if (argv.year) {
        console.log(now.getFullYear());
      } else if (argv.month) {
        console.log(now.getMonth() + 1);
      } else if (argv.date) {
        console.log(now.getDate());
      } else {
        console.log(now.toISOString());
      }
    }
  )
  .command(
    "add",
    "Добавить время к текущей дате",
    (yargs) => {
      return yargs
        .option("year", {
          alias: "y",
          type: "number",
          description: "Добавить годы",
        })
        .option("month", {
          alias: "m",
          type: "number",
          description: "Добавить месяцы",
        })
        .option("date", {
          alias: "d",
          type: "number",
          description: "Добавить дни",
        });
    },
    (argv) => {
      let date = new Date();

      if (argv.year) {
        date.setFullYear(date.getFullYear() + argv.year);
      }
      if (argv.month) {
        date.setMonth(date.getMonth() + argv.month);
      }
      if (argv.date) {
        date.setDate(date.getDate() + argv.date);
      }

      console.log(date.toISOString());
    }
  )
  .command(
    "sub",
    "Вычесть время из текущей даты",
    (yargs) => {
      return yargs
        .option("year", {
          alias: "y",
          type: "number",
          description: "Вычесть годы",
        })
        .option("month", {
          alias: "m",
          type: "number",
          description: "Вычесть месяцы",
        })
        .option("date", {
          alias: "d",
          type: "number",
          description: "Вычесть дни",
        });
    },
    (argv) => {
      let date = new Date();

      if (argv.year) {
        date.setFullYear(date.getFullYear() - argv.year);
      }
      if (argv.month) {
        date.setMonth(date.getMonth() - argv.month);
      }
      if (argv.date) {
        date.setDate(date.getDate() - argv.date);
      }

      console.log(date.toISOString());
    }
  )
  .demandCommand(1, "Необходимо указать команду")
  .help().argv;
