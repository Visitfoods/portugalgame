import type { ItemSprites } from "../../utils/types";

type Manifest = { good?: string[]; bad?: string[] };

export async function loadItemSprites(manifestUrl = '/assets/items/manifest.json'): Promise<ItemSprites> {
  let manifest: Manifest = { good: [], bad: [] };
  try {
    const res = await fetch(manifestUrl, { cache: 'no-store' });
    if (res.ok) manifest = await res.json();
  } catch {}
  const loadMany = async (arr?: string[]) => {
    const urls = (arr || []).filter(Boolean);
    const images: HTMLImageElement[] = [];
    await Promise.all(urls.map(u => loadImage(u).then(img => images.push(img)).catch(()=>{})));
    return images;
  };
  const good = await loadMany(manifest.good);
  const bad = await loadMany(manifest.bad);
  return { good, bad };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

