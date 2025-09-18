'use server';
/**
 * @fileOverview An AI image selection tool for projects.
 *
 * - selectImpactfulImages - A function that selects the most impactful images for a project.
 * - SelectImpactfulImagesInput - The input type for the selectImpactfulImages function.
 * - SelectImpactfulImagesOutput - The return type for the selectImpactfulImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelectImpactfulImagesInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A description of the project, its goals, and its impact.'),
  imageDataUris: z
    .array(z.string())
    .describe(
      'An array of image data URIs (Base64 encoded) to choose from.  Each data URI must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // per guidance
    ),
  numberOfImagesToSelect: z
    .number()
    .min(1)
    .max(5)
    .default(3)
    .describe('The number of images to select.'),
});
export type SelectImpactfulImagesInput = z.infer<
  typeof SelectImpactfulImagesInputSchema
>;

const SelectImpactfulImagesOutputSchema = z.object({
  selectedImageDataUris: z
    .array(z.string())
    .describe('An array of the selected image data URIs.'),
});
export type SelectImpactfulImagesOutput = z.infer<
  typeof SelectImpactfulImagesOutputSchema
>;

export async function selectImpactfulImages(
  input: SelectImpactfulImagesInput
): Promise<SelectImpactfulImagesOutput> {
  return selectImpactfulImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'selectImpactfulImagesPrompt',
  input: {schema: SelectImpactfulImagesInputSchema},
  output: {schema: SelectImpactfulImagesOutputSchema},
  prompt: `You are an AI assistant helping to select the most impactful and relevant images for a humanitarian project.

  Given the following project description and a list of images, select the {{numberOfImagesToSelect}} most impactful images that effectively communicate the project's goals and impact.

  Project Description: {{{projectDescription}}}

  Available Images:
  {{#each imageDataUris}}
  - {{media url=this}}
  {{/each}}

  Return ONLY the selected images' data URIs in the selectedImageDataUris array.
  Do not include any additional text or explanations.
  `, // handlebars
});

const selectImpactfulImagesFlow = ai.defineFlow(
  {
    name: 'selectImpactfulImagesFlow',
    inputSchema: SelectImpactfulImagesInputSchema,
    outputSchema: SelectImpactfulImagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

