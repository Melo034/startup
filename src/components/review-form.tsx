import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../server/firebase";

interface ReviewFormProps {
  startupId: string;
}

export function ReviewForm({ startupId }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Error", { description: "Please select a rating between 1 and 5." });
      return;
    }

    setIsSubmitting(true);
    const reviewData = {
      name,
      email,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    try {
      const startupRef = doc(db, "startups", startupId);
      await updateDoc(startupRef, {
        reviews: arrayUnion(reviewData),
      });
      toast.success("Review submitted", {
        description: "Thank you for your feedback!",
      });
      setRating(0);
      setName("");
      setEmail("");
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error", { description: "Failed to submit review. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                (hoverRating || rating) >= star ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              role="radio"
              aria-checked={(hoverRating || rating) >= star}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setRating(star)}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Review</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
          aria-required="true"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
        aria-disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
      <Toaster richColors position="top-center" closeButton={false} />
    </form>
  );
}