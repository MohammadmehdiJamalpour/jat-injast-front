
import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createMapIrTileLayer } from "../../../lib/mapIr";

const MAP_ACCENT_COLOR = "#006f8c";
const MAP_HEIGHT = 250;

function createZoomControl() {
  return L.Control.extend({
    options: { position: "bottomright" },

    onAdd(map) {
      const container = L.DomUtil.create("div", "leaflet-bar custom-control");

      const makeButton = (label, title, onClick) => {
        const button = L.DomUtil.create("a", "", container);
        button.href = "#";
        button.title = title;
        button.innerHTML = label;
        button.style.backgroundColor = "#fff";
        button.style.color = MAP_ACCENT_COLOR;
        button.style.fontSize = "18px";
        button.style.width = "40px";
        button.style.height = "40px";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.textDecoration = "none";
        button.style.borderRadius = "50%";
        button.style.marginBottom = label === "+" ? "5px" : "0";
        button.style.border = "1px solid rgba(0, 111, 140, 0.14)";
        button.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
        button.style.cursor = "pointer";

        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.on(button, "click", L.DomEvent.preventDefault);
        L.DomEvent.on(button, "click", onClick);
      };

      makeButton("+", "بزرگنمایی", () => map.zoomIn());
      makeButton("-", "کوچک نمایی", () => map.zoomOut());

      return container;
    },
  });
}

function HouseLocation({ cords }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  const position = useMemo(() => {
    const latitude = Number(cords?.latitude);
    const longitude = Number(cords?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return [latitude, longitude];
  }, [cords?.latitude, cords?.longitude]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !position) return undefined;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Leaflet stamps the container DOM node. Removing this stamp prevents
    // strict-mode remounts from failing with "Map container is already initialized".
    delete container._leaflet_id;

    const map = L.map(container, {
      center: position,
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    createMapIrTileLayer(L).addTo(map);

    L.circle(position, {
      radius: 400,
      color: MAP_ACCENT_COLOR,
      fillColor: MAP_ACCENT_COLOR,
      fillOpacity: 0.2,
    }).addTo(map);

    const ZoomControl = createZoomControl();
    const zoomControl = new ZoomControl();
    map.addControl(zoomControl);

    return () => {
      map.removeControl(zoomControl);
      map.remove();
      mapRef.current = null;

      delete container._leaflet_id;
    };
  }, [position]);

  if (!position) {
    return null;
  }

  return (
    <div
      role="img"
      aria-label={'\u0646\u0642\u0634\u0647 \u0645\u062d\u062f\u0648\u062f\u0647 \u0627\u0642\u0627\u0645\u062a\u06af\u0627\u0647'}
      style={{
        width: "100%",
        height: `${MAP_HEIGHT}px`,
        borderRadius: "24px",
        overflow: "hidden",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "24px",
          zIndex: 0,
        }}
      />
    </div>
  );
}

export default HouseLocation;
