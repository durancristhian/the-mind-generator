import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Browser } from "puppeteer";

export const generatePDF = async ({
  browser,
  concept,
  range,
  fileName,
}: {
  browser: Browser;
  concept: "lives" | "levels" | "stars" | "numbers";
  range: { start: number; end: number };
  fileName: string;
}) => {
  const page = await browser.newPage();

  await page.setViewport({ width: 600, height: 840 });

  const css = `
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    font-family: "Montserrat" !important;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    margin: 0;
  }
  
  .grid {
    display: flex;
    flex-wrap: wrap;
  }

  .image-container {
    height: calc(100vh / 4);
    padding: 1px;
    width: calc(100vw / 4);
  }

  .image {
    display: block;
    height: 100%;
    margin: 0 auto;
    width: 100%;
  }`;

  let images: string[] = [];

  for (let index = range.start; index <= range.end; index++) {
    const fileName = `${index}.png`;

    const image = readFileSync(
      join(process.cwd(), "build", concept, fileName),
      { encoding: "base64" }
    );

    images.push(`<img class="image" src="data:image/png;base64,${image}" />`);
  }

  const html = `
  <style>
    ${css}
  </style>
  <div class="grid">
    ${images
      .map((image) => `<div class="image-container">${image}</div>`)
      .join("")}
  </div>`;

  await page.setContent(html, {
    waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
  });

  const buffer = await page.pdf({
    format: "A4",
  });

  writeFileSync(
    join(process.cwd(), "build", "print", `${fileName}.pdf`),
    buffer,
    {
      flag: "w",
    }
  );

  return Promise.resolve();
};
