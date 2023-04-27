export function delay(second: number) {
  return new Promise((r) => setTimeout(r, second * 1000));
}
export function downloadBase64(name: string, url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${name}.png`); //or any other extension
  document.body.appendChild(link);
  link.click();
}
export function objectEntries<
  T extends Record<PropertyKey, unknown>,
  K extends keyof T,
  V extends T[K]
>(o: T) {
  return Object.entries(o) as [K, V][];
}
export function pay() {
  console.log("pay");
}
