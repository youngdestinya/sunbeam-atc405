// Local artifact rendering only: does not open or control the user's browser.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const require=createRequire(process.env.SUNBEAM_RUNTIME_PACKAGE || 'C:/Users/young/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium }=require('playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:900,height:1200}});
await page.goto(pathToFileURL(path.resolve('docs/architecture-pack.html')).href);
await page.evaluate(()=>document.fonts.ready);
await page.emulateMedia({media:'print'});
console.log('Page bounds',await page.locator('.page').evaluateAll(els=>els.map(e=>({height:e.clientHeight,contentHeight:e.scrollHeight}))));
mkdirSync('output/pdf',{recursive:true});
await page.pdf({path:'output/pdf/Sunbeam-Task-1-Architecture-Pack.pdf',format:'A4',printBackground:true,preferCSSPageSize:true});
await browser.close();
console.log('Architecture PDF saved.');
