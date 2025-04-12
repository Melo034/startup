// AddStartUp.tsx
import { useState, useEffect } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../server/firebase";
import type { Startup } from "../types";
import { Footer } from "@/components/utils/Footer";
import { Navbar } from "@/components/utils/Navbar";
import { StartupForm } from "./StartupForm";

const AddStartUp = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentStartup, setCurrentStartup] = useState<Startup | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const startupsCollection = collection(db, "startups");
        const startupsSnapshot = await getDocs(startupsCollection);
        const startupsList: Startup[] = startupsSnapshot.docs.map((docSnapshot) => {
            const data = docSnapshot.data();
            const reviews = Array.isArray(data.reviews) ? data.reviews : [];
            const rating =
              typeof data.rating === "number"
                ? data.rating
                : reviews.length > 0
                ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
                : 0;
            return {
              id: docSnapshot.id,
              name: data.name || "",
              description: data.description || "",
              category: data.category || "",
              rating,
              featured: data.featured || false,
              foundedYear: data.foundedYear || new Date().getFullYear(),
              imageUrl: data.imageUrl || "",
              contact: {
                phone: data.contact?.phone || "",
                email: data.contact?.email || "",
                website: data.contact?.website || "",
              },
              address: data.address || "",
              operatingHours: {
                Monday: data.operatingHours?.Monday || "9:00 AM - 5:00 PM",
                Tuesday: data.operatingHours?.Tuesday || "9:00 AM - 5:00 PM",
                Wednesday: data.operatingHours?.Wednesday || "9:00 AM - 5:00 PM",
                Thursday: data.operatingHours?.Thursday || "9:00 AM - 5:00 PM",
                Friday: data.operatingHours?.Friday || "9:00 AM - 5:00 PM",
                Saturday: data.operatingHours?.Saturday || "Closed",
                Sunday: data.operatingHours?.Sunday || "Closed",
              },
              reviews,
            };
        });
        setStartups(startupsList);
      } catch (error) {
        console.error("Error fetching startups:", error);
      }
    };

    fetchStartups();
  }, []);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "startups", id));
      setStartups((prev) => prev.filter((startup) => startup.id !== id));
      setIsDeleteDialogOpen(false);
      toast("Startup deleted", {
        description: "The startup has been removed from the directory.",
      });
    } catch (error) {
      console.error("Error deleting startup:", error);
      toast("Error", {
        description: "Failed to delete startup. Please try again.",
      });
    }
  };

  const handleSave = async (startup: Startup, isNew = false) => {
    try {
      if (isNew) {
        const docRef = await addDoc(collection(db, "startups"), startup);
        setStartups((prev) => [...prev, { ...startup, id: docRef.id }]);
        setIsAddDialogOpen(false);
        toast("Startup added", {
          description: "The new startup has been added to the directory.",
        });
      }
    } catch (error) {
      console.error("Error saving startup:", error);
      toast("Error", {
        description: "Failed to save startup. Please try again.",
      });
    }
  };

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
                  <Button className="flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add Startup
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {startups.map((startup) => (
                    <TableRow key={startup.id}>
                      <TableCell className="font-medium">{startup.name}</TableCell>
                      <TableCell>{startup.category}</TableCell>
                      <TableCell>{startup.rating > 0 ? startup.rating.toFixed(1) : "N/A"}</TableCell>
                      <TableCell>{startup.address}</TableCell>
                      <TableCell>{startup.contact?.email ?? "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/edit/${startup.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={isDeleteDialogOpen && currentStartup?.id === startup.id}
                            onOpenChange={(open) => {
                              setIsDeleteDialogOpen(open);
                              if (open) setCurrentStartup(startup);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500"
                                onClick={() => setCurrentStartup(startup)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete {currentStartup?.name}?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(currentStartup?.id)}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddStartUp;