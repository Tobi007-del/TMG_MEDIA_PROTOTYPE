// === Type definition for T007 Toast Library (Global) ===
export type ToastType = "success" | "error" | "warning" | "info";

export type ToastOptions = Partial<{
  id: string;
  idPrefix: string;
  render: string;
  type: ToastType;
  image: string | boolean;
  icon: string;
  autoClose: boolean | number; //
  position: //
    | "top-right"
    | "top-left"
    | "top-center"
    | "bottom-right"
    | "bottom-left"
    | "bottom-center"
    | "cetner-right"
    | "center-left"
    | "center-center";
  onClose: (timeElapsed: boolean) => void;
  onTimeUpdate: (time: number) => void;
  closeButton: boolean;
  closeOnClick: boolean;
  isLoading: boolean | string; // icon HTML
  nprogress: number;
  dragToClose: boolean | "mouse" | "touch" | "pen";
  dragToClosePercent: number | { x: number; y: number };
  dragToCloseDir:
    | "x"
    | "y"
    | "xy"
    | "x|y"
    | "x||y"
    | "x+"
    | "x-"
    | "y+"
    | "y-"
    | "xy+"
    | "xy-"
    | "x|y+"
    | "x|y-"
    | "x||y+"
    | "x||y-";
  hideProgressBar: boolean;
  pauseOnHover: boolean;
  pauseOnFocusLoss: boolean;
  renotify: boolean;
  tag: string | number;
  vibrate: boolean | number[];
  delay: number;
  bodyHTML: string;
  animation:
    | "fade"
    | "zoom"
    | "slide"
    | "slide-left"
    | "slide-right"
    | "slide-up"
    | "slide-down";
  actions: Record<string, () => void>;
  rootElement: any; // HTMLElement
  maxToasts: number;
  newestOnTop: boolean;
}>;

export interface ToastInstance {
  (message: string, options?: ToastOptions): string; // returns toast ID
  loading(message: string, options?: ToastOptions): string;
  success(renderOrId: string, options?: ToastOptions): string;
  error(renderOrId: string, options?: ToastOptions): string;
  warn(renderOrId: string, options?: ToastOptions): string;
  dismiss(id: string, manner?: "instant" | "animate"): void;
  dismissAll(idPrefix?: string): void;
  doForAll(action: string, payload: any, idPrefix?: string): void;
  getAll(idPrefix: string): ToastInstance[];
}
