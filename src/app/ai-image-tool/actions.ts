"use server";

import { selectImpactfulImages } from "@/ai/flows/ai-image-selection-for-project";
import { z } from "zod";

const formSchema = z.object({
  projectDescription: z.string().min(1, "Project description is required."),
  imageDataUris: z.preprocess((val) => {
    if (typeof val === 'string') return [val];
    if (Array.isArray(val)) return val;
    return [];
  }, z.array(z.string().url()).min(1, "Please select at least one image.")),
  numberOfImagesToSelect: z.coerce.number().min(1).max(5),
});


export async function selectImagesAction(prevState: any, formData: FormData) {
  try {
    const parsed = formSchema.safeParse({
      projectDescription: formData.get("projectDescription"),
      imageDataUris: formData.getAll("imageDataUris"),
      numberOfImagesToSelect: formData.get("numberOfImagesToSelect"),
    });

    if (!parsed.success) {
      return {
        selectedImageDataUris: [],
        error: parsed.error.errors.map((e) => e.message).join(", "),
      };
    }
    
    const { projectDescription, imageDataUris, numberOfImagesToSelect } = parsed.data;

    // Fetch and convert images to data URIs in parallel
    const convertedImageUris = await Promise.all(
      imageDataUris.map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.error(`Failed to fetch image: ${url}, status: ${response.status}`);
            return null; // Skip failed fetches
          }
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.startsWith("image/")) {
            console.error(`Invalid content type for image: ${url}`);
            return null;
          }
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          return `data:${contentType};base64,${buffer.toString("base64")}`;
        } catch (error) {
          console.error(`Error processing image ${url}:`, error);
          return null;
        }
      })
    );

    const validUris = convertedImageUris.filter((uri): uri is string => uri !== null);

    if (validUris.length === 0) {
      return {
        selectedImageDataUris: [],
        error: "Could not process any of the selected images. Please try again with different images."
      };
    }

    const result = await selectImpactfulImages({
      projectDescription,
      imageDataUris: validUris,
      numberOfImagesToSelect,
    });
    
    return { selectedImageDataUris: result.selectedImageDataUris, error: null };
  } catch (error) {
    console.error("AI selection failed:", error);
    return {
      selectedImageDataUris: [],
      error: "An unexpected error occurred during AI image selection. Please check the logs.",
    };
  }
}
