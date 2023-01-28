import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Browser } from "puppeteer";
import { addDotIfNeeded } from "./addDotIfNeeded";

export const generateNumberCard = async ({
  browser,
  fileName,
  text,
}: {
  browser: Browser;
  fileName: string;
  text: string;
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
  }
  
  .card-number-center {
    color: white;
    font-size: 225px;
    left: 50%;
    position: absolute;
    text-align: center;
    text-shadow: 12px 12px 0 rgba(0, 0, 0, 0.75);
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  
  .card-number-top-left,
  .card-number-top-right,
  .card-number-bottom-left,
  .card-number-bottom-right {
    color: white;
    font-size: 84px;
    position: absolute;
    text-shadow: 6px 6px 0 rgba(0, 0, 0, 0.75);
  }
  
  .card-number-top-left {
    left: 60px;
    top: 60px;
  }
  
  .card-number-top-right {
    right: 60px;
    top: 60px;
  }
  
  .card-number-bottom-left {
    bottom: 60px;
    left: 60px;
    transform: rotate(180deg);
  }
  
  .card-number-bottom-right {
    bottom: 60px;
    right: 60px;
    transform: rotate(180deg);
  }`;

  const Montserrat = readFileSync(
    join(process.cwd(), "fonts", "Montserrat-Bold.woff2"),
    { encoding: "base64" }
  );

  const cardBg = readFileSync(
    join(process.cwd(), "images", "numbers", `${fileName}.png`),
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
    <div class="card-number-top-left">${addDotIfNeeded(text)}</div>
    <div class="card-number-top-right">${addDotIfNeeded(text)}</div>
    <div class="card-number-center">${text}</div>
    <div class="card-number-bottom-left">${addDotIfNeeded(text)}</div>
    <div class="card-number-bottom-right">${addDotIfNeeded(text)}</div>
  </div>`;

  await page.setContent(html, {
    waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
  });

  const buffer = await page.screenshot();

  writeFileSync(
    join(process.cwd(), "build", "numbers", `${fileName}.png`),
    buffer,
    {
      flag: "w",
    }
  );

  /* await page.close(); */
};
