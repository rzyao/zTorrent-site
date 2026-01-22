import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/forum/components/ui/dialog";
import { Button } from "@/modules/forum/components/ui/button";
import { Input } from "@/modules/forum/components/ui/input";
import { Label } from "@/modules/forum/components/ui/label";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUrl("");
    }
  }, [isOpen]);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onConfirm(url);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>插入图片</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleConfirm} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">图片地址</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.png"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="default" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={!url}>
              确定
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
