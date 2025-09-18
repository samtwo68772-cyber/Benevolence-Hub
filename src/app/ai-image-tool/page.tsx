"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Sparkles, Wand2 } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { selectImagesAction } from "./actions";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

// Simulated media library
const mediaLibrary = Array.from({ length: 9 }, (_, i) => ({
  id: `img-${i + 1}`,
  url: `https://picsum.photos/seed/${i + 1}0/400/300`,
  hint: `photo ${i + 1}`
}));

const initialState = {
  selectedImageDataUris: [],
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-5 w-5" />
          Select Impactful Images
        </>
      )}
    </Button>
  );
}

export default function AiImageToolPage() {
  const [state, formAction] = useFormState(selectImagesAction, initialState);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [numImages, setNumImages] = useState([3]);

  const handleImageSelection = (url: string) => {
    setSelectedImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Sparkles className="h-7 w-7 text-primary" />
            <h1 className="font-headline text-2xl font-bold tracking-wide">
              AI Image Selector
            </h1>
          </Link>
          <Button asChild variant="outline">
            <Link href="/">Back to Main Site</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <form action={formAction}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Provide Project Context</CardTitle>
                  <CardDescription>
                    Describe the project, its goals, and its intended emotional impact. The more detail, the better the AI's selection.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="projectDescription"
                    placeholder="e.g., A project to provide clean drinking water to a rural village in a drought-affected region. We want to convey hope and the positive impact on children's health."
                    rows={6}
                    required
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Choose from Media Library</CardTitle>
                  <CardDescription>
                    Select the images you want the AI to consider.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaLibrary.map((image) => (
                      <div
                        key={image.id}
                        className="relative cursor-pointer group"
                        onClick={() => handleImageSelection(image.url)}
                      >
                        <Image
                          src={image.url}
                          alt={image.hint}
                          width={400}
                          height={300}
                          className={cn(
                            "rounded-md aspect-video object-cover transition-all",
                            selectedImages.includes(image.url) ? "ring-4 ring-primary ring-offset-2" : "ring-0"
                          )}
                          data-ai-hint={image.hint}
                        />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          {selectedImages.includes(image.url) && (
                            <div className="absolute top-2 right-2 bg-primary rounded-full p-1 text-primary-foreground">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          name="imageDataUris"
                          value={image.url}
                          checked={selectedImages.includes(image.url)}
                          onChange={() => {}}
                          className="hidden"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>3. Configure Selection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="numImages">Number of Images to Select: {numImages[0]}</Label>
                            <Slider
                                name="numberOfImagesToSelect"
                                value={numImages}
                                onValueChange={setNumImages}
                                min={1}
                                max={5}
                                step={1}
                            />
                        </div>
                        <SubmitButton />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                      <CardTitle>AI-Selected Images</CardTitle>
                      <CardDescription>
                        The most impactful images will appear here after analysis.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {state?.error && (
                        <p className="text-destructive text-sm">{state.error}</p>
                      )}
                      {state?.selectedImageDataUris.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {state.selectedImageDataUris.map((uri, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={uri}
                                alt={`Selected image ${index + 1}`}
                                width={400}
                                height={300}
                                className="rounded-md aspect-video object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                          <Wand2 className="h-10 w-10 mb-4" />
                          <p>Your results will be shown here.</p>
                        </div>
                      )}
                    </CardContent>
                </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
