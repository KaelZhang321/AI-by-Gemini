import fs from 'fs';

async function fetchTargetCursor() {
  const res = await fetch('https://raw.githubusercontent.com/DavidHDev/react-bits/main/public/r/TargetCursor-TS-TW.json');
  const data = await res.json();
  fs.writeFileSync('targetcursor.json', JSON.stringify(data, null, 2));
}

fetchTargetCursor();
