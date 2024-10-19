import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { BrowserWindow } from 'electron';

function getGptCrawlerPath() {
  const isDev = process.env.NODE_ENV === 'development';
  const basePath = isDev
    ? path.join(__dirname, '..', '..', '..', 'node_modules')
    : path.join(process.resourcesPath, 'node_modules');
  return path.join(basePath, '@builder.io', 'gpt-crawler', 'dist', 'src', 'cli.js');
}

export function executeGptCrawler(mainWindow: BrowserWindow) {
  const cliPath = getGptCrawlerPath();
  console.log('Attempting to find gpt-crawler script at:', cliPath);
  mainWindow.webContents.send('stdout-data', 'Attempting to find gpt-crawler script at: ' + cliPath);

  if (!fs.existsSync(cliPath)) {
    console.error('gpt-crawler script not found at:', cliPath);
    mainWindow.webContents.send('stdout-data', 'gpt-crawler script not found at: ' + cliPath);
    return;
  }
  console.log('gpt-crawler script found at:', cliPath);
  mainWindow.webContents.send('stdout-data', 'gpt-crawler script found at: ' + cliPath);

  const options = {
    url: 'https://www.builder.io/c/docs/developers',
    match: 'https://www.builder.io/c/docs/**',
    selector: 'body',
    maxPagesToCrawl: '3',
    outputFileName: 'crawler-output.json'
  };

  const args = [
    cliPath,
    '--url', options.url,
    '--match', options.match,
    '--selector', options.selector,
    '--maxPagesToCrawl', options.maxPagesToCrawl,
    '--outputFileName', options.outputFileName
  ];

  const crawlerProcess = spawn(process.execPath, args, { stdio: 'pipe' });

  crawlerProcess.stdout.on('data', (data) => {
    console.log('stdout:', data.toString());
    mainWindow.webContents.send('stdout-data', data.toString());
  });

  crawlerProcess.stderr.on('data', (data) => {
    console.error('stderr:', data.toString());
    mainWindow.webContents.send('stdout-data', data.toString());
  });

  crawlerProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('gpt-crawler encountered an error.');
      mainWindow.webContents.send('stdout-data', 'gpt-crawler encountered an error.');
    } else {
      console.log('gpt-crawler executed successfully.');
      mainWindow.webContents.send('stdout-data', 'gpt-crawler executed successfully.');
    }
  });
}
