import puppeteer, { Browser } from "puppeteer";
import { generateBgOnlyCard } from "../utils/generateBgOnlyCard";
import { generateNumberCard } from "../utils/generateNumberCard";
import { generatePDF } from "../utils/generatePDF";
import { generateTextAndBgCard } from "../utils/generateTextAndBgCard";
import { getArray } from "../utils/getArray";

const NUMBER_CARDS_AMOUNT = 127;
const LIVE_CARDS_AMOUNS = 10;
const STAR_CARDS_AMOUNS = 6;
const LEVEL_CARDS_AMOUNS = 12;

const run = async () => {
  let browser: Browser;

  console.log("Generating number cards");
  await generateNumberCards();

  console.log("Generating live cards");
  await generateLiveCards();

  console.log("Generating stars cards");
  await generateStarsCards();

  console.log("Generating levels cards");
  await generateLevelsCards();

  console.log("Generating printable numbers cards (1-50)");
  browser = await puppeteer.launch();
  await generatePDF({
    browser,
    concept: "numbers",
    range: {
      start: 1,
      end: 50,
    },
    fileName: "numbers-1-50",
  });
  await browser.close();

  console.log("Generating printable numbers cards (51-100)");
  browser = await puppeteer.launch();
  await generatePDF({
    browser,
    concept: "numbers",
    range: {
      start: 51,
      end: 100,
    },
    fileName: "numbers-51-100",
  });
  await browser.close();

  console.log("Generating printable numbers cards (101-127)");
  browser = await puppeteer.launch();
  await generatePDF({
    browser,
    concept: "numbers",
    range: {
      start: 101,
      end: 127,
    },
    fileName: "numbers-101-127",
  });
  await browser.close();

  console.log("Generating printable lives cards");
  browser = await puppeteer.launch();
  await generatePDF({
    browser,
    concept: "lives",
    fileName: "lives",
    range: { start: 1, end: LIVE_CARDS_AMOUNS },
  });
  browser.close();

  console.log("Generating printable stars cards");
  browser = await puppeteer.launch();
  await generatePDF({
    browser,
    concept: "stars",
    fileName: "stars",
    range: { start: 1, end: STAR_CARDS_AMOUNS },
  });
  browser.close();

  console.log("Generating printable levels cards");
  browser = await puppeteer.launch();
  await generatePDF({
    browser,
    concept: "levels",
    fileName: "levels",
    range: { start: 1, end: LEVEL_CARDS_AMOUNS },
  });
  browser.close();
};

const generateNumberCards = async () => {
  const browser = await puppeteer.launch();

  return Promise.all(
    getArray(NUMBER_CARDS_AMOUNT).map((idx) => {
      return generateNumberCard({ browser, fileName: idx, text: idx });
    })
  ).then(() => {
    browser.close();
  });
};

const generateLiveCards = async () => {
  const browser = await puppeteer.launch();

  return Promise.all(
    getArray(LIVE_CARDS_AMOUNS).map((idx) => {
      return generateBgOnlyCard({ browser, concept: "lives", fileName: idx });
    })
  ).then(() => {
    browser.close();
  });
};

const generateStarsCards = async () => {
  const browser = await puppeteer.launch();

  return Promise.all(
    getArray(STAR_CARDS_AMOUNS).map((idx) => {
      return generateBgOnlyCard({ browser, concept: "stars", fileName: idx });
    })
  ).then(() => {
    browser.close();
  });
};

const generateLevelsCards = async () => {
  const browser = await puppeteer.launch();

  return Promise.all(
    getArray(LEVEL_CARDS_AMOUNS).map((idx) => {
      const text = `Nivel ${idx + 1}`;

      return generateTextAndBgCard({
        browser,
        concept: "levels",
        fileName: idx,
        text,
      });
    })
  ).then(() => {
    browser.close();
  });
};

run();
