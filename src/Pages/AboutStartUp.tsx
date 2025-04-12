import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/utils/Navbar";
import { Footer } from "@/components/utils/Footer";
const AboutStartUp = () => {
    return (
        <div>
            <Navbar />
            <div className="container max-w-6xl mx-auto px-4 py-32 space-y-8">
                {/* Hero Section */}
                <section className="text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Sierra Leone Startup Ecosystem
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Empowering entrepreneurs, fostering innovation, and driving economic
                        growth across Sierra Leone.
                    </p>
                    <div className="mt-6 flex gap-4 justify-center">
                        <Button asChild>
                            <Link to="/startups">Browse Startups</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/submit-startup">Add Your Startup</Link>
                        </Button>
                    </div>
                </section>

                {/* About Content */}
                <section className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Our Vision</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                We envision a Sierra Leone where every aspiring entrepreneur has the
                                tools and opportunities to succeed. From tech-driven solutions in
                                Freetown to agricultural innovations in rural communities, our goal
                                is to nurture a diverse startup ecosystem that addresses local
                                challenges and competes globally.
                            </p>
                            <p className="mt-2">
                                Inspired by Nigeria's tech scene and Estonia's digital governance,
                                we're building a future where innovation fuels prosperity for all
                                Sierra Leoneans.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>What We Do</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong>Startup Support Platform</strong>: Our portal offers free
                                    resources like pitch deck templates and mentorship.{" "}
                                    <Link
                                        to="/startups"
                                        className="text-red-600 hover:underline"
                                    >
                                        Showcase your venture
                                    </Link>{" "}
                                    or connect with investors.
                                </li>
                                <li>
                                    <strong>Technology Hub</strong>: Partnering with DSTI, we're
                                    developing a Tech City in Tikonko, Bo District, with accelerators
                                    and training programs.
                                </li>
                                <li>
                                    <strong>Climate & Agriculture</strong>: Supporting startups in
                                    agriculture and renewable energy with tools like solar tech and
                                    climate-smart farming. Explore{" "}
                                    <Link
                                        to="/startups?category=agriculture"
                                        className="text-red-600 hover:underline"
                                    >
                                        Agriculture startups
                                    </Link>
                                    .
                                </li>
                                <li>
                                    <strong>Community Engagement</strong>: Events like the Sierra
                                    Leone Tech Summit foster networking. Join our{" "}
                                    <Link
                                        to="/startups?category=tech"
                                        className="text-red-600 hover:underline"
                                    >
                                        Tech community
                                    </Link>
                                    .
                                </li>
                                <li>
                                    <strong>Education</strong>: STEM and vocational training with
                                    UNICEF and DSTI prepare youth for a digital economy.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Our Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <p className="font-semibold">50+ MSMEs Supported</p>
                                    <p className="text-sm text-muted-foreground">
                                        Driving economic diversification.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">200 Jobs Created</p>
                                    <p className="text-sm text-muted-foreground">
                                        In fintech, agriculture, and energy.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">40% Women Beneficiaries</p>
                                    <p className="text-sm text-muted-foreground">
                                        Empowering inclusive innovation.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">$150M Investment Target</p>
                                    <p className="text-sm text-muted-foreground">
                                        For digital infrastructure.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Why Sierra Leone?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                With a youthful population (74.8% under 35), fertile lands, and
                                trade agreements like AfCFTA, Sierra Leone is poised for growth.
                                Despite challenges, policies like the Startup Act and President
                                Bio's “Digital Republic” vision create opportunities.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-red-50">
                                    <Link to="/startups?category=tech">Tech</Link>
                                </Badge>
                                <Badge variant="outline" className="bg-red-50">
                                    <Link to="/startups?category=fintech">Fintech</Link>
                                </Badge>
                                <Badge variant="outline" className="bg-red-50">
                                    <Link to="/startups?category=agriculture">Agriculture</Link>
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Get Involved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Join us as a founder, investor, or partner. Submit your startup,
                                attend events, or sponsor innovation.
                            </p>
                            <div className="mt-4 flex gap-4">
                                <Button asChild>
                                    <Link to="/submit-startup">Submit Your Startup</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link to="/startups">Explore Startups</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
            <Footer/>
        </div>
    )
}

export default AboutStartUp


