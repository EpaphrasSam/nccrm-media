"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { buttonStyles } from "@/lib/styles";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-brand-black">{title}</h3>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-gray-600">{description}</p>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-3 justify-end w-full">
            <Button
              variant="bordered"
              onPress={onClose}
              className={buttonStyles}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              className={`${buttonStyles} bg-brand-red-dark`}
              onPress={onConfirm}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 