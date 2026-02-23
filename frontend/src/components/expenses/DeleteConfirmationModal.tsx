import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    title?: string;
}

export const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    title = "Delete Transaction"
}: DeleteConfirmationModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                    <AlertTriangle size={24} className="shrink-0" />
                    <p className="text-sm">
                        Are you sure you want to delete this transaction? This action cannot be undone.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        isLoading={isLoading}
                        leftIcon={<Trash2 size={18} />}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
