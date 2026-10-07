import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
    const [originalUrl, setOriginalUrl] = useState("");
    const [expiration, setExpiration] = useState("none");
    const [shortUrl, setShortUrl] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const createShortUrl = async (event) => {
        event.preventDefault();

        setError("");
        setSuccessMessage("");
        setShortUrl("");
        setShortCode("");
        setAnalytics(null);

        if (!originalUrl.trim()) {
            setError("Please enter a URL.");
            return;
        }

        try {
            setLoading(true);

            const expiresAt =
                expiration === "none"
                    ? null
                    : new Date(
                          Date.now() +
                              Number(expiration) * 60 * 1000
                      ).toISOString();

            const response = await fetch(
                `${API_URL}/api/urls`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        originalUrl: originalUrl.trim(),
                        expiresAt
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create short URL"
                );
            }

            setShortUrl(data.data.shortUrl);
            setShortCode(data.data.shortCode);
            setAnalytics(data.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        if (!shortCode) {
            return;
        }

        try {
            setAnalyticsLoading(true);
            setError("");
            setSuccessMessage("");

            const response = await fetch(
                `${API_URL}/api/urls/${shortCode}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch analytics"
                );
            }

            setAnalytics(data.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const deleteUrl = async () => {
        if (!shortCode) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this short URL?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(true);
            setError("");
            setSuccessMessage("");

            const response = await fetch(
                `${API_URL}/api/urls/${shortCode}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete short URL"
                );
            }

            setSuccessMessage(
                "Short URL deleted successfully."
            );

            setShortUrl("");
            setShortCode("");
            setAnalytics(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="app">
            <div className="container">
                <div className="hero">
                    <p className="badge">
                        FAST • SIMPLE • RELIABLE
                    </p>

                    <h1>Shorten your URLs.</h1>

                    <p className="subtitle">
                        Create short, shareable links with click
                        analytics and automatic expiration.
                    </p>
                </div>

                <form
                    className="url-form"
                    onSubmit={createShortUrl}
                >
                    <input
                        type="url"
                        placeholder="https://example.com/your-long-url"
                        value={originalUrl}
                        onChange={(event) =>
                            setOriginalUrl(event.target.value)
                        }
                    />

                    <select
                        value={expiration}
                        onChange={(event) =>
                            setExpiration(event.target.value)
                        }
                        className="expiration-select"
                    >
                        <option value="none">
                            No expiration
                        </option>

                        <option value="30">
                            30 minutes
                        </option>

                        <option value="60">
                            1 hour
                        </option>

                        <option value="1440">
                            1 day
                        </option>

                        <option value="10080">
                            7 days
                        </option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Shorten URL"}
                    </button>
                </form>

                {error && (
                    <div className="message error">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="message success">
                        {successMessage}
                    </div>
                )}

                {shortUrl && (
                    <div className="message success">
                        <span>
                            Your short URL is ready:
                        </span>

                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {shortUrl}
                        </a>
                    </div>
                )}

                {analytics && (
                    <div className="analytics">
                        <div className="analytics-header">
                            <div>
                                <p className="analytics-label">
                                    URL ANALYTICS
                                </p>

                                <h2>
                                    Link performance
                                </h2>
                            </div>

                            <div className="analytics-actions">
                                <button
                                    className="refresh-button"
                                    onClick={fetchAnalytics}
                                    disabled={
                                        analyticsLoading ||
                                        deleteLoading
                                    }
                                >
                                    {analyticsLoading
                                        ? "Refreshing..."
                                        : "Refresh"}
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={deleteUrl}
                                    disabled={
                                        analyticsLoading ||
                                        deleteLoading
                                    }
                                >
                                    {deleteLoading
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </div>

                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <span>Clicks</span>

                                <strong>
                                    {analytics.clickCount}
                                </strong>
                            </div>

                            <div className="analytics-card">
                                <span>Short Code</span>

                                <strong>
                                    {analytics.shortCode}
                                </strong>
                            </div>

                            <div className="analytics-card">
                                <span>Created</span>

                                <strong>
                                    {new Date(
                                        analytics.createdAt
                                    ).toLocaleString()}
                                </strong>
                            </div>

                            <div className="analytics-card">
                                <span>Last Accessed</span>

                                <strong>
                                    {analytics.lastAccessedAt
                                        ? new Date(
                                              analytics.lastAccessedAt
                                          ).toLocaleString()
                                        : "Not accessed yet"}
                                </strong>
                            </div>

                            <div className="analytics-card">
                                <span>Expiration</span>

                                <strong>
                                    {analytics.expiresAt
                                        ? new Date(
                                              analytics.expiresAt
                                          ).toLocaleString()
                                        : "Never"}
                                </strong>
                            </div>
                        </div>
                    </div>
                )}

                <div className="features">
                    <div className="feature">
                        <h3>Fast Redirects</h3>

                        <p>
                            Redis caching helps deliver quick
                            redirects.
                        </p>
                    </div>

                    <div className="feature">
                        <h3>Click Analytics</h3>

                        <p>
                            Track clicks and the latest access
                            time.
                        </p>
                    </div>

                    <div className="feature">
                        <h3>Expiration</h3>

                        <p>
                            Create links that automatically
                            expire.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;