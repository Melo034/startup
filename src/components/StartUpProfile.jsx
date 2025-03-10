import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import ReviewForm from './ReviewForm';
import facebook from "../assets/icons8-facebook-48.png"
import instagram from "../assets/icons8-instagram-48.png"
import { db, collection, getDoc, doc, query, where, getDocs } from '../server/firebase';

const StartUpProfile = () => {
    const { id } = useParams();
    const [startup, setStartup] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch startup details
        const fetchStartupData = async () => {
            try {
                const startupDocRef = doc(db, 'startups', id);
                const startupDocSnap = await getDoc(startupDocRef);
                if (startupDocSnap.exists()) {
                    setStartup(startupDocSnap.data());
                } else {
                    setError('Startup not found');
                }
            } catch (err) {
                setError('Failed to fetch startup data');
                throw err
            }
        };

        // Fetch reviews
        const fetchReviewsData = async () => {
            try {
                const reviewsQuery = query(collection(db, 'reviews'), where('startupId', '==', id));
                const querySnapshot = await getDocs(reviewsQuery);
                const reviewsData = querySnapshot.docs.map(doc => doc.data());
                setReviews(reviewsData);
            } catch (err) {
                setError('Failed to fetch reviews');
                throw err
            }
        };

        // Call both fetch functions
        fetchStartupData();
        fetchReviewsData();
        setLoading(false);
    }, [id]);

    const [currentTestimonial, setCurrentTestimonial] = useState(null);

    useEffect(() => {
        if (reviews.length > 0) {
            setCurrentTestimonial(reviews[0].id);
        }
    }, [reviews]);


    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
    if (!startup) return <div className="text-center">Startup not found</div>;

    return (
        <div className="bg-neutral-900 p-6 rounded-lg ">
            {/*hero section*/}
            <div className="max-w-screen-xl mx-auto text-gray-600 gap-x-12 items-center justify-between overflow-hidden md:flex md:px-8">
                <div className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl">
                    <h2 className="text-4xl text-neutral-200 font-extrabold md:text-5xl">
                        {startup.name}
                    </h2>
                    <p className="text-neutral-300">
                        {startup.description}
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <Link
                            to={`/edit/${id}`}
                            className="inline-flex items-center justify-center sm:py-3 sm:px-9 py-2 px-4 text-xl font-semibold text-white transition duration-300 border-2 rounded-full border-[#DA1212] hover:bg-[#DA1212] hover:-translate-y-1 hover:scale-95"
                        >
                            Edit Startup
                        </Link>
                    </div>
                </div>
                <div className="flex-none mt-14 md:mt-0 md:max-w-xl">
                    <img
                        src={startup.imageUrl ? `${startup.imageUrl}` : '/images/placeholder.jpg'}
                        loading="lazy"
                        alt={startup.name}
                        className="rounded-tl-[108px] rounded-br-[108px]"
                    />
                </div>
            </div>
            {/*hero section*/}
            <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8 py-28 flex flex-col md:flex-row justify-between">
                {/* Services Section */}
                <div className="w-full md:w-1/2 mb-10 md:mb-0">
                    <h2 className="text-xl font-semibold mt-4 text-center text-[#DA1212]">Services</h2>
                    <ul className="pl-5 mt-2 text-center">
                        {startup.services.map((service, index) => (
                            <li key={index} className="text-neutral-300 text-xs sm:text-lg md:text-xl">{service}</li>
                        ))}
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="w-full md:w-1/2 space-y-8">
                    <h2 className="text-xl font-semibold mt-4 text-[#DA1212]">Contact</h2>
                    <div className="flex gap-x-5">
                        <svg className="flex-shrink-0 size-6 text-[#DA1212]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <div className="grow">
                            <h4 className="font-semibold text-white">address:</h4>
                            <address className="mt-1 text-xs sm:text-lg md:text-xl not-italic text-neutral-400">
                                {startup.address}<br />
                                Freetown.
                            </address>
                        </div>
                    </div>

                    <div className="flex gap-x-5">
                        <svg className="flex-shrink-0 size-6 text-[#DA1212]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                            <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                        </svg>
                        <div className="grow">
                            <h4 className="font-semibold text-white">Email us:</h4>
                            <Link className="mt-1 text-xs sm:text-lg md:text-xl text-neutral-400" to="">
                                {startup.contact.email}
                            </Link>
                        </div>
                    </div>

                    <div className="flex gap-x-5">
                        <svg className="flex-shrink-0 size-6 text-[#DA1212]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 11 18-5v12L3 14v-3z" />
                            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                        </svg>
                        <div className="grow">
                            <h4 className="font-semibold text-white">Contact</h4>
                            <Link className="mt-1 text-xs sm:text-lg md:text-xl text-neutral-400" to="">
                                {startup.contact.phone}
                            </Link>
                        </div>
                    </div>

                    <div className="flex gap-x-5">
                        <svg className="flex-shrink-0 size-6 text-[#DA1212]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <div className="grow">
                            <h4 className="font-semibold text-white">Website</h4>
                            <Link className="mt-1 text-xs sm:text-lg md:text-xl text-neutral-400" to={startup.contact.website}>
                                {startup.contact.website}
                            </Link>
                        </div>
                    </div>
                    <div className="my-6 lg:mt-10">
                        <div className="flex justify-center md:justify-start">
                            <button type="button">
                                <Link to={startup.social?.facebook || "#"} className="group flex justify-center rounded-md drop-shadow-xl from-gray-800 text-white font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]">
                                    <img src={facebook} alt="" className="w-10 h-10" />
                                    <span className="absolute opacity-0 group-hover:opacity-100 group-hover:text-white group-hover:text-xs group-hover:-translate-y-6 duration-700">
                                        Facebook
                                    </span>
                                </Link>
                            </button>

                            <button type="button">
                                <Link to={startup.social?.instagram || "#"} className="group flex justify-center rounded-md drop-shadow-xl from-gray-800 text-white font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]">
                                    <img src={instagram} alt="" className="w-10 h-10" />
                                    <span className="absolute opacity-0 group-hover:opacity-100 group-hover:text-white group-hover:text-xs group-hover:-translate-y-6 duration-700">
                                        Instagram
                                    </span>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <h2 className="text-xl text-center text-neutral-200 font-semibold mt-4">Operating Hours</h2>
            <p className="text-center text-[#DA1212]">{startup.operatingHours}</p>
            <div className=" max-w-xl mx-auto justify-center py-20  text-center">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-semibold text-white md:text-4xl md:leading-tight">Reviews</h2>
                </div>
                <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <div>
                            {
                                reviews.length === 0 ? (
                                    <p className="text-neutral-500">No reviews yet.</p>
                                ) : (
                                    reviews.map(review => (
                                        currentTestimonial == review.id ? (
                                            <div key={review.id}>
                                                <figure>
                                                    <blockquote>
                                                        <p className="text-[#DA1212] text-xl font-semibold sm:text-2xl">
                                                            “{review.comment}“
                                                        </p>
                                                    </blockquote>
                                                    <div className="mt-6 flex justify-center text-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                                        ))}
                                                    </div>
                                                    <div className="mt-3 text-center flex justify-center text-neutral-200 font-semibold">
                                                        <span className="">{review.reviewerName}</span>
                                                    </div>
                                                </figure>
                                            </div>
                                        ) : ""
                                    ))
                                )
                            }
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="flex gap-x-3 justify-center">
                            {
                                reviews.map(review => (
                                    <div key={review.id}>
                                        <button className={`w-2.5 h-2.5 rounded-full duration-150  ${currentTestimonial == review.id ? "bg-[#DA1212]" : "bg-neutral-300"}`}
                                            onClick={() => setCurrentTestimonial(review.id)}
                                        ></button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <ReviewForm startupId={id} setReviews={setReviews} />
            </div>
        </div >
    )
}

export default StartUpProfile