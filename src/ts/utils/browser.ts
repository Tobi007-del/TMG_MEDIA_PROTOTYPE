// Types
type BrandEntry = { brand?: string; version?: string };

// Browser Detection
const w = typeof window !== "undefined" ? window : undefined;
const nav = w?.navigator;
const uaData = (nav as Navigator & { userAgentData?: { platform?: string; brands?: BrandEntry[] } })?.userAgentData;

export let IS_IPOD = false;
export let IOS_VERSION: string | null = null;
export let IS_ANDROID = false;
export let ANDROID_VERSION: number | string | null;
export let IS_FIREFOX = false;
export let IS_EDGE = false;
export let IS_CHROMIUM = false;
export let IS_CHROME = false; // chromium but not edge
export let CHROMIUM_VERSION: number | null = null;
export let CHROME_VERSION: number | null = null;
export const IS_CHROMECAST_RECEIVER = Boolean((w as any)?.cast?.framework?.CastReceiverContext);
export let IE_VERSION: number | null = null;
export let IS_SAFARI = false;
export let IS_WINDOWS = false;
export let IS_IPAD = false;
export let IS_IPHONE = false;
export let IS_TIZEN = false;
export let IS_WEBOS = false;
export let IS_SMART_TV = false;

// Capabilities
export const TOUCH_ENABLED = Boolean(w && ("ontouchstart" in w || (nav as Navigator & { maxTouchPoints?: number })?.maxTouchPoints || ((w as any).DocumentTouch && w.document instanceof (w as any).DocumentTouch)));

if (uaData?.platform && uaData?.brands) {
  IS_ANDROID = uaData.platform === "Android";
  IS_EDGE = Boolean(uaData.brands.find((b) => b.brand === "Microsoft Edge"));
  IS_CHROMIUM = Boolean(uaData.brands.find((b) => b.brand === "Chromium"));
  IS_CHROME = !IS_EDGE && IS_CHROMIUM;
  const chromiumBrand = uaData.brands.find((b) => b.brand === "Chromium");
  CHROMIUM_VERSION = CHROME_VERSION = chromiumBrand?.version ? parseFloat(chromiumBrand.version) : null;
  IS_WINDOWS = uaData.platform === "Windows";
}

if (!IS_CHROMIUM) {
  const UA = nav?.userAgent || "";
  IS_IPOD = /iPod/i.test(UA);
  const iosMatch = UA.match(/OS (\d+)_/i);
  IOS_VERSION = iosMatch?.[1] ?? null;
  IS_ANDROID = /Android/i.test(UA);
  const androidMatch = UA.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);
  if (androidMatch) {
    const major = androidMatch[1] && parseFloat(androidMatch[1]);
    const minor = androidMatch[2] && parseFloat(androidMatch[2]);
    ANDROID_VERSION = major && minor ? parseFloat(`${major}.${minor}`) : major || null;
  } else ANDROID_VERSION = null;
  IS_FIREFOX = /Firefox/i.test(UA);
  IS_EDGE = /Edg/i.test(UA);
  IS_CHROMIUM = /Chrome/i.test(UA) || /CriOS/i.test(UA);
  IS_CHROME = !IS_EDGE && IS_CHROMIUM;
  const chromeMatch = UA.match(/(Chrome|CriOS)\/(\d+)/);
  CHROMIUM_VERSION = CHROME_VERSION = chromeMatch?.[2] ? parseFloat(chromeMatch[2]) : null;
  const ieResult = /MSIE\s(\d+)\.\d/.exec(UA);
  let ieVersion = ieResult && parseFloat(ieResult[1]);
  if (!ieVersion && /Trident\/7.0/i.test(UA) && /rv:11.0/.test(UA)) ieVersion = 11.0;
  IE_VERSION = ieVersion || null;
  IS_TIZEN = /Tizen/i.test(UA);
  IS_WEBOS = /Web0S/i.test(UA);
  IS_SMART_TV = IS_TIZEN || IS_WEBOS;
  IS_SAFARI = /Safari/i.test(UA) && !IS_CHROME && !IS_ANDROID && !IS_EDGE && !IS_SMART_TV;
  IS_WINDOWS = /Windows/i.test(UA);
  IS_IPAD = /iPad/i.test(UA) || (IS_SAFARI && TOUCH_ENABLED && !/iPhone/i.test(UA));
  IS_IPHONE = /iPhone/i.test(UA) && !IS_IPAD;
}

// Composite Flags
export const IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD;
export const IS_ANY_SAFARI = (IS_SAFARI || IS_IOS) && !IS_CHROME;
export const IS_MOBILE = Boolean(IS_ANDROID || IS_IPHONE || IS_IPOD || IS_IPAD);

// Media Queries
export const queryMediaMobile = (query = "(max-width: 480px)"): boolean => Boolean(w && "matchMedia" in w && w.matchMedia(query).matches);
