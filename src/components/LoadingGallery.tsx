import { useMemo } from "react";
import "./styles/LoadingGallery.css";
import loadingGalleryData from "../../public/images/loading-gallery/data.json";

const COLUMN_COUNT = 4;

const LoadingGallery = () => {
  const columns = useMemo(() => {
    const cols: string[][] = Array.from({ length: COLUMN_COUNT }, () => []);
    loadingGalleryData.photos.forEach((src, i) => cols[i % COLUMN_COUNT].push(src));
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
