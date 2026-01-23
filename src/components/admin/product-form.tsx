'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateProductDescription } from '@/ai/flows/ai-product-description';
import type { Product, ProductCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const productCategories: ProductCategory[] = ["food", "toys", "litter", "accessories", "siamese", "persian", "sphynx"];

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(productCategories),
  price: z.coerce.number().positive('Price must be a positive number'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  keywords: z.string().optional(),
  mainImageUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')).optional(),
  galleryImageUrls: z.array(z.string().url({ message: 'Please enter a valid URL' }).or(z.literal(''))).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ product }: { product: Product | null }) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || 'food',
      price: product?.price || 0,
      stockQuantity: product?.stockQuantity || 0,
      keywords: '',
      mainImageUrl: product?.mainImageUrl || '',
      galleryImageUrls: product?.galleryImageUrls || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "galleryImageUrls",
  });

  const handleGenerateDescription = async () => {
    const { name, description, category, keywords } = form.getValues();
    if (!name) {
      toast({
        variant: 'destructive',
        title: 'Product name is required',
        description:
          'Please enter a product name before generating a description.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateProductDescription({
        productName: name,
        currentDescription: description,
        category: category,
        keywords: keywords || '',
      });
      setAiSuggestion(result.improvedDescription);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Generation Failed',
        description: 'Could not generate a new description. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = () => {
    if (aiSuggestion) {
      form.setValue('description', aiSuggestion, { shouldValidate: true });
      setAiSuggestion(null);
    }
  };

  async function onSubmit(data: ProductFormData) {
    // Here you would call a server action to save the product to Firestore
    const submissionData = {
      ...data,
      galleryImageUrls: data.galleryImageUrls?.filter((url) => url),
    };
    console.log('Form submitted:', submissionData);
    toast({
      title: 'Product Saved',
      description: `${data.name} has been successfully saved.`,
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Majestic Persian Kitten"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Description</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Generate with AI
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={8}
                        placeholder="Describe the product..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Provide URLs for the main and gallery images of the product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="mainImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.png"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Gallery Images</FormLabel>
                    <div className="space-y-2 mt-2">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`galleryImageUrls.${index}`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormControl>
                                  <Input
                                    placeholder="https://example.com/gallery-image.png"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => append('')}
                    >
                      Add Gallery Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Generate a compelling product description using AI. Add some
                    keywords for better results.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., fluffy, playful, pedigree"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <Button type="submit">Save Product</Button>
        </form>
      </Form>
      <Dialog open={!!aiSuggestion} onOpenChange={() => setAiSuggestion(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="text-primary" /> AI-Generated Description
            </DialogTitle>
            <DialogDescription>
              Here's a suggestion from our AI. You can edit it after applying.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 p-4 bg-muted/50 rounded-md border text-sm max-h-[40vh] overflow-y-auto">
            {aiSuggestion}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAiSuggestion(null)}>
              Cancel
            </Button>
            <Button onClick={applySuggestion} className="bg-accent hover:bg-accent/90 text-accent-foreground">Use This Description</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
