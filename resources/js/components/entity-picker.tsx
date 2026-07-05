import { Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EntityPickerProps<T> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    searchPlaceholder?: string;
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    isSelected: (item: T) => boolean;
    onSelect: (item: T) => void;
    filterFn: (item: T, search: string) => boolean;
    maxResults?: number;
}

export function EntityPicker<T>({
    open,
    onOpenChange,
    title,
    description,
    searchPlaceholder = 'Cari...',
    items,
    renderItem,
    isSelected,
    onSelect,
    filterFn,
    maxResults = 50,
}: EntityPickerProps<T>) {
    const [search, setSearch] = useState('');

    const filtered = search.length > 0
        ? items.filter((item) => filterFn(item, search)).slice(0, maxResults)
        : items.slice(0, maxResults);

    const handleSelect = (item: T) => {
        onSelect(item);
        setSearch('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => {
 onOpenChange(v);

 if (!v) {
setSearch('');
} 
}}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                            autoFocus
                        />
                    </div>

                    <ScrollArea className="h-72">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    {search.length > 0 ? 'Data tidak ditemukan' : 'Tidak ada data'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1 p-1">
                                {filtered.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant={isSelected(item) ? 'default' : 'ghost'}
                                        className="w-full justify-start text-left h-auto py-2"
                                        onClick={() => handleSelect(item)}
                                    >
                                        {renderItem(item)}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    {filtered.length >= maxResults && (
                        <p className="text-center text-xs text-muted-foreground">
                            Menampilkan {maxResults} hasil pertama. Ketik untuk mempersempit pencarian.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
