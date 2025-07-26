import React from 'react';
import { AddProductForm } from '@/components/layout/dashboard/components/new-product';

export default function NewProductPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-10">
      <div className="w-full max-w-xl"> {/* Maintain max-width for form centering */}
        <h1 className="text-3xl font-bold text-center mb-4">Add New Product</h1>
        <p className="text-muted-foreground text-center mb-8">
          Fill in the details below to add a new product to your inventory.
        </p>
        <AddProductForm />
      </div>
    </div>
  );
}