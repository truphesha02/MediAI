import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  MapPin,
  HeartPulse,
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  Navigation,
  Search,
  Hospital,
  Pill,
  LocateFixed,
  RefreshCw,
  ExternalLink,
  Building2,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =========================================================
   CONFIG
========================================================= */

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

/* =========================================================
   LEAFLET ICON FIX
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* =========================================================
   CUSTOM MARKERS
========================================================= */

const hospitalIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.0.0/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pharmacyIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.0.0/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const clinicIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.0.0/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.0.0/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* =========================================================
   MAP CENTER COMPONENT
========================================================= */

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, {
        duration: 1.2,
      });
    }
  }, [position, map]);

  return null;
}

/* =========================================================
   FETCH WITH TIMEOUT
========================================================= */

async function fetchWithTimeout(url, options = {}, timeout = 9000) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timer);
  }
}

/* =========================================================
   DISTANCE
========================================================= */

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/* =========================================================
   EXTRACT COORDINATES
========================================================= */

function extractCoordinates(text) {
  if (!text) return null;

  const trimmed = text.trim();

  // Plain coordinates:
  // 22.3072, 73.1812
  const plainMatch = trimmed.match(
    /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
  );

  if (plainMatch) {
    const lat = Number(plainMatch[1]);
    const lon = Number(plainMatch[2]);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    ) {
      return { lat, lon };
    }
  }

  // Google Maps style:
  // @22.3072,73.1812
  const googleMatch = trimmed.match(
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
  );

  if (googleMatch) {
    const lat = Number(googleMatch[1]);
    const lon = Number(googleMatch[2]);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    ) {
      return { lat, lon };
    }
  }

  return null;
}

/* =========================================================
   NOMINATIM LOCATION SEARCH
========================================================= */

async function searchNominatim(query, limit = 5) {
  const params = new URLSearchParams({
    format: "jsonv2",
    q: query,
    addressdetails: "1",
    limit: String(limit),
    countrycodes: "in",
    "accept-language": "en",
  });

  const response = await fetchWithTimeout(
    `${NOMINATIM_URL}/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
    9000
  );

  if (!response.ok) {
    throw new Error(`Location search failed: ${response.status}`);
  }

  return await response.json();
}

/* =========================================================
   REVERSE GEOCODING
========================================================= */

async function reverseGeocode(lat, lon) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lon),
    zoom: "18",
    addressdetails: "1",
    "accept-language": "en",
  });

  const response = await fetchWithTimeout(
    `${NOMINATIM_URL}/reverse?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
    8000
  );

  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  return await response.json();
}

/* =========================================================
   BUILD OVERPASS QUERY
========================================================= */

function buildOverpassQuery(lat, lon, radius) {
  return `
[out:json][timeout:20];

(
  nwr["amenity"="hospital"](around:${radius},${lat},${lon});
  nwr["healthcare"="hospital"](around:${radius},${lat},${lon});

  nwr["amenity"="pharmacy"](around:${radius},${lat},${lon});
  nwr["healthcare"="pharmacy"](around:${radius},${lat},${lon});

  nwr["amenity"="clinic"](around:${radius},${lat},${lon});
  nwr["healthcare"="clinic"](around:${radius},${lat},${lon});

  nwr["healthcare"="centre"](around:${radius},${lat},${lon});
);

out center tags qt;
`;
}

/* =========================================================
   PARSE OVERPASS FACILITIES
========================================================= */

