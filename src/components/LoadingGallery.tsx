import { useMemo } from "react";
import "./styles/LoadingGallery.css";

/**
 * Full-bleed parallax photo wall used as the loading screen backdrop.
 * Three columns scroll vertically at different speeds/directions (the
 * parallax-scroll effect), with each column's list duplicated so the
 * CSS loop is seamless. Photos come from /public/load_photos.
 */
const PHOTOS = [
  "0e800b32-13c8-4086-8a3d-5b2b488ae1a7.jpeg",
  "1f4b596f-e0c7-471d-a2ee-eec287076a0d.jpeg",
  "2746b2ab-adaf-4528-8a9c-dde67ce56ae5.jpeg",
  "28cc8541-2ebd-4ca2-8db1-04a575dd35b2.jpeg",
  "28f4cd16-3717-47a0-ba19-39c7afca6438.jpeg",
  "2fe32166-4ad7-46fc-8daf-04f82fd24a9e.jpeg",
  "43c1e21d-740b-4d86-a0e9-75eab80a6bd7 (1).jpeg",
  "43c1e21d-740b-4d86-a0e9-75eab80a6bd7 (2).jpeg",
  "43c1e21d-740b-4d86-a0e9-75eab80a6bd7.jpeg",
  "4520eb6c-869c-4993-8127-19c6401f9616.jpeg",
  "48bf00fc-cc52-47d5-bab9-196e8d448e2e.jpeg",
  "62424961-8267-44d4-80b7-106a16a2f967.jpeg",
  "6865793f-a235-4b33-b1cd-d55669d8dd0f.jpeg",
  "6f770cbf-0993-4c1d-850d-7b1ffeba1864.jpeg",
  "73877289-6352-4389-8d94-763b1c2c1298.jpeg",
  "8242a22e-a525-4462-8fb7-d6fc79129452.jpeg",
  "83eafa8a-e210-409a-a47f-6e16aa3bddb0.jpeg",
  "90a70aaf-1081-4482-bc84-5da637d936a8 (1).jpeg",
  "90a70aaf-1081-4482-bc84-5da637d936a8.jpeg",
  "ba505fc0-c2ad-4b67-b847-cda2fdc4a69e.jpeg",
  "d0929986-951e-4b2c-a285-fac5c374aa2a.jpeg",
  "da3b3b40-deb8-4042-9c5c-d0eab1159d1d.jpeg",
  "dbb4a045-47fb-40eb-b8d5-4171615bd3e1.jpeg",
  "dc21678f-f4df-413c-bb5a-2b5acf6d7d5e.jpeg",
  "f01d6273-8fe6-4181-ae86-6a6115bf1b1a.jpeg",
  "f765de04-f221-46a5-bccf-0c363eac0422.jpeg",
  "profile.jpeg",
].map((file) => `/load_photos/${encodeURIComponent(file)}`);

const COLUMN_COUNT = 4;

const LoadingGallery = () => {
  const columns = useMemo(() => {
    const cols: string[][] = Array.from({ length: COLUMN_COUNT }, () => []);
    PHOTOS.forEach((src, i) => cols[i % COLUMN_COUNT].push(src));
    return cols;
  }, []);

  return (
    <div className="loading-gallery" aria-hidden="true">
      {columns.map((col, i) => (
        <div
          key={i}
          className={`loading-gallery-col loading-gallery-col-${i % 2 === 0 ? "up" : "down"}`}
          style={{ animationDuration: `${34 + i * 7}s` }}
        >
          {[...col, ...col].map((src, j) => (
            <div className="loading-gallery-item" key={`${src}-${j}`}>
              <img src={src} alt="" loading="eager" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingGallery;
