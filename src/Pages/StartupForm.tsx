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
import { toast } from "sonner";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Startup } from "../types";

const storage = getStorage();

interface StartupFormProps {
  startup?: Startup;
  onSave: (startup: Startup) => void;
  onCancel: () => void;
}

export function StartupForm({ startup, onSave, onCancel }: StartupFormProps) {
  const [formData, setFormData] = useState<Startup>(
    startup || {
      name: "",
      description: "",
      category: "",
      rating: 0,
      featured: false,
      foundedYear: new Date().getFullYear(),
      address: "",
      imageUrl: "",
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      operatingHours: {
        Monday: "9:00 AM - 5:00 PM",
        Tuesday: "9:00 AM - 5:00 PM",
        Wednesday: "9:00 AM - 5:00 PM",
        Thursday: "9:00 AM - 5:00 PM",
        Friday: "9:00 AM - 5:00 PM",
        Saturday: "Closed",
        Sunday: "Closed",
      },
      reviews: [],
    }
  );

  const [uploading, setUploading] = useState(false);

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
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(typeof prev[parent as keyof Startup] === "object" &&
          prev[parent as keyof Startup] !== null
            ? (prev[parent as keyof Startup] as unknown as Record<string, unknown>)
            : {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOperatingHoursChange = (day: keyof Startup["operatingHours"], value: string) => {
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

    try {
      setUploading(true);
      const storageRef = ref(storage, `startupImages/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData((prev) => ({
        ...prev,
        imageUrl: downloadURL,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      toast("Error", { description: "Failed to upload image. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 max-h-[90vh] overflow-y-auto sm:max-w-2xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Startup Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            value={formData.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Fintech">Fintech</SelectItem>
              <SelectItem value="Agriculture">Agriculture</SelectItem>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
              <SelectItem value="Logistics">Logistics</SelectItem>
              <SelectItem value="Telecommunications">Telecommunications</SelectItem>
              <SelectItem value="Energy">Energy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="imageUpload">Startup Image</Label>
        <Input
          id="imageUpload"
          name="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {uploading && <p>Uploading...</p>}
        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="Startup"
              className="h-32 w-auto rounded"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactInfo.address">Address</Label>
        <Input
          id="contactInfo.address"
          name="contactInfo.address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactInfo.phone">Phone</Label>
          <Input
            id="contactInfo.phone"
            name="contactInfo.phone"
            value={formData.contact.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactInfo.email">Email</Label>
          <Input
            id="contactInfo.email"
            name="contactInfo.email"
            type="email"
            value={formData.contact.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactInfo.website">Website</Label>
          <Input
            id="contactInfo.website"
            name="contactInfo.website"
            value={formData.contact.website}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="foundedYear">Founded Year</Label>
          <Input
            id="foundedYear"
            name="foundedYear"
            type="number"
            value={formData.foundedYear !== undefined ? formData.foundedYear.toString() : ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>


      <div className="space-y-2">
        <Label htmlFor="featured">Featured</Label>
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={handleCheckboxChange}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Operating Hours</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ] as Array<keyof Startup["operatingHours"]>
          ).map((day) => (
            <div key={day} className="space-y-2">
              <Label htmlFor={`operatingHours.${day}`}>{day}</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`closed.${day}`}
                  checked={formData.operatingHours[day as keyof Startup["operatingHours"]] === "Closed"}
                  onCheckedChange={(checked) =>
                    handleOperatingHoursChange(day, checked ? "Closed" : "9:00 AM - 5:00 PM")
                  }
                />
                <Label htmlFor={`closed.${day}`}>Closed</Label>
                <Input
                  id={`operatingHours.${day}`}
                  name={`operatingHours.${day}`}
                  value={formData.operatingHours[day as keyof Startup["operatingHours"]] || ""}
                  onChange={(e) => handleOperatingHoursChange(day, e.target.value)}
                  disabled={formData.operatingHours[day as keyof Startup["operatingHours"]] === "Closed"}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={uploading}>
          Save
        </Button>
      </div>
    </form>
  );
}