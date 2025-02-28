import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, getDocs } from '../server/firebase';

const StartupsList = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visibleCount, setVisibleCount] = useState(9);
    const showMore = () => setVisibleCount(startups.length);

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "startups"));
                const startupsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setStartups(startupsList);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch startups');
                setLoading(false);
                throw error
            }
        };

        fetchStartups();
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
            <div className="mt-12 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {startups.slice(0, visibleCount).map((startup) => (
                    <div
                        className="max-w-full mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm border-neutral-800 bg-gradient-to-bl from-neutral-800 via-neutral-900 to-neutral-950 
            flex flex-col justify-between h-[350px] w-full"
                        key={startup.id}
                    >
                        {/* Image */}
                        <img
                            src={startup.imageUrl ? `/images/${startup.imageUrl}` : '/images/placeholder.jpg'}
                            loading="lazy"
                            alt={startup.name}
                            className="w-full h-48 rounded-t-md object-cover"
                        />

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <h2 className="text-lg font-semibold text-[#DA1212] line-clamp-1">{startup.name}</h2>
                            <p className="text-neutral-300 text-sm mt-3 line-clamp-3">{startup.description}</p>
                        </div>

                        {/* Button */}
                        <div className="flex justify-center p-4 mt-auto">
                            <Link
                                to={`/startups/${startup.id}`}
                                className="bg-[#DA1212] text-white px-6 py-2 rounded hover:bg-[#DA1212] transition-all duration-300"
                            >
                                View Details
                            </Link>
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