function parseOverpassFacilities(elements, userLat, userLon) {
  const facilities = [];

  for (const element of elements || []) {
    const tags = element.tags || {};

    const lat =
      element.lat ??
      element.center?.lat ??
      null;

    const lon =
      element.lon ??
      element.center?.lon ??
      null;

    if (lat === null || lon === null) {
      continue;
    }

    const amenity = String(tags.amenity || "").toLowerCase();
    const healthcare = String(tags.healthcare || "").toLowerCase();

    let type = "hospital";

    if (
      amenity === "pharmacy" ||
      healthcare === "pharmacy"
    ) {
      type = "pharmacy";
    } else if (
      amenity === "clinic" ||
      healthcare === "clinic" ||
      healthcare === "centre"
    ) {
      type = "clinic";
    }

    const name =
      tags.name ||
      tags["name:en"] ||
      tags.operator ||
      (type === "pharmacy"
        ? "Pharmacy"
        : type === "clinic"
        ? "Clinic"
        : "Hospital");

    const phone =
      tags.phone ||
      tags["contact:phone"] ||
      tags["contact:mobile"] ||
      tags.mobile ||
      "";

    const website =
      tags.website ||
      tags["contact:website"] ||
      "";

    const addressParts = [
      tags["addr:housenumber"],
      tags["addr:street"],
      tags["addr:suburb"],
      tags["addr:city"],
      tags["addr:state"],
      tags["addr:postcode"],
    ].filter(Boolean);

    const address =
      addressParts.join(", ") ||
      tags["addr:full"] ||
      "";

    const distance = calculateDistance(
      userLat,
      userLon,
      Number(lat),
      Number(lon)
    );

    facilities.push({
      id: `${element.type}-${element.id}`,
      name,
      type,
      lat: Number(lat),
      lon: Number(lon),
      phone,
      website,
      address,
      distance,
      openingHours: tags.opening_hours || "",
      speciality: tags["healthcare:speciality"] || "",
      source: "OpenStreetMap",
    });
  }

  return facilities;
}

/* =========================================================
   DEDUPLICATE
========================================================= */

