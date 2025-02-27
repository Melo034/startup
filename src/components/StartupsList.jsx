import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StartupsList = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visibleCount, setVisibleCount] = useState(9);
    const showMore = () => setVisibleCount(startups.length);

    useEffect(() => {
        fetch('https://my-json-server.typicode.com/Melo034/startups/startups') // Update URL if using my-json-server
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch startups');
                return response.json();
            })
            .then(data => {
                setStartups(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

    return (
        <section className="py-28 mx-auto px-4 max-w-screen-xl md:px-8">
            <div className="text-center">
                <h1 className="text-3xl text-neutral-200 font-semibold">
                    Startups
                </h1>
                <p className="mt-3 text-neutral-500">
                    Startups that are loved by the community. Updated every hour.
                </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {startups.slice(0, visibleCount).map((startup) => (
                    <div
                        className="max-w-screen-xl mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm border-neutral-800 bg-gradient-to-bl from-neutral-800 via-neutral-900 to-neutral-950"
                        key={startup.id}
                    >
                        <div>
                            <img
                                src={
                                    startup.image
                                        ? `https://my-json-server.typicode.com/Melo034/startups/images/${startup.image}`
                                        : "https://my-json-server.typicode.com/Melo034/startups/images/placeholder.jpg"
                                }
                                loading="lazy"
                                alt={startup.name}
                                className="w-full h-48 object-cover rounded-t-md"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-[#DA1212]">{startup.name}</h2>
                                <p className="text-neutral-300 text-sm mt-3">{startup.description}</p>
                                <div className="flex justify-center mt-4">
                                    <Link
                                        to={`/startups/${startup.id}`}
                                        className="bg-[#DA1212] text-white px-4 py-2 rounded hover:bg-[#DA1212]"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {visibleCount < startups.length && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={showMore}
                        className="bg-[#DA1212] text-white px-6 py-2 rounded hover:bg-[#DA1212]"
                    >
                        Show More
                    </button>
                </div>
            )}
        </section>
    );
}

export default StartupsList;