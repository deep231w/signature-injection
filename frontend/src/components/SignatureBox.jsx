import { Rnd } from "react-rnd";
import { useEffect, useState } from "react";

export function SignatureBox({ pageRef, addedSignature }) {
  const [box, setBox] = useState({
    xPercent: 0.2,
    yPercent: 0.3,
    widthPercent: 0.25,
    heightPercent: 0.08,
    fontSizePercent: 0.06,
  });

  const [pageSize, setPageSize] = useState(null);

  useEffect(() => {
    if (!pageRef.current) return;

    const updateSize = () => {
      const rect = pageRef.current.getBoundingClientRect();
      setPageSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(pageRef.current);

    return () => observer.disconnect();
  }, [pageRef]);

  if (!pageSize) return null;

  const xPx = box.xPercent * pageSize.width;
  const yPx = box.yPercent * pageSize.height;
  const widthPx = box.widthPercent * pageSize.width;
  const heightPx = box.heightPercent * pageSize.height;
  const fontSizePx = box.fontSizePercent * pageSize.height;

  return (
    <Rnd
      key={`${pageSize.width}-${pageSize.height}`}
      bounds={pageRef.current}
      size={{ width: widthPx, height: heightPx }}
      position={{ x: xPx, y: yPx }}

      onDragStop={(e, d) => {
        setBox(prev => ({
          ...prev,
          xPercent: d.x / pageSize.width,
          yPercent: d.y / pageSize.height,
        }));
      }}

      onResizeStop={(e, dir, ref, delta, position) => {
        const newWidthPx = ref.offsetWidth;
        const newHeightPx = ref.offsetHeight;

        setBox(prev => ({
          ...prev,
          xPercent: position.x / pageSize.width,
          yPercent: position.y / pageSize.height,
          widthPercent: newWidthPx / pageSize.width,
          heightPercent: newHeightPx / pageSize.height,
          fontSizePercent: (newHeightPx * 0.6) / pageSize.height,
        }));
      }}

      style={{
        border: "2px dashed #6b5cff",
        background: "rgba(107,92,255,0.1)",
        cursor: "move",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${fontSizePx}px`,
          fontFamily: "cursive",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {addedSignature || "Signature"}
      </div>
    </Rnd>
  );
}
