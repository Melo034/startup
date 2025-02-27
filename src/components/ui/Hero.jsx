import hero from "../../assets/hero.jpg"
const Hero = () => {
    return (
        <div>
            <section className="py-12 bg-neutral-900">
                <div className="max-w-screen-xl mx-auto text-gray-600 gap-x-12 items-center justify-between overflow-hidden md:flex md:px-8">
                    <div className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl">
                        <h1 className="text-sm text-[#DA1212] font-medium">
                            Over 200 successful deals
                        </h1>
                        <h2 className="text-4xl text-neutral-200 font-extrabold md:text-5xl">
                            We help startups to grow and make money
                        </h2>
                        <p className="text-neutral-300">
                            Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.
                        </p>
                    </div>
                    <div className="flex-none mt-14 md:mt-0 md:max-w-xl">
                        <img
                            src={hero}
                            className=" md:rounded-tl-[108px] md:rounded-br-[108px]"
                            alt=""
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Hero