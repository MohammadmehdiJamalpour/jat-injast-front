import { useEffect } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import Vote from "../../../ui/Vote";

export const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function useMapMarkerStyles() {
  useEffect(() => {
    if (document.getElementById("map-pin-styles")) return;

    const style = document.createElement("style");
    style.id = "map-pin-styles";
    style.innerHTML = `
      @keyframes wiggle { 0%,100% { transform: translateY(-1px); } 50% { transform: translateY(1px); } }
      .wiggle { animation: wiggle 1.2s ease-in-out infinite; }
      .mini-card { pointer-events: none; z-index: 10000; }
      .group:hover .mini-card { opacity: 1; }
      .leaflet-marker-icon { transition: opacity 0.3s ease; }
      .map-house-pin { color: #0084a6 !important; }
      .map-house-preview {
        background-color: #ffffff !important;
        color: #0f172a !important;
      }
      .map-house-preview-title { color: #0f172a !important; }
      .map-house-preview-price { color: #006f8c !important; }
      .map-house-vote .bg-primary-50 { background-color: #f2fbfd !important; }
      .map-house-vote .text-primary-600 { color: #006f8c !important; }
    `;
    document.head.appendChild(style);
  }, []);
}

export function addZoomControl(map) {
  const Zoom = L.Control.extend({
    options: { position: "topleft" },
    onAdd() {
      const box = L.DomUtil.create("div", "leaflet-control flex gap-1");
      const make = (label, title, cb) => {
        const button = L.DomUtil.create("a", "", box);
        button.innerHTML = label;
        button.title = title;
        button.href = "#";
        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.on(button, "click", L.DomEvent.preventDefault);
        L.DomEvent.on(button, "click", cb);
        button.className = [
          "!w-10 !h-10 !rounded-full",
          "!border !border-primary-100 bg-white text-primary-700 text-xl",
          "!leading-[40px] flex items-center justify-center",
          "shadow-lg hover:bg-white hover:text-primary-900",
          "focus:outline-none focus:ring-2 focus:ring-primary-600",
        ].join(" ");
      };

      make("+", "بزرگ‌نمایی", () => map.zoomIn());
      make("−", "کوچک‌نمایی", () => map.zoomOut());
      return box;
    },
  });

  const zoom = new Zoom();
  map.addControl(zoom);
  return zoom;
}

export function makeHouseIcon(house) {
  const voteHTML = renderToStaticMarkup(
    <Vote vote={house.score ?? undefined} size="sm" />,
  );
  const priceThousands = Math.round((house.price || 0) / 1000).toLocaleString(
    "fa-IR",
  );
  const image = house.images?.[0] || house.avatar || "/house.jpg";

  return L.divIcon({
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    className: "",
    html: `
      <div class="group relative flex flex-col items-center">
        <svg class="map-house-pin w-8 h-8 wiggle drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.25c-4.557 0-8.25 3.688-8.25 8.25 0 5.628 7.368 10.666 7.685 10.882.327.224.803.224 1.13 0 .317-.216 7.685-5.254 7.685-10.882 0-4.562-3.693-8.25-8.25-8.25zm0 10.875a2.625 2.625 0 110-5.25 2.625 2.625 0 010 5.25z" />
        </svg>

        <div class="mini-card absolute left-1/2 -translate-x-1/2 -top-32 opacity-0 transition-opacity duration-200" style="z-index:10000;">
          <div class="map-house-preview w-36 md:w-52 rounded-xl z-[9999] overflow-hidden font-sans shadow-lg">
            <img src="${image}" alt="${escapeHtml(house.name)}" class="w-full h-24 md:h-40 object-cover" />
            <div class="p-2 space-y-1 font-sans">
              <div class="flex items-center justify-between gap-1">
                <span class="map-house-preview-title text-[10px] sm:text-[16px] font-medium truncate">${escapeHtml(house.name)}</span>
                <span class="map-house-vote">${voteHTML}</span>
              </div>
              <div class="map-house-preview-price text-[9px] sm:text-[14px] font-semibold">
                ${priceThousands}&nbsp;هزار&nbsp;تومان
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  });
}
