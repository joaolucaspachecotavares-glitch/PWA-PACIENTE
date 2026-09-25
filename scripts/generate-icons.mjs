import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/icons", { recursive: true });
for (const size of [192, 512]) {
  await sharp("public/icon.svg")
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}.png`);
}
await sharp("public/icon.svg")
  .resize(512, 512)
  .flatten({ background: "#EAF7F1" })
  .png()
  .toFile("public/icons/maskable-512.png");
await sharp("public/icon.svg")
  .resize(180, 180)
  .png()
  .toFile("src/app/apple-icon.png");
