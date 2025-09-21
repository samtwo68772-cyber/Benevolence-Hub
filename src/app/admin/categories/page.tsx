
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCategories } from '@/lib/db';
import { addCategory } from './_actions/categories';
import { CategoryActions } from './_components/category-actions';
import { CategoryDialog } from './_components/category-dialog';

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

  return (
    <div className="flex flex-col h-full gap-6 p-4 sm:p-6 w-full max-w-full overflow-x-auto">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <h1 className="text-2xl font-semibold"></h1>
            <CategoryDialog onSave={addCategory}>
                <Button><PlusCircle className="mr-2" />Add Category</Button>
            </CategoryDialog>
        </div>

       <Card className="w-full">
          <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Manage the categories for your projects.</p>
          </CardContent>
       </Card>

      <div className="rounded-lg border flex-1 flex flex-col w-full overflow-x-auto">
        <div className="relative flex-grow w-full">
          <ScrollArea className="absolute inset-0 w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                        <CategoryActions category={category} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
