import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Browser } from "puppeteer";

export const generateBgOnlyCard = async ({
  browser,
  concept,
  fileName,
}: {
  browser: Browser;
  concept: "lives" | "levels" | "stars";
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
  
  .card {
    height: 100%;
    position: relative;
    width: 100%;
  }
  
  .card-background {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }`;

  const Montserrat = readFileSync(
    join(process.cwd(), "fonts", "Montserrat-Bold.woff2"),
    { encoding: "base64" }
  );

  const cardBg = readFileSync(
    join(process.cwd(), "images", concept, `${fileName}.png`),
    { encoding: "base64" }
  );

  const html = `
  <style>
    @font-face {
      font-family: "Montserrat";
      src: url("data:font/ttf;base64,${Montserrat}");
    }
    ${css}
  </style>
  <div class="card">
    <div class="card-background" style="background-image:url('data:image/png;base64,${cardBg}')"></div>
  </div>`;

  await page.setContent(html, {
    waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
  });

  const buffer = await page.screenshot();

  writeFileSync(
    join(process.cwd(), "build", concept, `${fileName}.png`),
    buffer,
    {
      flag: "w",
    }
  );

  await page.close();
};
