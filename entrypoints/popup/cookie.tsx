import React, { useEffect, useState } from "react";

export interface Cookie {
  domain: string;
  expirationDate?: number;
  hostOnly: boolean;
  httpOnly: boolean;
  name: string;
  path: string;
  sameSite: "no_restriction" | "lax" | "strict" | "unspecified";
  secure: boolean;
  session: boolean;
  storeId: string;
  value: string;
}

export interface CookieFilter {
  domain?: string;
  name?: string;
  path?: string;
  secure?: boolean;
  session?: boolean;
  storeId?: string;
  url?: string;
}

const CookieManager: React.FC = () => {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CookieFilter>({});
  const [filterDomain, setFilterDomain] = useState<string>("");
  const [filterName, setFilterName] = useState<string>("");
  const [showSecureOnly, setShowSecureOnly] = useState<boolean>(false);
  const [showSessionOnly, setShowSessionOnly] = useState<boolean>(false);

  const fetchAllCookies = async (filterOptions: CookieFilter = {}) => {
    setLoading(true);
    setError(null);

    try {
      const allCookies = await chrome.cookies.getAll(filterOptions);
      setCookies(allCookies as Cookie[]);
    } catch (err) {
      console.error("Error fetching cookies:", err);
      setError("Failed to retrieve cookies. Please check permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCookies();
  }, []);

  const applyFilters = () => {
    const newFilter: CookieFilter = {};

    if (filterDomain) newFilter.domain = filterDomain;
    if (filterName) newFilter.name = filterName;
    if (showSecureOnly) newFilter.secure = true;
    if (showSessionOnly) newFilter.session = true;

    setFilter(newFilter);
    fetchAllCookies(newFilter);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Session Cookie";
    return new Date(timestamp * 1000).toLocaleString();
  };
  const deleteCookie = async (cookie: Cookie) => {
    const url = `${cookie.secure ? "https" : "http"}://${cookie.domain}${cookie.path}`;

    try {
      await chrome.cookies.remove({
        url,
        name: cookie.name,
        storeId: cookie.storeId,
      });

      // Refresh the cookie list
      fetchAllCookies(filter);
    } catch (err) {
      console.error("Error deleting cookie:", err);
      setError("Failed to delete cookie.");
    }
  };

  return (
    <div className="p-4 w-96">
      <h1 className="text-xl font-bold mb-4">Cookie Manager</h1>

      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Filter Cookies</h2>

        <div className="mb-2">
          <label className="block text-sm">Domain contains:</label>
          <input
            type="text"
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="w-full p-1 border rounded text-sm"
            placeholder="e.g. example.com"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm">Cookie name contains:</label>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full p-1 border rounded text-sm"
            placeholder="e.g. session"
          />
        </div>

        <div className="flex space-x-4 mb-2">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={showSecureOnly}
              onChange={(e) => setShowSecureOnly(e.target.checked)}
              className="mr-1"
            />
            Secure only
          </label>

          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={showSessionOnly}
              onChange={(e) => setShowSessionOnly(e.target.checked)}
              className="mr-1"
            />
            Session only
          </label>
        </div>

        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading cookies...</div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Cookies ({cookies.length})</h2>
            <button
              onClick={() => fetchAllCookies(filter)}
              className="text-sm text-blue-500 hover:underline"
            >
              Refresh
            </button>
          </div>

          {cookies.length === 0 ? (
            <p className="text-gray-500 italic">
              No cookies found matching your criteria.
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto border rounded">
              {cookies.map((cookie, index) => (
                <div
                  key={`${cookie.domain}-${cookie.name}-${index}`}
                  className="p-2 border-b last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{cookie.name}</div>
                    <button
                      onClick={() => deleteCookie(cookie)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 mt-1">
                    <div>
                      <span className="font-semibold">Domain:</span>{" "}
                      {cookie.domain}
                    </div>
                    <div>
                      <span className="font-semibold">Path:</span> {cookie.path}
                    </div>
                    <div>
                      <span className="font-semibold">Value:</span>{" "}
                      {cookie.value.length > 20
                        ? `${cookie.value.substring(0, 20)}...`
                        : cookie.value}
                    </div>
                    <div>
                      <span className="font-semibold">Expires:</span>{" "}
                      {formatDate(cookie.expirationDate)}
                    </div>
                    <div className="flex space-x-2">
                      {cookie.secure && (
                        <span className="bg-green-100 text-green-800 px-1 rounded">
                          Secure
                        </span>
                      )}
                      {cookie.httpOnly && (
                        <span className="bg-blue-100 text-blue-800 px-1 rounded">
                          HttpOnly
                        </span>
                      )}
                      {cookie.sameSite !== "no_restriction" && (
                        <span className="bg-purple-100 text-purple-800 px-1 rounded">
                          SameSite: {cookie.sameSite}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CookieManager;
