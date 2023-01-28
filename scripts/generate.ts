import puppeteer from "puppeteer";
import { generateBgOnlyCard } from "../utils/generateBgOnlyCard";
import { generateNumberCard } from "../utils/generateNumberCard";
import { generatePDF } from "../utils/generatePDF";
import { generateTextAndBgCard } from "../utils/generateTextAndBgCard";
import { getArray } from "../utils/getArray";

const NUMBER_CARDS_AMOUNT = 100;
const LIVE_CARDS_AMOUNT = 5;
const STAR_CARDS_AMOUNT = 3;
const LEVEL_CARDS_AMOUNT = 12;

const run = async () => {
  console.log("Generating number cards");
  await generateNumberCards();

  console.log("Generating live cards");
  await generateLiveCards();

  console.log("Generating stars cards");
  await generateStarsCards();

  console.log("Generating levels cards");
  await generateLevelsCards();

  console.log("Generating printable numbers cards (1-50)");
  await generateNumbersPDF({ start: 1, end: 50 }, "numbers-1-50");

  console.log("Generating printable numbers cards (51-100)");
  await generateNumbersPDF({ start: 51, end: 100 }, "numbers-51-100");

  console.log("Generating printable lives cards");
  await generateLivesPDF();

  console.log("Generating printable stars cards");
  await generateStarsPDF();

  console.log("Generating printable levels cards");
  await generateLevelsPDF();
};

const generateNumberCards = async () => {
  const browser = await puppeteer.launch();

  return Promise.allSettled(
    getArray(NUMBER_CARDS_AMOUNT).map((idx) => {
      return generateNumberCard({ browser, fileName: idx, text: idx });
    })
  ).then(() => {
    browser.close();
  });
};

const generateLiveCards = async () => {
  const browser = await puppeteer.launch();

  return Promise.allSettled(
    getArray(LIVE_CARDS_AMOUNT).map((idx) => {
      return generateBgOnlyCard({ browser, concept: "lives", fileName: idx });
    })
  ).then(() => {
    browser.close();
  });
};

const generateStarsCards = async () => {
  const browser = await puppeteer.launch();

  return Promise.allSettled(
    getArray(STAR_CARDS_AMOUNT).map((idx) => {
      return generateBgOnlyCard({ browser, concept: "stars", fileName: idx });
    })
  ).then(() => {
    browser.close();
  });
};

const generateLevelsCards = async () => {
  const browser = await puppeteer.launch();

  return Promise.allSettled(
    getArray(LEVEL_CARDS_AMOUNT).map((idx) => {
      const text = `Nivel ${idx}`;

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

const generateNumbersPDF: (
  range: { start: number; end: number },
  fileName: string
) => Promise<void> = async (range, fileName) => {
  const browser = await puppeteer.launch();

  await generatePDF({
    browser,
    concept: "numbers",
    range,
    fileName,
  });

  browser.close();
};

const generateLivesPDF = async () => {
  const browser = await puppeteer.launch();

  await generatePDF({
    browser,
    concept: "lives",
    fileName: "lives",
    range: { start: 1, end: LIVE_CARDS_AMOUNT },
  });

  browser.close();
};

const generateStarsPDF = async () => {
  const browser = await puppeteer.launch();

  await generatePDF({
    browser,
    concept: "stars",
    fileName: "stars",
    range: { start: 1, end: STAR_CARDS_AMOUNT },
  });

  browser.close();
};

const generateLevelsPDF = async () => {
  const browser = await puppeteer.launch();

  await generatePDF({
    browser,
    concept: "levels",
    fileName: "levels",
    range: { start: 1, end: LEVEL_CARDS_AMOUNT },
  });

  browser.close();
};

run();
