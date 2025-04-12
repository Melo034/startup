import { StartupFilters } from "@/components/startup-filters"
import { StartupList } from "@/components/startup-list"
import { Footer } from "@/components/utils/Footer"
import { Navbar } from "@/components/utils/Navbar"

const StartUps = () => {
  return (
    <>
      <Navbar/>
      <main className="py-32">
        <div className="container max-w-8xl mx-auto px-4 md:px-6">
          <div className="flex flex-col space-y-4 md:space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Startups in Freetown</h1>
              <p className="mt-2 text-muted-foreground">Discover and connect with innovative startups in Sierra Leone</p>
            </div>
            <div className="grid md:grid-cols-[250px_1fr] gap-6">
              <StartupFilters/>
              <StartupList/>
            </div>
          </div>
        </div>
      </main>  
      <Footer/>
    </>
  )
}

export default StartUps

