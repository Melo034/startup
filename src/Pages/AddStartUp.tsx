import { useState, useEffect } from "react";
import { Edit, Plus} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../server/firebase";
import { mapStartupData } from "../utils/mapStartupData";
import { Startup } from "../types";
import { Footer } from "@/components/utils/Footer";
import { Navbar } from "@/components/utils/Navbar";
import { StartupForm } from "./StartupForm";
import Loading from "@/components/utils/Loading";

const AddStartUp = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const startupsCollection = collection(db, "startups");
        const startupsSnapshot = await getDocs(startupsCollection);
        const startupsList = startupsSnapshot.docs.map(mapStartupData);
        setStartups(startupsList);
      } catch (error) {
        console.error("Error fetching startups:", error);
        toast.error("Error", { description: "Failed to fetch startups." });
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const handleSave = async (startup: Startup, isNew: boolean) => {
    try {
      const { id, ...startupData } = startup;
      if (isNew) {
        const docRef = await addDoc(collection(db, "startups"), startupData);
        setStartups((prev) => [...prev, { ...startup, id: docRef.id }]);
        setIsAddDialogOpen(false);
        toast.success("Startup added", {
          description: "The new startup has been added to the directory.",
        });
      } else if (id) {
        const startupRef = doc(db, "startups", id);
        await setDoc(startupRef, startupData, { merge: true });
        setStartups((prev) =>
          prev.map((s) => (s.id === id ? { ...startupData, id } : s))
        );
        setIsAddDialogOpen(false);
        toast.success("Startup updated", {
          description: "The startup has been updated in the directory.",
        });
      }
    } catch (error) {
      console.error("Error saving startup:", error);
      toast.error("Error", {
        description: "Failed to save startup. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <main className="py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex justify-center">
              <Loading/>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="flex-1 py-32">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col space-y-4 md:space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Startups Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage startups in the Freetown directory
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1" aria-label="Add new startup">
                    <Plus className="w-4 h-4" />
                    Add Startup
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Startup</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new startup listing.
                    </DialogDescription>
                  </DialogHeader>
                  <StartupForm
                    onSave={(data: Startup) => handleSave(data, true)}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-lg border">
              <Table aria-label="Startups table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {startups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No startups found
                      </TableCell>
                    </TableRow>
                  ) : (
                    startups.map((startup) => (
                      <TableRow key={startup.id}>
                        <TableCell className="font-medium">{startup.name}</TableCell>
                        <TableCell>{startup.category}</TableCell>
                        <TableCell>
                          {startup.rating > 0 ? startup.rating.toFixed(1) : "N/A"}
                        </TableCell>
                        <TableCell>{startup.address}</TableCell>
                        <TableCell>{startup.contact?.email ?? "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`/edit/${startup.id}`)}
                              aria-label={`Edit ${startup.name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster richColors position="top-center" closeButton={false} />
    </div>
  );
};

export default AddStartUp;