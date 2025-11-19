// src/components/Navbar.tsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  setQuery,
  setCities,
  setCityCoordinates,
} from "../../features/citySlice";
import axios from "axios";
import { User } from "../../types/user";

type NavbarProps = { 
  user?: User | string;
  children?: React.ReactNode;
};

function Navbar({ user, children }: NavbarProps) {
  const dispatch = useDispatch();

  const query = useSelector((s: RootState) => s.city.query);
  const cities = useSelector((s: RootState) => s.city.cities);

  const [loading, setLoading] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const debounceTimeout = useRef<number | null>(null);
  const cacheRef = useRef<Record<string, any[]>>({});
  const mounted = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // ------------- CLOSE DROPDOWN WHEN CLICK OUTSIDE --------------
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ------------- FETCH TURFS NEAR A LOCATION --------------
  const fetchTurfsNear = async (lat: number, lon: number) => {
    setNearbyLoading(true);
    try {
      await axios.get("/api/turfs", { params: { lat, lon } });
    } catch (e) {
      console.error("fetchTurfsNear error", e);
    } finally {
      if (mounted.current) setNearbyLoading(false);
    }
  };

  // ------------- ON MOUNT: GEOLOCATION --------------
  useEffect(() => {
    mounted.current = true;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          dispatch(setCityCoordinates({ lat, lon }));
          fetchTurfsNear(lat, lon);
        },
        (err) => console.warn("Geolocation error:", err),
        { maximumAge: 60000, timeout: 10000 }
      );
    }

    return () => {
      mounted.current = false;
      if (debounceTimeout.current) window.clearTimeout(debounceTimeout.current);
    };
  }, [dispatch]);

  // ------------- SEARCH FUNCTION --------------
  const handleSearch = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      dispatch(setCities([]));
      return;
    }

    // check cache
    if (cacheRef.current[trimmed]) {
      dispatch(setCities(cacheRef.current[trimmed]));
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: trimmed,
            format: "json",
            addressdetails: 1,
            countrycodes: "in", // ONLY INDIA
            limit: 20,
          },
        }
      );

      cacheRef.current[trimmed] = data;
      dispatch(setCities(data));
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  // ------------- INPUT CHANGE HANDLER (DEBOUNCE) --------------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    dispatch(setQuery(value)); // store value

    if (debounceTimeout.current) window.clearTimeout(debounceTimeout.current);

    debounceTimeout.current = window.setTimeout(() => {
      handleSearch(value);
      setOpenDropdown(true);
    }, 450);
  };

  // ------------- WHEN USER CLICKS A CITY --------------
  const handleCitySelect = (city: any) => {
    dispatch(setQuery(city.display_name));

    const lat = Number(city.lat);
    const lon = Number(city.lon);
    dispatch(setCityCoordinates({ lat, lon }));

    setOpenDropdown(false);

    fetchTurfsNear(lat, lon);
  };

  return (
 <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-md w-full">

  {/* LEFT + CENTER */}
  <div className="flex items-center gap-20 flex-1" ref={containerRef}>

    {/* LOGO */}
    <div className="text-lg font-bold text-blue-600 cursor-pointer">
      7Jeno
    </div>

    {/* SEARCH */}
    <div className="flex flex-col w-[600px] relative">
      <input
        type="text"
        className="border px-3 py-2 rounded-md shadow-sm w-full focus:ring-2 focus:ring-blue-300"
        placeholder="Search cities..."
        value={query}
        onChange={handleInputChange}
        onFocus={() => cities.length > 0 && setOpenDropdown(true)}
      />

      {openDropdown && cities.length > 0 && (
        <div className="absolute top-[110%] left-0 w-full max-h-[300px] overflow-auto bg-white border shadow-lg rounded-md z-20">
          {cities.map((city: any, idx: number) => (
            <div
              key={idx}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCitySelect(city)}
            >
              {city.display_name}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute top-[110%] left-0 w-full bg-white px-3 py-2 shadow-md">
          Loading...
        </div>
      )}
    </div>
  </div>

  {/* RIGHT SIDE → Profile Menu */}
  <div className="flex items-center ml-4">
    {children}
  </div>

</nav>
  );
}

export default Navbar;
