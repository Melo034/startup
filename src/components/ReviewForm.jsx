import { useState } from 'react';
import PropTypes from 'prop-types';
import { db } from '../server/firebase';  
import { collection, addDoc } from 'firebase/firestore';  

const ReviewForm = ({ startupId, setReviews }) => {
    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reviewerName || !rating) {
            setError('Name and rating are required');
            return;
        }

        const review = { startupId, reviewerName, rating, comment };

        try {
            // Add the review to the Firestore collection
            const docRef = await addDoc(collection(db, 'reviews'), review);
            setReviews((prev) => [...prev, { ...review, id: docRef.id }]);
            setReviewerName('');
            setRating(5);
            setComment('');
            setError(null);
        } catch (error) {
            setError('Failed to submit review: ' + error.message);
        }
    };

    return (
        <div className='mt-10'>
            <h3 className="text-lg font-semibold text-neutral-200 py-3">Add a Review</h3>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} >
                <div className="space-y-4">

                    <div className="relative">
                        <input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} id="hs-tac-input-name" className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
      focus:pt-6
      focus:pb-2
      [&:not(:placeholder-shown)]:pt-6
      [&:not(:placeholder-shown)]:pb-2
      autofill:pt-6
      autofill:pb-2" placeholder="Name" />
                        <label htmlFor="hs-tac-input-name" className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
        peer-focus:text-xs
        peer-focus:-translate-y-1.5
        peer-focus:text-neutral-400
        peer-[:not(:placeholder-shown)]:text-xs
        peer-[:not(:placeholder-shown)]:-translate-y-1.5
        peer-[:not(:placeholder-shown)]:text-neutral-400">Name</label>
                    </div>

                    <div className="relative">
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))} className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
      focus:pt-6
      focus:pb-2
      [&:not(:placeholder-shown)]:pt-6
      [&:not(:placeholder-shown)]:pb-2
      autofill:pt-6
      autofill:pb-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num} Stars
                                </option>
                            ))}
                        </select>
                        <label htmlFor="hs-tac-input-rating" className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
        peer-focus:text-xs
        peer-focus:-translate-y-1.5
        peer-focus:text-neutral-400
        peer-[:not(:placeholder-shown)]:text-xs
        peer-[:not(:placeholder-shown)]:-translate-y-1.5
        peer-[:not(:placeholder-shown)]:text-neutral-400">Rating:</label>
                    </div>

                    <div className="relative">
                        <textarea id="hs-tac-message" value={comment} onChange={(e) => setComment(e.target.value)} className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
      focus:pt-6
      focus:pb-2
      [&:not(:placeholder-shown)]:pt-6
      [&:not(:placeholder-shown)]:pb-2
      autofill:pt-6
      autofill:pb-2" placeholder="This is a textarea placeholder"></textarea>
                        <label htmlFor="hs-tac-message" className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
        peer-focus:text-xs
        peer-focus:-translate-y-1.5
        peer-focus:text-neutral-400
        peer-[:not(:placeholder-shown)]:text-xs
        peer-[:not(:placeholder-shown)]:-translate-y-1.5
        peer-[:not(:placeholder-shown)]:text-neutral-400">Comment:</label>
                    </div>

                </div>

                <div className="mt-2">
                    <p className="text-xs text-neutral-500">
                        All fields are required
                    </p>

                    <p className="mt-5">
                        <button type="submit" className="group inline-flex items-center gap-x-2 py-2 px-3 bg-[#DA1212] font-medium text-sm text-neutral-200 rounded-full focus:outline-none" href="#">
                            Submit
                            <svg className="flex-shrink-0 size-4 transition group-hover:translate-x-0.5 group-focus:translate-x-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </p>
                </div>
            </form>
        </div >
    );
};

ReviewForm.propTypes = {
    startupId: PropTypes.string.isRequired,
    setReviews: PropTypes.func.isRequired,
};

export default ReviewForm;
