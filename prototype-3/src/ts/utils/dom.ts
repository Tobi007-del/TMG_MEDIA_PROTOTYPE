export function inDocView(el: Element, axis: "x" | "y" = "y") {
  const rect = el.getBoundingClientRect(),
    inX = rect.left + window.scrollX >= 0 && rect.right + window.scrollX <= window.scrollX + (window.innerWidth || document.documentElement.clientWidth),
    inY = rect.top + window.scrollY >= 0 && rect.bottom + window.scrollY <= window.scrollY + (window.innerHeight || document.documentElement.clientHeight);
  return axis === "x" ? inY : axis === "y" ? inX : inY && inX;
}
