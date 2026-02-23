import { cn } from '../../utils/cn';

interface SkeletonProps {
    className?: string;
    variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton = ({ className: customClassName, variant = 'rect' }: SkeletonProps) => {
    const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800';

    const variantClasses = {
        rect: 'rounded-md',
        circle: 'rounded-full',
        text: 'rounded-md h-4 w-full',
    };

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                customClassName
            )}
        />
    );
};

export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
    <div className="flex items-center space-x-4 p-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
        {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-1/4' : 'flex-1'}`} />
        ))}
    </div>
);

export const CardSkeleton = () => (
    <div className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-10" variant="circle" />
            <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
    </div>
);
