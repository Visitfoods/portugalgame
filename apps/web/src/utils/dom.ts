export function qs<T extends Element = Element>(sel: string, root: Document | Element = document): T {
  const el = root.querySelector(sel);
  if (!el) throw new Error(`Element not found: ${sel}`);
  return el as T;
}

export const on = (el: Element | Document | Window, ev: string, fn: any) => el.addEventListener(ev, fn as any);
export const off = (el: Element | Document | Window, ev: string, fn: any) => el.removeEventListener(ev, fn as any);

