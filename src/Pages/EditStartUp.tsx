import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../server/firebase";
import { StartupForm } from "./StartupForm";
import { toast, Toaster } from "sonner";
import { Navbar } from "@/components/utils/Navbar";
import { Footer } from "@/components/utils/Footer";
import { Startup } from "../types";
import Loading from "@/components/utils/Loading";

const EditStartUp = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      if (!id) {
        toast.error("Error", { description: "No startup ID provided." });
        navigate("/submit-startup");
        return;
      }
      try {
        setLoading(true);
        const docRef = doc(db, "startups", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStartup({ id: docSnap.id, ...docSnap.data() } as Startup);
        } else {
          toast.error("Error", { description: "Startup not found." });
          navigate("/submit-startup");
        }
      } catch (error) {
        console.error("Error fetching startup:", error);
        toast.error("Error", { description: "Failed to fetch startup data." });
        navigate("/submit-startup");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [id, navigate]);

  const handleSave = async (updatedStartup: Startup) => {
    if (!id) return;
    try {
      const startupRef = doc(db, "startups", id);
      const { id: _, ...dataToUpdate } = updatedStartup;
      await updateDoc(startupRef, JSON.parse(JSON.stringify(dataToUpdate)));
      toast.success("Startup updated", {
        description: "The startup information has been updated.",
      });
      navigate("/submit-startup");
    } catch (error) {
      console.error("Error updating startup:", error);
      toast.error("Error", { description: "Failed to update startup. Please try again." });
    }
  };

  const handleCancel = () => {
    navigate("/submit-startup");
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <main className="py-32">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <div className="flex justify-center">
              <Loading/>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!startup) {
    return (
      <div>
        <Navbar />
        <main className="py-32">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-red-600">Startup not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="py-32">
        <div className="container max-w-5xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-4">Edit Startup</h1>
          <StartupForm startup={startup} onSave={handleSave} onCancel={handleCancel} />
        </div>
      </main>
      <Footer />
      <Toaster richColors position="top-center" closeButton={false} />
    </div>
  );
};

export default EditStartUp;