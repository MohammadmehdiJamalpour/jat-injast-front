import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { useNavigate } from "@/lib/router-compat";
import { createMapIrTileLayer } from "../../../lib/mapIr";
import { autocompleteMapIr, searchMapIr } from "../../../services/mapIrSearchService";
import { reportClientError } from "../../../utils/reportClientError";
import { toNumber } from "../searchData";
import MapPlaceSearch from "./MapPlaceSearch";
import {
  addZoomControl,
  escapeHtml,
  makeHouseIcon,
  useMapMarkerStyles,
} from "./mapLeafletUtils";

const TEHRAN_CENTER = [35.6892, 51.389];
const DISTANCE_THRESHOLD_PX = 40;
const HOVER_ZOFFSET = 100000;

export default function MapSection({ houses, loading, selectedPlace }) {
  useMapMarkerStyles();

  const navigate = useNavigate();
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const placeMarkerRef = useRef(null);
  const skipAutocompleteRef = useRef(false);
  const markerRefs = useRef({});
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeResults, setPlaceResults] = useState([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [placeError, setPlaceError] = useState("");

  const center = useMemo(() => {
    if (Number.isFinite(toNumber(selectedPlace?.lat)) && Number.isFinite(toNumber(selectedPlace?.lng))) {
      return [Number(selectedPlace.lat), Number(selectedPlace.lng)];
    }
    if (houses?.length) {
      return [houses[0].lat ?? TEHRAN_CENTER[0], houses[0].lng ?? TEHRAN_CENTER[1]];
    }
    return TEHRAN_CENTER;
  }, [houses, selectedPlace?.lat, selectedPlace?.lng]);
  const initialCenterRef = useRef(center);

  const fadeNeighbours = (marker, fade) => {
    const map = mapRef.current;
    if (!map) return;

    const origin = map.latLngToLayerPoint(marker.getLatLng());
    Object.values(markerRefs.current).forEach((item) => {
      if (item === marker) return;
      const point = map.latLngToLayerPoint(item.getLatLng());
      if (origin.distanceTo(point) <= DISTANCE_THRESHOLD_PX) {
        item.setOpacity(fade ? 0 : 1);
      }
    });
  };

  const focusPlace = (place) => {
    const map = mapRef.current;
    if (!map || !Number.isFinite(toNumber(place?.lat)) || !Number.isFinite(toNumber(place?.lng))) {
      return;
    }

    const latLng = [Number(place.lat), Number(place.lng)];
    skipAutocompleteRef.current = true;
    setPlaceQuery(place.title || place.address || "");
    setPlaceResults([]);
    setPlaceError("");
    map.setView(latLng, 14, { animate: true });

    if (placeMarkerRef.current) {
      placeMarkerRef.current.removeFrom(map);
    }

    placeMarkerRef.current = L.circleMarker(latLng, {
      radius: 9,
      color: "#006f8c",
      fillColor: "#18a1c4",
      fillOpacity: 0.85,
      weight: 3,
    })
      .addTo(map)
      .bindPopup(
        `<strong>${escapeHtml(place.title)}</strong><br/><span>${escapeHtml(place.address)}</span>`,
      );

    placeMarkerRef.current.openPopup();
  };

  const handlePlaceSearch = async (event) => {
    event.preventDefault();

    const text = placeQuery.trim();
    if (text.length < 2) return;

    setPlaceLoading(true);
    setPlaceError("");

    try {
      const results = await searchMapIr(text);
      setPlaceResults(results.slice(0, 6));
      if (results[0]) focusPlace(results[0]);
    } catch (error) {
      reportClientError("Map.ir place search", error);
      setPlaceError("جستجوی موقعیت ناموفق بود");
    } finally {
      setPlaceLoading(false);
    }
  };

  useEffect(() => {
    const text = placeQuery.trim();

    if (skipAutocompleteRef.current) {
      skipAutocompleteRef.current = false;
      return undefined;
    }

    if (text.length < 2) {
      setPlaceResults([]);
      setPlaceError("");
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setPlaceLoading(true);
      setPlaceError("");

      try {
        const results = await autocompleteMapIr(text, {
          signal: controller.signal,
        });
        setPlaceResults(results.slice(0, 6));
      } catch (error) {
        if (
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED" ||
          error?.message === "canceled"
        ) {
          return;
        }

        reportClientError("Map.ir autocomplete", error);
        setPlaceError("امکان دریافت پیشنهادها نیست");
        setPlaceResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setPlaceLoading(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [placeQuery]);

  useEffect(() => {
    if (!selectedPlace?.label) return;
    skipAutocompleteRef.current = true;
    setPlaceQuery(selectedPlace.label);
    setPlaceResults([]);
    setPlaceError("");
  }, [selectedPlace?.label]);

  useEffect(() => {
    const node = mapNodeRef.current;
    if (!node || mapRef.current) return undefined;

    if (node._leaflet_id) {
      node._leaflet_id = undefined;
    }

    const map = L.map(node, {
      center: initialCenterRef.current,
      zoom: 5,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    createMapIrTileLayer(L).addTo(map);
    addZoomControl(map);
    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      if (placeMarkerRef.current) {
        placeMarkerRef.current.removeFrom(map);
        placeMarkerRef.current = null;
      }
      markerRefs.current = {};
      markerLayerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setView(center, map.getZoom(), { animate: true });
    window.setTimeout(() => map.invalidateSize(), 120);
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (
      !map ||
      !selectedPlace?.label ||
      !Number.isFinite(toNumber(selectedPlace?.lat)) ||
      !Number.isFinite(toNumber(selectedPlace?.lng))
    ) {
      return;
    }

    const latLng = [Number(selectedPlace.lat), Number(selectedPlace.lng)];
    if (placeMarkerRef.current) {
      placeMarkerRef.current.removeFrom(map);
    }

    placeMarkerRef.current = L.circleMarker(latLng, {
      radius: 10,
      color: "#006f8c",
      fillColor: "#18a1c4",
      fillOpacity: 0.85,
      weight: 3,
    })
      .addTo(map)
      .bindPopup(
        `<div class="destination-map-popup" dir="rtl"><strong>${escapeHtml(selectedPlace.label)}</strong><span>${escapeHtml(selectedPlace.subtitle || "")}</span></div>`,
      );

    placeMarkerRef.current.openPopup();
  }, [selectedPlace?.label, selectedPlace?.lat, selectedPlace?.lng, selectedPlace?.subtitle]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markerRefs.current = {};

    if (loading) return;

    const validHouses = (houses || []).filter(
      (house) => Number.isFinite(Number(house.lat)) && Number.isFinite(Number(house.lng)),
    );

    validHouses.forEach((house) => {
      const marker = L.marker([Number(house.lat), Number(house.lng)], {
        icon: makeHouseIcon(house),
        riseOnHover: true,
      });

      marker.on("mouseover", () => {
        marker.setZIndexOffset(HOVER_ZOFFSET);
        fadeNeighbours(marker, true);
      });
      marker.on("mouseout", () => {
        marker.setZIndexOffset(0);
        fadeNeighbours(marker, false);
      });
      marker.on("click", () => {
        navigate(`/house/${house.uuid || house.id}`);
      });

      marker.addTo(layer);
      markerRefs.current[house.id] = marker;
    });

    const selectedLatLng =
      Number.isFinite(toNumber(selectedPlace?.lat)) && Number.isFinite(toNumber(selectedPlace?.lng))
        ? [[Number(selectedPlace.lat), Number(selectedPlace.lng)]]
        : [];
    const boundsPoints = [
      ...validHouses.map((house) => [house.lat, house.lng]),
      ...selectedLatLng,
    ];

    if (boundsPoints.length > 1) {
      const bounds = L.latLngBounds(boundsPoints);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    } else if (validHouses.length === 1) {
      map.setView([validHouses[0].lat, validHouses[0].lng], 10);
    } else if (selectedLatLng.length === 1) {
      map.setView(selectedLatLng[0], 10);
    }

    window.setTimeout(() => map.invalidateSize(), 120);
  }, [houses, loading, navigate, selectedPlace?.lat, selectedPlace?.lng]);

  return (
    <div className="relative h-full w-full">
      <MapPlaceSearch
        placeQuery={placeQuery}
        placeResults={placeResults}
        placeLoading={placeLoading}
        placeError={placeError}
        onQueryChange={setPlaceQuery}
        onSubmit={handlePlaceSearch}
        onSelectPlace={focusPlace}
      />

      <div ref={mapNodeRef} className="z-map h-full w-full" />

      {loading && (
        <div className="pointer-events-none absolute inset-0">
          <div className="h-full w-full animate-pulse bg-gradient-to-b from-gray-100/80 to-gray-200/80 dark:from-slate-900/70 dark:to-slate-800/70" />
          <div className="absolute right-4 top-4 rounded-xl bg-white/90 px-3 py-1 text-xs text-primary-700 shadow dark:bg-slate-900/90 dark:text-sky-100">
            در حال بارگذاری...
          </div>
        </div>
      )}
    </div>
  );
}
