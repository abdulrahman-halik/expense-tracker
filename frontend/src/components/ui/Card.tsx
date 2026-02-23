import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    footer?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, title, description, footer, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm overflow-hidden',
                    className
                )}
                {...props}
            >
                {(title || description) && (
                    <div className="p-6 pb-4 space-y-1">
                        {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
                        {description && <p className="text-sm text-gray-500">{description}</p>}
                    </div>
                )}
                <div className={cn('p-6', (title || description) ? 'pt-0' : '')}>
                    {children}
                </div>
                {footer && (
                    <div className="flex items-center p-6 pt-0 border-t border-gray-100 bg-gray-50/50">
                        {footer}
                    </div>
                )}
            </div>
        );
    }
);

Card.displayName = 'Card';

export { Card };
