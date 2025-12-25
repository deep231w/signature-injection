import { Rnd } from "react-rnd";
import { useEffect, useState } from "react";

export function SignatureBox({ pageRef, addedSignature, onChange }) {
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
        const xPercent= d.x / pageSize.width
        const yPercent= d.y / pageSize.height
        setBox(prev => ({
          ...prev,
          xPercent,
          yPercent,
        }));
        onChange({
          xPercent,
          yPercent
        })
      }}

      onResizeStop={(e, dir, ref, delta, position) => {
        const newWidthPx = ref.offsetWidth;
        const newHeightPx = ref.offsetHeight;
        const xPercent= position.x / pageSize.width
        const yPercent=position.y / pageSize.height
        const widthPercent=newWidthPx / pageSize.width
        const heightPercent=newHeightPx / pageSize.height
        const fontSizePercent=(newHeightPx * 0.6) / pageSize.height

        setBox(prev => ({
          ...prev,
          xPercent,
          yPercent,
          widthPercent,
          heightPercent,
          fontSizePercent,
        }));

        onChange({
          xPercent,
          yPercent,
          widthPercent,
          heightPercent,
          fontSizePercent,
        });
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
