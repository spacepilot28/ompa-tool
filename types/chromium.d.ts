// types/chromium.d.ts

declare module "@sparticuz/chromium" {
  const chromium: {
    args: string[];
    defaultViewport: any;
    executablePath: () => Promise<string>;
    headless: boolean | "new";
  };

  export default chromium;
}
