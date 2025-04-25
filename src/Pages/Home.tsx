import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FeaturedStartups } from "@/components/featured-startups"
import { CategoryList } from "@/components/category-list"
import { Footer } from "@/components/utils/Footer"
import { Navbar } from "@/components/utils/Navbar"
import hero from "../assets/hero.jpg"


const Home = () => {
  return (
    <div>
        <Navbar/>
      <main className="flex-1">
        <section className="w-full py-20 md:py-24 lg:py-32 bg-gradient-to-b from-red-50 to-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                  Discover Sierra Leone&apos;s Innovative Startups
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Your gateway to Sierra Leone&apos;s thriving startup ecosystem. Find, connect, and collaborate with
                  local entrepreneurs.
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <form className="flex w-full max-w-md items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search startups or categories..."
                      className="w-full pl-8 bg-white"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  Popular:{" "}
                  <Link to="/startups?category=tech" className="underline">
                    Tech
                  </Link>
                  ,{" "}
                  <Link to="/startups?category=fintech" className="underline">
                    Fintech
                  </Link>
                  ,{" "}
                  <Link to="/startups?category=agritech" className="underline">
                    Agritech
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Startups</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Explore some of the most innovative startups in Sierra Leone
                </p>
              </div>
            </div>
            <FeaturedStartups />
            <div className="flex justify-center mt-8">
              <Button asChild>
                <Link to="/startups">View All Startups</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Browse by Category</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Find startups by industry or specialization
                </p>
              </div>
            </div>
            <CategoryList />
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-red-100 px-3 py-1 text-sm">Join the Community</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Are you a startup in Sierra Leone?
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Get listed in our directory to increase your visibility and connect with potential customers,
                  partners, and investors.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild>
                    <Link to="/submit-startup">Add Your Startup</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full"></div>
                  <img
                    src={hero}
                    alt="Freetown startup community"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}

export default Home