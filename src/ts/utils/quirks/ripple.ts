import { createEl } from "..";

export const rippleHandler = (e: PointerEvent, target?: HTMLElement, forceCenter: boolean = false): void => {
  const el = target || (e.currentTarget as HTMLElement);
  if ((e.target !== e.currentTarget && (e.target as unknown as Element)?.matches("button,[href],input,label,select,textarea,[tabindex]:not([tabindex='-1'])")) || el?.hasAttribute("disabled") || (e.pointerType === "mouse" && e.button !== 0)) return;
  e.stopPropagation?.();
  const { offsetWidth: rW, offsetHeight: rH } = el,
    { width: w, height: h, left: l, top: t } = el.getBoundingClientRect(),
    size = Math.max(rW, rH),
    x = forceCenter ? rW / 2 - size / 2 : ((e.clientX - l) * rW) / w - size / 2,
    y = forceCenter ? rH / 2 - size / 2 : ((e.clientY - t) * rH) / h - size / 2,
    wrapper = createEl("span", { className: "tmg-video-ripple-container" }),
    ripple = createEl("span", { className: "tmg-video-ripple tmg-video-ripple-hold" }, {}, { cssText: `width:${size}px;height:${size}px;left:${x}px;top:${y}px;` });
  let canRelease = false;
  ripple?.addEventListener("animationend", () => (canRelease = true), { once: true });
  el.append(wrapper?.appendChild(ripple!)!.parentElement!);
  const release = (): void => {
    if (!canRelease) return ripple?.addEventListener("animationend", release, { once: true });
    ripple?.classList.replace("tmg-video-ripple-hold", "tmg-video-ripple-fade");
    ripple?.addEventListener("animationend", () => setTimeout(() => wrapper?.remove()));
    ["pointerup", "pointercancel"].forEach((evt) => el.ownerDocument.defaultView?.removeEventListener(evt, release));
  };
  ["pointerup", "pointercancel"].forEach((evt) => el.ownerDocument.defaultView?.addEventListener(evt, release));
};
