const themeScript = `!function(){try{var k="brightcore-theme",s=localStorage.getItem(k),d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}}();`;

/**
 * Runs before paint so a returning dark-mode visitor never sees a white flash.
 * Keep this in sync with `THEME_STORAGE_KEY`.
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
