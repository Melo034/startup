import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../server/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const AddEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        services: '',
        address: '',
        contact: { phone: '', email: '', website: '' },
        social: { facebook: '', instagram: '' },
        operatingHours: '',
        imageUrl: ''
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const docRef = doc(db, 'startups', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setFormData({ ...docSnap.data(), services: docSnap.data().services.join(', ') });
                    } else {
                        setError('Startup not found');
                    }
                } catch (error) {
                    console.error("Error saving document:", error);
                    setError("Error fetching startup data Please try again.");
                }
            };
            fetchData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('contact.')) {
            const key = name.split('.')[1];
            setFormData(prev => ({ ...prev, contact: { ...prev.contact, [key]: value } })); 
        } else if (name.startsWith('social.')) {
            const key = name.split('.')[1];
            setFormData(prev => ({ ...prev, social: { ...prev.social, [key]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.contact.phone) {
            setError('Name and phone are required');
            return;
        }

        let imageUrl = formData.imageUrl;

        try {
            if (image) {
                const imageRef = ref(storage, `images/${uuidv4()}-${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            const startupData = {
                ...formData,
                services: formData.services.split(',').map(s => s.trim()),
                imageUrl,
            };

            if (id) {
                await updateDoc(doc(db, 'startups', id), startupData);
            } else {
                await setDoc(doc(db, 'startups', uuidv4()), startupData);
            }
            navigate('/');
        } catch (error) {
            console.error("Error saving document:", error);
            setError("Failed to save startup. Please try again.");
        }
    };

    return (
        <div className='flex flex-col justify-center items-center min-h-screen px-4'>
            <div className="max-w-5xl w-full">
                <h2 className="text-2xl font-semibold py-2 text-white md:text-4xl md:leading-tight">{id ? 'Edit' : 'Add'} Startup</h2>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16">
                    <div className="pb-10 mb-10 border-b md:order-2 border-neutral-800 md:border-b-0 md:pb-0 md:mb-0">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">

                                <div className="relative">
                                    <input type="text" id="hs-tac-input-name" name="name" value={formData.name} onChange={handleChange} className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
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
                                    <input type="email" id="hs-tac-input-email" name="contact.email" value={formData.contact.email} onChange={handleChange} className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
      focus:pt-6
      focus:pb-2
      [&:not(:placeholder-shown)]:pt-6
      [&:not(:placeholder-shown)]:pb-2
      autofill:pt-6
      autofill:pb-2" placeholder="Email" />
                                    <label htmlFor="hs-tac-input-email" className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
        peer-focus:text-xs
        peer-focus:-translate-y-1.5
        peer-focus:text-neutral-400
        peer-[:not(:placeholder-shown)]:text-xs
        peer-[:not(:placeholder-shown)]:-translate-y-1.5
        peer-[:not(:placeholder-shown)]:text-neutral-400">Email</label>
                                </div>

                                <div className="relative">
                                    <input name="services" value={formData.services} onChange={handleChange} type="text" id="hs-tac-input-services" className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
      focus:pt-6
      focus:pb-2
      [&:not(:placeholder-shown)]:pt-6
      [&:not(:placeholder-shown)]:pb-2
      autofill:pt-6
      autofill:pb-2" placeholder="services" />
                                    <label htmlFor="hs-tac-input-services" className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
        peer-focus:text-xs
        peer-focus:-translate-y-1.5
        peer-focus:text-neutral-400
        peer-[:not(:placeholder-shown)]:text-xs
        peer-[:not(:placeholder-shown)]:-translate-y-1.5
        peer-[:not(:placeholder-shown)]:text-neutral-400">Services</label>
                                </div>
                                <div className="relative">
                                    <input name="address" value={formData.address} onChange={handleChange} type="text" id="hs-tac-input-address" className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
      focus:pt-6
      focus:pb-2
      [&:not(:placeholder-shown)]:pt-6
      [&:not(:placeholder-shown)]:pb-2
      autofill:pt-6
      autofill:pb-2" placeholder="address" />
                                    <label htmlFor="hs-tac-input-address" className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
        peer-focus:text-xs
        peer-focus:-translate-y-1.5
        peer-focus:text-neutral-400
        peer-[:not(:placeholder-shown)]:text-xs
        peer-[:not(:placeholder-shown)]:-translate-y-1.5
        peer-[:not(:placeholder-shown)]:text-neutral-400">Address</label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="hs-tac-input-website"
                                        name="contact.website"
                                        value={formData.contact?.website || ""}
                                        onChange={handleChange}
                                        className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
            focus:pt-6
            focus:pb-2
            [&:not(:placeholder-shown)]:pt-6
            [&:not(:placeholder-shown)]:pb-2
            autofill:pt-6
            autofill:pb-2"
                                        placeholder="Website"
                                    />
                                    <label
                                        htmlFor="hs-tac-input-website"
                                        className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
            peer-focus:text-xs
            peer-focus:-translate-y-1.5
            peer-focus:text-neutral-400
            peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:-translate-y-1.5
            peer-[:not(:placeholder-shown)]:text-neutral-400">
                                        Website
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="hs-tac-input-facebook"
                                        name="social.facebook"
                                        value={formData.social?.facebook || ""}
                                        onChange={handleChange}
                                        className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
            focus:pt-6
            focus:pb-2
            [&:not(:placeholder-shown)]:pt-6
            [&:not(:placeholder-shown)]:pb-2
            autofill:pt-6
            autofill:pb-2"
                                        placeholder="facebook"
                                    />
                                    <label
                                        htmlFor="hs-tac-input-facebook"
                                        className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
            peer-focus:text-xs
            peer-focus:-translate-y-1.5
            peer-focus:text-neutral-400
            peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:-translate-y-1.5
            peer-[:not(:placeholder-shown)]:text-neutral-400">
                                        Facebook Link
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="hs-tac-input-instagram"
                                        name="social.instagram"
                                        value={formData.social?.instagram || ""}
                                        onChange={handleChange}
                                        className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
            focus:pt-6
            focus:pb-2
            [&:not(:placeholder-shown)]:pt-6
            [&:not(:placeholder-shown)]:pb-2
            autofill:pt-6
            autofill:pb-2"
                                        placeholder="instagram"
                                    />
                                    <label
                                        htmlFor="hs-tac-input-instagram"
                                        className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
            peer-focus:text-xs
            peer-focus:-translate-y-1.5
            peer-focus:text-neutral-400
            peer-[:not(:placeholder-shown)]:text-xs
            peer-[:not(:placeholder-shown)]:-translate-y-1.5
            peer-[:not(:placeholder-shown)]:text-neutral-400">
                                        Instagram Link
                                    </label>
                                </div>
                                <div className="relative">
                                    <input type="text" id="hs-tac-input-operatingHours" name="operatingHours" value={formData.operatingHours} onChange={handleChange} className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
      focus:pt-6
      focus:pb-2
      [&:not(:placeholder-shown)]:pt-6
      [&:not(:placeholder-shown)]:pb-2
      autofill:pt-6
      autofill:pb-2" placeholder="operatingHours" />
                                    <label htmlFor="hs-tac-input-operatingHours" className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
        peer-focus:text-xs
        peer-focus:-translate-y-1.5
        peer-focus:text-neutral-400
        peer-[:not(:placeholder-shown)]:text-xs
        peer-[:not(:placeholder-shown)]:-translate-y-1.5
        peer-[:not(:placeholder-shown)]:text-neutral-400">Operating Hours</label>
                                </div>

                                <div className="relative">
                                    <input type="text" name="contact.phone" value={formData.contact.phone} onChange={handleChange} id="hs-tac-input-phone" className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
      focus:pt-6
      focus:pb-2
      [&:not(:placeholder-shown)]:pt-6
      [&:not(:placeholder-shown)]:pb-2
      autofill:pt-6
      autofill:pb-2" placeholder="Phone" />
                                    <label htmlFor="hs-tac-input-phone" className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
        peer-focus:text-xs
        peer-focus:-translate-y-1.5
        peer-focus:text-neutral-400
        peer-[:not(:placeholder-shown)]:text-xs
        peer-[:not(:placeholder-shown)]:-translate-y-1.5
        peer-[:not(:placeholder-shown)]:text-neutral-400">Phone</label>
                                </div>

                                <div className="relative">
                                    <textarea id="hs-tac-message" name="description" value={formData.description} onChange={handleChange} className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
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
        peer-[:not(:placeholder-shown)]:text-neutral-400">Description</label>
                                </div>
                                <div className="relative">
                                    <input type="file" name="image" onChange={handleImageChange} id="hs-tac-input-phone" className="peer p-4 block w-full bg-neutral-800 border-transparent rounded-lg text-sm text-white placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-50 disabled:pointer-events-none
      focus:pt-6
      focus:pb-2
      [&:not(:placeholder-shown)]:pt-6
      [&:not(:placeholder-shown)]:pb-2
      autofill:pt-6
      autofill:pb-2" placeholder="image" />
                                    <label htmlFor="hs-tac-input-image" className="absolute top-0 start-0 p-4 h-full text-neutral-400 text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
        peer-focus:text-xs
        peer-focus:-translate-y-1.5
        peer-focus:text-neutral-400
        peer-[:not(:placeholder-shown)]:text-xs
        peer-[:not(:placeholder-shown)]:-translate-y-1.5
        peer-[:not(:placeholder-shown)]:text-neutral-400">Image</label>
                                </div>
                                {formData.imageUrl && <img src={formData.imageUrl} alt="Uploaded" width="100" />}
                            </div>


                            <div className="mt-2">
                                <p className="text-xs text-neutral-500">
                                    All fields are required
                                </p>

                                <p className="mt-5 flex gap-5">
                                    <button type="submit" className="group inline-flex items-center gap-x-2 py-2 px-3 bg-[#DA1212] font-medium text-sm text-neutral-200 rounded-full focus:outline-none">
                                        {id ? 'Update' : 'Add'} Startup
                                        <svg className="flex-shrink-0 size-4 transition group-hover:translate-x-0.5 group-focus:translate-x-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14" />
                                            <path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </button>
                                    <button type="button" onClick={() => navigate(id ? `/startups/${id}` : '/')} className="group inline-flex items-center gap-x-2 py-2 px-3 bg-neutral-950 font-medium text-sm text-neutral-200 rounded-full focus:outline-none">
                                        Cancel
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddEdit