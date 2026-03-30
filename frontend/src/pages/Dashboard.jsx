import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("browse");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/properties/get-properties");
      setProperties(res.data);
    } catch (err) {
      setError("Failed to load properties.");
    }
  };

  const fetchFavourites = async () => {
    try {
      const res = await api.get("/favourites/get-favourites");
      setFavourites(res.data);
    } catch (err) {
      setError("Failed to load favourites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchFavourites();
  }, []);

  const isFavourited = (propertyId) =>
    favourites.some((f) => Number(f.propertyId) === Number(propertyId));

  const handleAdd = async (propertyId) => {
    setActionLoading(propertyId);
    try {
      await api.post("/favourites/add-favourite", { propertyId });
      await fetchFavourites();
      toast.success("Added to favourites!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add favourite.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (propertyId) => {
    setActionLoading(propertyId);
    try {
      await api.delete("/favourites/remove-favourite", {
        data: { propertyId },
      });
      await fetchFavourites();
      toast.success("Removed from favourites.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove favourite.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const PropertyTable = ({ data, isFavouritesTab }) => (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4 font-medium">Title</th>
            <th className="px-6 py-4 font-medium">Location</th>
            <th className="px-6 py-4 font-medium">Type</th>
            <th className="px-6 py-4 font-medium">Price</th>
            <th className="px-6 py-4 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((property) => {
            const faved = isFavourited(property.propertyId);
            const busy = actionLoading === property.propertyId;

            return (
              <tr
                key={property.propertyId}
                className="bg-white hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  {property.title}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {property.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {property.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {property.price}
                </td>
                <td className="px-6 py-4 text-right">
                  {isFavouritesTab ? (
                    <button
                      onClick={() => handleRemove(property.propertyId)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {busy ? (
                        <>
                          <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Remove
                        </>
                      )}
                    </button>
                  ) : faved ? (
                    <button
                      onClick={() => handleRemove(property.propertyId)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {busy ? (
                        <>
                          <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>♥ Remove</>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAdd(property.propertyId)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {busy ? (
                        <>
                          <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>♡ Favourite</>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/*Navbar*/}
      <nav className="bg-[#0C172C] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">
              Buyer Portal
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium leading-none capitalize">
                    {user.name}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/*Welcome Banner*/}
        {user && (
          <div className="bg-[#0C172C] rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">
                Welcome back, {user.name}!
              </h1>
              <p className="text-slate-400 text-sm mt-1">{user.email}</p>
            </div>
            <div className="hidden sm:flex gap-4">
              <div className="text-center bg-white/10 rounded-xl px-5 py-3">
                <p className="text-2xl font-bold text-white">
                  {properties.length}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">Properties</p>
              </div>
              <div className="text-center bg-white/10 rounded-xl px-5 py-3">
                <p className="text-2xl font-bold text-purple-400">
                  {favourites.length}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">Favourites</p>
              </div>
            </div>
          </div>
        )}

        {/*Tabs*/}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-6">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === "browse"
                ? "bg-[#0C172C] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Browse Properties
          </button>
          <button
            onClick={() => setActiveTab("favourites")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "favourites"
                ? "bg-[#0C172C] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            My Favourites
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === "favourites"
                  ? "bg-purple-500 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {favourites.length}
            </span>
          </button>
        </div>

        {/*Browse Tab*/}
        {activeTab === "browse" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                All Properties
              </h2>
              <span className="text-sm text-slate-400">
                {properties.length} listings
              </span>
            </div>
            {properties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
                <svg
                  className="w-12 h-12 text-slate-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <p className="text-slate-400 text-sm">No properties found.</p>
              </div>
            ) : (
              <PropertyTable data={properties} isFavouritesTab={false} />
            )}
          </div>
        )}

        {/*Favourites Tab*/}
        {activeTab === "favourites" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                My Favourites
              </h2>
              <span className="text-sm text-slate-400">
                {favourites.length} saved
              </span>
            </div>
            {favourites.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
                <svg
                  className="w-12 h-12 text-slate-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <p className="text-slate-400 text-sm">No favourites yet.</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-3 text-purple-600 text-sm font-medium hover:underline cursor-pointer"
                >
                  Browse properties →
                </button>
              </div>
            ) : (
              <PropertyTable data={favourites} isFavouritesTab={true} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
