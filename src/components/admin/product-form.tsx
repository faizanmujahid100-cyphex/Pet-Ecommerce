'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Product, ProductCategory } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Loader2, Trash, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase/provider';
import { addDoc, collection, doc, serverTimestamp, setDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';


const productCategories: ProductCategory[] = ["food", "toys", "litter", "accessories", "siamese", "persian", "sphynx"];

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(productCategories),
  price: z.coerce.number().positive('Price must be a positive number'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  mainImageUrl: z.string().min(1, 'Main image is required').url({ message: "Invalid URL" }),
  galleryImageUrls: z.array(z.object({ value: z.string().url() })).optional().default([]).transform(arr => arr.map(item => item.value)),
  isFeatured: z.boolean().default(false),
  isListed: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ product }: { product: Product | null }) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || 'food',
      price: product?.price || 0,
      stockQuantity: product?.stockQuantity || 0,
      mainImageUrl: product?.mainImageUrl || '',
      galleryImageUrls: product?.galleryImageUrls?.map(url => ({ value: url })) || [],
      isFeatured: product?.isFeatured || false,
      isListed: product?.isListed ?? true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "galleryImageUrls",
  });

  const handleDeleteProduct = async () => {
    if (!product || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot delete a new or invalid product.',
      });
      return;
    }
    try {
      const productRef = doc(firestore, 'products', product.id);
      await deleteDoc(productRef);
      toast({
        title: 'Product Deleted',
        description: `${product.name} has been permanently deleted.`,
      });
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error.message || 'Could not delete the product.',
      });
    }
  };

  async function onSubmit(data: ProductFormData) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available.',
      });
      return;
    }

    try {
      if (product) {
        // Update existing product
        const productRef = doc(firestore, 'products', product.id);
        await setDoc(productRef, {
          ...data,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        toast({
          title: 'Product Updated',
          description: `${data.name} has been successfully updated.`,
        });
        router.refresh();
      } else {
        // Create new product
        const collectionRef = collection(firestore, 'products');
        const newProduct = {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          type: ['siamese', 'persian', 'sphynx'].includes(data.category) ? 'cat' : 'pet_product',
          currency: 'PKR',
          ratingAverage: 0,
          ratingCount: 0,
        };
        await addDoc(collectionRef, newProduct);
        toast({
          title: 'Product Created',
          description: `${data.name} has been successfully created.`,
        });
        router.push('/admin/products');
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'Could not save the product. Please try again.',
      });
    }
  }


  const mainImageUrl = form.watch('mainImageUrl');
  
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
                    Upload a main image and several gallery images for your product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                   <div className="space-y-2">
                    <FormLabel>Main Image</FormLabel>
                    {mainImageUrl && (
                      <div className="relative w-full aspect-video">
                        <Image
                          src={mainImageUrl}
                          alt="Main product image"
                          fill
                          className="object-contain rounded-md border"
                        />
                      </div>
                    )}
                    <CldUploadButton
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      options={{
                        sources: ['local', 'camera', 'url'],
                        multiple: false,
                      }}
                      onSuccess={(result: any) => {
                        if (result.event === 'success' && typeof result.info === 'object' && result.info !== null && 'secure_url' in result.info) {
                          form.setValue('mainImageUrl', result.info.secure_url, { shouldValidate: true });
                          toast({ title: 'Main image uploaded' });
                        }
                      }}
                      className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                    >
                      <UploadCloud className="mr-2"/>
                      {mainImageUrl ? 'Change Main Image' : 'Upload Main Image'}
                    </CldUploadButton>
                    <FormField control={form.control} name="mainImageUrl" render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="hidden" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                  </div>
                  
                  <div>
                    <FormLabel>Gallery Images</FormLabel>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="relative group aspect-square">
                          <Image
                            src={field.value || ''}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <CldUploadButton
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      options={{
                        sources: ['local', 'camera', 'url'],
                        multiple: true,
                      }}
                      onSuccess={(result: any) => {
                        if (result.event === 'success' && typeof result.info === 'object' && result.info !== null && 'secure_url' in result.info) {
                            append({value: result.info.secure_url}, { shouldFocus: false });
                            toast({ title: 'Gallery image added' });
                        }
                      }}
                      className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 w-full')}
                    >
                      <UploadCloud className="mr-2"/>
                      Add Gallery Images
                    </CldUploadButton>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
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

               <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-card">
                            <FormControl>
                                <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                Feature on homepage
                                </FormLabel>
                                <FormDescription>
                                This product will appear on the main homepage.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="isListed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-card">
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                List Product
                                </FormLabel>
                                <FormDescription>
                                Uncheck to hide this product from the shop.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
               </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Product
            </Button>
            {product && (
                 <Button type="button" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={form.formState.isSubmitting}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Product
                </Button>
            )}
          </div>
        </form>
      </Form>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                product from the database.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={handleDeleteProduct}
                className={buttonVariants({ variant: "destructive" })}
            >
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
