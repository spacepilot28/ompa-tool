// types/chromium.d.ts

declare module "@sparticuz/chromium-min" {
  const chromium: {
    args: string[];
    defaultViewport: any;
    executablePath: () => Promise<string>;
    headless: boolean;
  };

  export default chromium;
}