function deduplicateFacilities(facilities) {
  const seen = new Map();

  for (const facility of facilities) {
    const nameKey = String(facility.name || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    const coordinateKey = `${facility.lat.toFixed(5)},${facility.lon.toFixed(
      5
    )}`;

    const key = `${nameKey}-${coordinateKey}`;

    if (!seen.has(key)) {
      seen.set(key, facility);
    }
  }

  return Array.from(seen.values()).sort(
    (a, b) => a.distance - b.distance
  );
}

/* =========================================================
   OVERPASS SEARCH
========================================================= */

async function searchOverpass(lat, lon, radius) {
  const query = buildOverpassQuery(lat, lon, radius);

  for (const server of OVERPASS_SERVERS) {
    try {
      const response = await fetchWithTimeout(
        server,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `data=${encodeURIComponent(query)}`,
        },
        7000
      );

      if (!response.ok) {
        continue;
      }

      const data = await response.json();

      if (
        data &&
        Array.isArray(data.elements) &&
        data.elements.length > 0
      ) {
        const parsed = parseOverpassFacilities(
          data.elements,
          lat,
          lon
        );

        if (parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      // Try the next Overpass server.
      continue;
    }
  }

  return [];
}

/* =========================================================
   NOMINATIM FACILITY FALLBACK
========================================================= */

async function searchNominatimFacilities(
  lat,
  lon,
  type
) {
  try {
    const boxSize = 0.15;

    const left = lon - boxSize;
    const bottom = lat - boxSize;
    const right = lon + boxSize;
    const top = lat + boxSize;

    const params = new URLSearchParams({
      format: "jsonv2",
      q: type,
      layer: "poi",
      limit: "10",
      countrycodes: "in",
      viewbox: `${left},${top},${right},${bottom}`,
      bounded: "1",
      addressdetails: "1",
      "accept-language": "en",
    });

    const response = await fetchWithTimeout(
      `${NOMINATIM_URL}/search?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
      7000
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return (data || [])
      .map((item, index) => {
        const itemLat = Number(item.lat);
        const itemLon = Number(item.lon);

        if (
          !Number.isFinite(itemLat) ||
          !Number.isFinite(itemLon)
        ) {
          return null;
        }

        const distance = calculateDistance(
          lat,
          lon,
          itemLat,
          itemLon
        );

        return {
          id: `nominatim-${type}-${item.place_id || index}`,
          name:
            item.display_name?.split(",")[0] ||
            (type === "pharmacy"
              ? "Pharmacy"
              : "Hospital"),
          type:
            type === "pharmacy"
              ? "pharmacy"
              : "hospital",
          lat: itemLat,
          lon: itemLon,
          phone: "",
          website: "",
          address: item.display_name || "",
          distance,
          openingHours: "",
          speciality: "",
          source: "OpenStreetMap Search",
        };
      })
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

/* =========================================================
   COMPLETE FACILITY SEARCH WITH FALLBACKS
========================================================= */

async function findNearbyFacilities(lat, lon) {
  // First attempt: 7 km
  let facilities = await searchOverpass(
    lat,
    lon,
    7000
  );

  if (facilities.length > 0) {
    return deduplicateFacilities(facilities);
  }

  // Second attempt: 15 km
  facilities = await searchOverpass(
    lat,
    lon,
    15000
  );

  if (facilities.length > 0) {
    return deduplicateFacilities(facilities);
  }

  // Third attempt: Nominatim POI fallback
  const hospitals = await searchNominatimFacilities(
    lat,
    lon,
    "hospital"
  );

  const pharmacies = await searchNominatimFacilities(
    lat,
    lon,
    "pharmacy"
  );

  const combined = [
    ...hospitals,
    ...pharmacies,
  ];

  return deduplicateFacilities(combined);
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function EmergencyMode() {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);

  const [locationText, setLocationText] =
    useState("");

  const [searchLocation, setSearchLocation] =
    useState("");

  const [facilities, setFacilities] =
    useState([]);

  const [loadingLocation, setLoadingLocation] =
    useState(false);

  const [loadingFacilities, setLoadingFacilities] =
    useState(false);

  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] =
    useState("all");

  const [searchPerformed, setSearchPerformed] =
    useState(false);

  /* =====================================================
     EMERGENCY CALL
  ===================================================== */

  const callEmergency = () => {
    window.location.href = "tel:112";
  };

  /* =====================================================
     SEARCH LOCATION
  ===================================================== */

  const searchForLocation = async () => {
    const query = searchLocation.trim();

    if (!query) {
      setError(
        "Please enter a city, locality, address or location."
      );
      return;
    }

    setLoadingLocation(true);
    setLoadingFacilities(false);
    setError("");
    setFacilities([]);
    setSearchPerformed(true);

    try {
      /* -----------------------------------------------
         OPTION 1: COORDINATES
      ------------------------------------------------ */

      const coordinates = extractCoordinates(query);

      if (coordinates) {
        const { lat, lon } = coordinates;

        let displayName = `${lat.toFixed(
          5
        )}, ${lon.toFixed(5)}`;

        try {
          const reverse = await reverseGeocode(
            lat,
            lon
          );

          if (reverse?.display_name) {
            displayName = reverse.display_name;
          }
        } catch {
          // Coordinates are still valid even if reverse geocoding fails.
        }

        setLocation({
          lat,
          lon,
        });

        setLocationText(displayName);

        setLoadingLocation(false);
        setLoadingFacilities(true);

        const found = await findNearbyFacilities(
          lat,
          lon
        );

        setFacilities(found);
        setLoadingFacilities(false);

        if (found.length === 0) {
          setError(
            "We couldn't load nearby facilities from our map database. You can use the Google Maps buttons below to search nearby hospitals or pharmacies."
          );
        }

        return;
      }

      /* -----------------------------------------------
         OPTION 2: NORMAL ADDRESS / LOCALITY SEARCH
      ------------------------------------------------ */

      let results = [];

      try {
        results = await searchNominatim(
          query,
          5
        );
      } catch {
        results = [];
      }

      /* -----------------------------------------------
         SECOND SEARCH WITH INDIA
      ------------------------------------------------ */

      if (
        results.length === 0 &&
        !/\bindia\b/i.test(query)
      ) {
        try {
          results = await searchNominatim(
            `${query}, India`,
            5
          );
        } catch {
          results = [];
        }
      }

      if (!results.length) {
        throw new Error(
          "Location not found. Try entering a fuller address, such as locality + city."
        );
      }

      /* -----------------------------------------------
         PICK BEST INDIA RESULT
      ------------------------------------------------ */

      const indiaResults = results.filter(
        (item) =>
          item?.address?.country_code === "in"
      );

      const selected =
        indiaResults[0] || results[0];

      const lat = Number(selected.lat);
      const lon = Number(selected.lon);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ) {
        throw new Error(
          "The location result did not contain valid coordinates."
        );
      }

      setLocation({
        lat,
        lon,
      });

      setLocationText(
        selected.display_name ||
          query
      );

      setLoadingLocation(false);
      setLoadingFacilities(true);

      /* -----------------------------------------------
         FACILITY SEARCH
      ------------------------------------------------ */

      const found = await findNearbyFacilities(
        lat,
        lon
      );

      setFacilities(found);
      setLoadingFacilities(false);

      if (found.length === 0) {
        setError(
          "We couldn't load nearby facilities from our map database. You can use the Google Maps buttons below to search nearby hospitals or pharmacies."
        );
      }
    } catch (err) {
      console.error(err);

      setLoadingLocation(false);
      setLoadingFacilities(false);

      setError(
        err?.message ||
          "Unable to find this location. Please try again."
      );
    }
  };

  /* =====================================================
     USE MY LOCATION
  ===================================================== */

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by this browser."
      );
      return;
    }

    setLoadingLocation(true);
    setLoadingFacilities(false);
    setError("");
    setFacilities([]);
    setSearchPerformed(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat =
            position.coords.latitude;

          const lon =
            position.coords.longitude;

          setLocation({
            lat,
            lon,
          });

          let displayName =
            "Current location";

          try {
            const reverse =
              await reverseGeocode(
                lat,
                lon
              );

            if (reverse?.display_name) {
              displayName =
                reverse.display_name;
            }
          } catch {
            // Keep current location label.
          }

          setLocationText(displayName);

          setLoadingLocation(false);
          setLoadingFacilities(true);

          const found =
            await findNearbyFacilities(
              lat,
              lon
            );

          setFacilities(found);
          setLoadingFacilities(false);

          if (found.length === 0) {
            setError(
              "We couldn't load nearby facilities from our map database. You can use the Google Maps buttons below to search nearby hospitals or pharmacies."
            );
          }
        } catch (err) {
          console.error(err);

          setLoadingLocation(false);
          setLoadingFacilities(false);

          setError(
            "Unable to load nearby facilities."
          );
        }
      },
      (geoError) => {
        setLoadingLocation(false);

        if (
          geoError.code ===
          geoError.PERMISSION_DENIED
        ) {
          setError(
            "Location permission was denied. Please enter your location manually."
          );
        } else {
          setError(
            "Unable to access your current location. Please enter it manually."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  /* =====================================================
     REFRESH FACILITIES
  ===================================================== */

  const refreshFacilities = async () => {
    if (!location) return;

    setLoadingFacilities(true);
    setError("");

    try {
      const found =
        await findNearbyFacilities(
          location.lat,
          location.lon
        );

      setFacilities(found);

      if (found.length === 0) {
        setError(
          "No facilities were returned by the available map databases. You can use the Google Maps search buttons below."
        );
      }
    } catch {
      setError(
        "Unable to refresh nearby facilities."
      );
    } finally {
      setLoadingFacilities(false);
    }
  };

  /* =====================================================
     GOOGLE MAPS FALLBACK
  ===================================================== */

  const openGoogleMaps = (type) => {
    if (!location) return;

    const searchText =
      type === "hospital"
        ? "hospitals"
        : "pharmacies";

    const url =
      `https://www.google.com/maps/search/?api=1&query=` +
      encodeURIComponent(
        `${searchText} near ${location.lat},${location.lon}`
      );

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredFacilities =
    activeFilter === "all"
      ? facilities
      : facilities.filter(
          (facility) =>
            facility.type === activeFilter
        );

  /* =====================================================
     FACILITY ICON
  ===================================================== */

  const getFacilityIcon = (type) => {
    if (type === "pharmacy") {
      return pharmacyIcon;
    }

    if (type === "clinic") {
      return clinicIcon;
    }

    return hospitalIcon;
  };

  /* =====================================================
     FACILITY LABEL
  ===================================================== */

  const getFacilityLabel = (type) => {
    if (type === "pharmacy") {
      return "Pharmacy";
    }

    if (type === "clinic") {
      return "Clinic";
    }

    return "Hospital";
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <HeartPulse size={24} />
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold">
                MediAI
              </h1>
              <p className="text-xs text-slate-500">
                Emergency Mode
              </p>
            </div>
          </button>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={17} />
            Back
          </button>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            EMERGENCY BANNER
        ================================================= */}

        <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white shadow-xl shadow-red-200">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <ShieldAlert size={30} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Need Emergency Help?
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-red-100">
                  If someone is experiencing a life-threatening
                  emergency, call emergency services immediately.
                  MediAI's facility search is only a support tool.
                </p>
              </div>
            </div>

            <button
              onClick={callEmergency}
              className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-red-600 shadow-lg transition hover:scale-[1.02] hover:bg-red-50"
            >
              <Phone size={20} />
              Call 112
            </button>
          </div>
        </section>

        {/* =================================================
            LOCATION SEARCH
        ================================================= */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <MapPin className="text-blue-600" size={22} />
              Find Emergency Facilities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter a locality, city, full address, or paste a location.
              This works across India.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchLocation}
                onChange={(e) =>
                  setSearchLocation(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchForLocation();
                  }
                }}
                placeholder="Example: Fatehgunj, Vadodara"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              onClick={searchForLocation}
              disabled={loadingLocation}
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingLocation ? (
                <>
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                  Finding...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find Location
                </>
              )}
            </button>

            <button
              onClick={getLocation}
              disabled={loadingLocation}
              className="flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LocateFixed size={18} />
              Use My Location
            </button>
          </div>

          {locationText && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">
              <Navigation
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  Selected location
                </p>

                <p className="mt-1 leading-5">
                  {locationText}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertTriangle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <p className="leading-6">
                {error}
              </p>
            </div>
          )}
        </section>

        {/* =================================================
            MAP
        ================================================= */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Nearby Healthcare Map
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Hospitals, pharmacies and clinics around the selected location.
              </p>
            </div>

            {location && (
              <button
                onClick={refreshFacilities}
                disabled={loadingFacilities}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={
                    loadingFacilities
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>
            )}
          </div>

          <div className="h-[450px] w-full">
            <MapContainer
              center={
                location
                  ? [
                      location.lat,
                      location.lon,
                    ]
                  : [22.3072, 73.1812]
              }
              zoom={location ? 14 : 12}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {location && (
                <>
                  <MapCenter
                    position={[
                      location.lat,
                      location.lon,
                    ]}
                  />

                  <Marker
                    position={[
                      location.lat,
                      location.lon,
                    ]}
                    icon={userIcon}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>
                          Selected Location
                        </strong>

                        <br />

                        {locationText ||
                          "Your location"}
                      </div>
                    </Popup>
                  </Marker>
                </>
              )}

              {filteredFacilities.map(
                (facility) => (
                  <Marker
                    key={facility.id}
                    position={[
                      facility.lat,
                      facility.lon,
                    ]}
                    icon={getFacilityIcon(
                      facility.type
                    )}
                  >
                    <Popup>
                      <div className="min-w-[210px]">
                        <p className="font-bold text-slate-900">
                          {facility.name}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-blue-600">
                          {getFacilityLabel(
                            facility.type
                          )}
                        </p>

                        <p className="mt-2 text-xs text-slate-600">
                          {facility.distance.toFixed(
                            1
                          )} km away
                        </p>

                        {facility.address && (
                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            {facility.address}
                          </p>
                        )}

                        {facility.phone ? (
                          <a
                            href={`tel:${facility.phone}`}
                            className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-600"
                          >
                            <Phone size={13} />
                            {facility.phone}
                          </a>
                        ) : (
                          <p className="mt-3 text-xs text-slate-400">
                            Public phone number unavailable
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )
              )}
            </MapContainer>
          </div>
        </section>

        {/* =================================================
            FACILITY SECTION
        ================================================= */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Nearby Facilities
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {facilities.length > 0
                  ? `${facilities.length} mapped facilities found`
                  : "Search for healthcare facilities near your selected location."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  key: "all",
                  label: "All",
                },
                {
                  key: "hospital",
                  label: "Hospitals",
                },
                {
                  key: "pharmacy",
                  label: "Pharmacies",
                },
                {
                  key: "clinic",
                  label: "Clinics",
                },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() =>
                    setActiveFilter(
                      filter.key
                    )
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    activeFilter ===
                    filter.key
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {(loadingLocation ||
            loadingFacilities) && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
              <RefreshCw
                size={30}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 font-semibold text-blue-900">
                Searching nearby healthcare facilities...
              </p>

              <p className="mt-1 text-sm text-blue-700">
                We're checking multiple map sources.
              </p>
            </div>
          )}

          {/* =================================================
              FACILITY CARDS
          ================================================= */}

          {!loadingLocation &&
            !loadingFacilities &&
            filteredFacilities.length >
              0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredFacilities.map(
                  (facility) => (
                    <div
                      key={facility.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            facility.type ===
                            "pharmacy"
                              ? "bg-emerald-100 text-emerald-600"
                              : facility.type ===
                                "clinic"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {facility.type ===
                          "pharmacy" ? (
                            <Pill size={23} />
                          ) : facility.type ===
                            "clinic" ? (
                            <Building2
                              size={23}
                            />
                          ) : (
                            <Hospital
                              size={23}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-bold text-slate-900">
                                {facility.name}
                              </h3>

                              <p className="mt-1 text-xs font-semibold text-blue-600">
                                {getFacilityLabel(
                                  facility.type
                                )}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                              {facility.distance.toFixed(
                                1
                              )}{" "}
                              km
                            </span>
                          </div>

                          {facility.address && (
                            <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                              <MapPin
                                size={16}
                                className="mt-0.5 shrink-0"
                              />

                              <span>
                                {
                                  facility.address
                                }
                              </span>
                            </div>
                          )}

                          {facility.openingHours && (
                            <p className="mt-2 text-xs text-slate-500">
                              Hours:{" "}
                              {
                                facility.openingHours
                              }
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            {facility.phone ? (
                              <a
                                href={`tel:${facility.phone}`}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                              >
                                <Phone
                                  size={14}
                                />
                                Call
                              </a>
                            ) : (
                              <span className="rounded-xl bg-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-500">
                                Phone unavailable
                              </span>
                            )}

                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                            >
                              <Navigation
                                size={14}
                              />
                              Directions
                            </a>

                            {facility.website && (
                              <a
                                href={
                                  facility.website
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                              >
                                <ExternalLink
                                  size={14}
                                />
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

          {/* =================================================
              NO FACILITIES / GOOGLE FALLBACK
          ================================================= */}

          {!loadingLocation &&
            !loadingFacilities &&
            filteredFacilities.length ===
              0 &&
            searchPerformed && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <AlertTriangle
                      size={24}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-amber-900">
                      We couldn't load nearby facilities
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      This does not mean there are no
                      hospitals or pharmacies nearby. The
                      open map databases used by MediAI may
                      not have returned facilities for this
                      location.
                    </p>
                  </div>
                </div>

                {location && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() =>
                        openGoogleMaps(
                          "hospital"
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50"
                    >
                      <Hospital size={19} />
                      Search Hospitals
                      <ExternalLink
                        size={15}
                      />
                    </button>

                    <button
                      onClick={() =>
                        openGoogleMaps(
                          "pharmacy"
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-emerald-600 shadow-sm transition hover:bg-emerald-50"
                    >
                      <Pill size={19} />
                      Search Pharmacies
                      <ExternalLink
                        size={15}
                      />
                    </button>
                  </div>
                )}
              </div>
            )}

          {/* =================================================
              INITIAL STATE
          ================================================= */}

          {!loadingLocation &&
            !loadingFacilities &&
            !searchPerformed && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <MapPin size={30} />
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  Search your location
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Enter any Indian locality, city or full
                  address to find nearby emergency healthcare
                  facilities.
                </p>
              </div>
            )}
        </section>

        {/* =================================================
            EMERGENCY NUMBERS
        ================================================= */}

        <section className="mt-6">
          <h2 className="mb-4 text-xl font-bold">
            Important Emergency Numbers
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "112",
                title: "Emergency",
                description:
                  "National emergency number",
              },
              {
                number: "108",
                title: "Ambulance",
                description:
                  "Emergency ambulance service",
              },
              {
                number: "100",
                title: "Police",
                description:
                  "Police emergency assistance",
              },
              {
                number: "101",
                title: "Fire",
                description:
                  "Fire and rescue emergency",
              },
            ].map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black text-slate-900">
                      {item.number}
                    </p>

                    <p className="mt-1 font-bold text-slate-700">
                      {item.title}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                    <Phone size={20} />
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* =================================================
            DISCLAIMER
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-center text-xs leading-5 text-slate-500">
          MediAI's emergency facility search uses publicly
          available map data and search services. Facility
          information, phone numbers and opening hours may be
          incomplete or outdated. In a life-threatening
          emergency, call <strong>112</strong> or your local
          emergency service immediately.
        </div>
      </main>
    </div>
  );
}