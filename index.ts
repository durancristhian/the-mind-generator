import puppeteer, { Browser } from "puppeteer";
import { generateBgOnlyCard } from "./utils/generateBgOnlyCard";
import { generateNumberCard } from "./utils/generateNumberCard";
import { generateTextAndBgCard } from "./utils/generateTextAndBgCard";

const run = async () => {
  const browser = await puppeteer.launch();

  console.log("Generating number cards");
  await Promise.all(generateNumberCards(browser));
  console.log("✅ Done\n");

  console.log("Generating live cards");
  await Promise.all(generateLiveCards(browser));
  console.log("✅ Done\n");

  console.log("Generating stars cards");
  await Promise.all(generateStarsCards(browser));
  console.log("✅ Done\n");

  console.log("Generating levels cards");
  await Promise.all(generateLevelsCards(browser));
  console.log("✅ Done\n");

  await browser.close();
};

const generateNumberCards = (browser: Browser) => {
  return Array.from({ length: 127 }).map((_, idx) => {
    const fileName = `${idx + 1}`;
    const text = `${idx + 1}`;

    return generateNumberCard(browser, fileName, text);
  });
};

const generateLiveCards = (browser: Browser) => {
  return Array.from({ length: 10 }).map((_, idx) => {
    const fileName = `${idx + 1}`;
    const text = `${idx + 1}`;

    return generateBgOnlyCard(browser, "lives", fileName);
  });
};

const generateStarsCards = (browser: Browser) => {
  return Array.from({ length: 6 }).map((_, idx) => {
    const fileName = `${idx + 1}`;

    return generateBgOnlyCard(browser, "stars", fileName);
  });
};

const generateLevelsCards = (browser: Browser) => {
  return Array.from({ length: 12 }).map((_, idx) => {
    const fileName = `${idx + 1}`;
    const text = `Nivel ${idx + 1}`;

    return generateTextAndBgCard(browser, "levels", fileName, text);
  });
};

run();
