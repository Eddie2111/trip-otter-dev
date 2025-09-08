"use client"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditTribeForm } from "./edit-tribe-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DeleteTribePrompt } from "./delete-tribe-form";

interface IModifyTribeModalProps { 
  tribeSerial: string;
  type: 'EDIT' | 'DELETE';
  editButton: React.ReactNode;
};

export function ModifyTribeModal({ tribeSerial, type, editButton }: IModifyTribeModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {editButton}
      </DialogTrigger>
      <DialogContent>
        {
          type === 'EDIT' ? (
            <EditTribeForm
              tribeSerial={tribeSerial}
              submitTrigger={setIsOpen}
              closeButton= {
                <Button>Close</Button>
              }
            />
          ) :
            (
              <DeleteTribePrompt
              tribeSerial={tribeSerial}
              onDelete={()=>{}}
              />
            )
        }
      </DialogContent>
    </Dialog>
  )
}
