import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Startup } from "../types";
import { categoryMapping } from "../constants";
import { Loader2 } from "lucide-react";
import Loading from "@/components/utils/Loading";

const storage = getStorage();

interface StartupFormProps {
  startup?: Startup;
  onSave: (startup: Startup) => Promise<void>;
  onCancel: () => void;
}

const validateUrl = (url: string): boolean => {
  if (!url) return true; 
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function StartupForm({ startup, onSave, onCancel }: StartupFormProps) {
  const [formData, setFormData] = useState<Startup>({
    id: startup?.id || "",
    name: startup?.name || "",
    description: startup?.description || "",
    category: startup?.category || "",
    rating: startup?.rating || 0,
    featured: startup?.featured || false,
    foundedYear: startup?.foundedYear || new Date().getFullYear(),
    address: startup?.address || "",
    imageUrl: startup?.imageUrl || "",
    contact: {
      phone: startup?.contact?.phone || "",
      email: startup?.contact?.email || "",
      website: startup?.contact?.website || "",
    },
    operatingHours: {
      Monday: startup?.operatingHours?.Monday || "9:00 AM - 5:00 PM",
      Tuesday: startup?.operatingHours?.Tuesday || "9:00 AM - 5:00 PM",
      Wednesday: startup?.operatingHours?.Wednesday || "9:00 AM - 5:00 PM",
      Thursday: startup?.operatingHours?.Thursday || "9:00 AM - 5:00 PM",
      Friday: startup?.operatingHours?.Friday || "9:00 AM - 5:00 PM",
      Saturday: startup?.operatingHours?.Saturday || "Closed",
      Sunday: startup?.operatingHours?.Sunday || "Closed",
    },
    reviews: startup?.reviews || [],
    social: {
      facebook: startup?.social?.facebook || "",
      instagram: startup?.social?.instagram || "",
    },
    services: startup?.services || [],
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      featured: checked,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "contact" || parent === "social") {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
    } else if (name === "services") {
      setFormData((prev) => ({
        ...prev,
        services: value ? value.split(",").map((s) => s.trim()) : [],
      }));
    } else if (name === "foundedYear") {
      setFormData((prev) => ({
        ...prev,
        foundedYear: value ? parseInt(value, 10) : new Date().getFullYear(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOperatingHoursChange = (
    day: keyof Startup["operatingHours"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: value,
      },
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG or PNG image.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Image size must be less than 5MB.",
      });
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `startups/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, imageUrl: downloadURL }));
      toast.success("Image uploaded", {
        description: "The image has been successfully uploaded.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Upload failed", {
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Validation error", {
        description: "Startup name is required.",
      });
      return;
    }
    if (!formData.category) {
      toast.error("Validation error", {
        description: "Category is required.",
      });
      return;
    }
    if (!formData.description) {
      toast.error("Validation error", {
        description: "Description is required.",
      });
      return;
    }

    if (formData.contact.website && !validateUrl(formData.contact.website)) {
      toast.error("Validation error", {
        description: "Please enter a valid website URL.",
      });
      return;
    }
    if (formData.social.facebook && !validateUrl(formData.social.facebook)) {
      toast.error("Validation error", {
        description: "Please enter a valid Facebook URL.",
      });
      return;
    }
    if (formData.social.instagram && !validateUrl(formData.social.instagram)) {
      toast.error("Validation error", {
        description: "Please enter a valid Instagram URL.",
      });
      return;
    }

    if (formData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      toast.error("Validation error", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving startup:", error);
      toast.error("Error", {
        description: "Failed to save startup. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Startup form">
      <div className="space-y-2">
        <Label htmlFor="name">Startup Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          aria-required="true"
          placeholder="Enter startup name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
          required
          aria-required="true"
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(categoryMapping).map((category) => (
              <SelectItem key={category} value={category}>
                {categoryMapping[category].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          aria-required="true"
          rows={4}
          placeholder="Describe the startup"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          disabled={uploading}
          aria-describedby="image-help"
        />
        <p id="image-help" className="text-sm text-muted-foreground">
          Upload a JPEG or PNG image (max 5MB).
        </p>
        {uploading && (
          <div className="flex items-center gap-2">
            <Loading/>
            <span>Uploading...</span>
          </div>
        )}
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Startup preview"
            className="mt-2 h-32 w-auto rounded"
            aria-label="Uploaded startup image preview"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="foundedYear">Founded Year</Label>
        <Input
          id="foundedYear"
          name="foundedYear"
          type="number"
          value={formData.foundedYear}
          onChange={handleChange}
          min={1900}
          max={new Date().getFullYear()}
          required
          aria-required="true"
          placeholder="Enter founding year"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
        />
      </div>

      <div className="space-y-2">
        <Label>Contact Information</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact.phone">Phone</Label>
            <Input
              id="contact.phone"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact.email">Email</Label>
            <Input
              id="contact.email"
              name="contact.email"
              type="email"
              value={formData.contact.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="contact.website">Website</Label>
            <Input
              id="contact.website"
              name="contact.website"
              value={formData.contact.website}
              onChange={handleChange}
              placeholder="Enter website URL"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Social Media</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="social.facebook">Facebook</Label>
            <Input
              id="social.facebook"
              name="social.facebook"
              value={formData.social.facebook}
              onChange={handleChange}
              placeholder="Enter Facebook URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="social.instagram">Instagram</Label>
            <Input
              id="social.instagram"
              name="social.instagram"
              value={formData.social.instagram}
              onChange={handleChange}
              placeholder="Enter Instagram URL"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Operating Hours</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.keys(formData.operatingHours).map((day) => (
            <div key={day} className="space-y-2">
              <Label htmlFor={`operatingHours.${day}`}>{day}</Label>
              <Input
                id={`operatingHours.${day}`}
                value={formData.operatingHours[day as keyof Startup["operatingHours"]]}
                onChange={(e) =>
                  handleOperatingHoursChange(
                    day as keyof Startup["operatingHours"],
                    e.target.value
                  )
                }
                placeholder="e.g., 9:00 AM - 5:00 PM"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="services">Services</Label>
        <Input
          id="services"
          name="services"
          value={formData.services.join(", ")}
          onChange={handleChange}
          placeholder="Enter services (comma-separated)"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={handleCheckboxChange}
          aria-label="Mark as featured"
        />
        <Label htmlFor="featured">Mark as Featured</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving || uploading}
          aria-label="Cancel form submission"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving || uploading}
          aria-label="Save startup"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
      <Toaster richColors position="top-center" closeButton={false} />
    </form>
  );
}