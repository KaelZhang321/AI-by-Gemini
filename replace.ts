import fs from 'fs';

let content = fs.readFileSync('src/LoginPage.tsx', 'utf-8');

// Add isDarkMode state
if (!content.includes('const [isDarkMode, setIsDarkMode] = useState(true);')) {
  content = content.replace(
    'const [method, setMethod] = useState<LoginMethod>(\'account\');',
    'const [method, setMethod] = useState<LoginMethod>(\'account\');\n  const [isDarkMode, setIsDarkMode] = useState(true);'
  );
}

// Add toggle button in the render
if (!content.includes('onClick={() => setIsDarkMode(!isDarkMode)}')) {
  const toggleButton = `
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-slate-900/5 dark:bg-[#0d111c]/50 backdrop-blur-xl border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-900/10 dark:hover:bg-[#0d111c]/80 transition-all"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
`;
  content = content.replace(
    '<FontLoader />',
    '<FontLoader />\n' + toggleButton
  );
}

// Add Sun and Moon to lucide-react imports
if (!content.includes('Sun, Moon')) {
  content = content.replace(
    'import { \n  Eye,',
    'import { \n  Sun, Moon,\n  Eye,'
  );
}

// Replace text-white
content = content.replace(/([a-z-]*:)?text-white(\/[^\s"']*)?/g, (match, prefix, opacity) => {
  const p = prefix || '';
  const op = opacity || '';
  return `${p}text-slate-900${op} dark:${p}text-white${op}`;
});

// Replace bg-[#010107]
content = content.replace(/([a-z-]*:)?bg-\[#010107\](\/[^\s"']*)?/g, (match, prefix, opacity) => {
  const p = prefix || '';
  const op = opacity || '';
  return `${p}bg-[#F4F6F8]${op} dark:${p}bg-[#010107]${op}`;
});

// Replace bg-[#0d111c]
content = content.replace(/([a-z-]*:)?bg-\[#0d111c\](\/[^\s"']*)?/g, (match, prefix, opacity) => {
  const p = prefix || '';
  const op = opacity || '';
  return `${p}bg-white${op} dark:${p}bg-[#0d111c]${op}`;
});

// Replace border-white
content = content.replace(/([a-z-]*:)?border-white(\/[^\s"']*)?/g, (match, prefix, opacity) => {
  const p = prefix || '';
  const op = opacity || '';
  return `${p}border-slate-900${op} dark:${p}border-white${op}`;
});

// Replace bg-white/XX
content = content.replace(/([a-z-]*:)?bg-white(\/[^\s"']+)/g, (match, prefix, opacity) => {
  const p = prefix || '';
  return `${p}bg-slate-900${opacity} dark:${p}bg-white${opacity}`;
});

// Fix the root div class
content = content.replace(
  'className="min-h-screen w-full bg-[#F4F6F8] dark:bg-[#010107] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30 selection:text-slate-900 dark:selection:text-white overflow-hidden relative"',
  'className={`min-h-screen w-full flex items-center justify-center p-4 font-sans selection:bg-blue-500/30 overflow-hidden relative transition-colors duration-500 ${isDarkMode ? \'dark bg-[#010107] selection:text-white\' : \'bg-[#F4F6F8] selection:text-slate-900\'}`}'
);

content = content.replace(
  'className="min-h-screen w-full bg-[#010107] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30 selection:text-white overflow-hidden relative"',
  'className={`min-h-screen w-full flex items-center justify-center p-4 font-sans selection:bg-blue-500/30 overflow-hidden relative transition-colors duration-500 ${isDarkMode ? \'dark bg-[#010107] selection:text-white\' : \'bg-[#F4F6F8] selection:text-slate-900\'}`}'
);

fs.writeFileSync('src/LoginPage.tsx', content);
