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

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string, text: string) => void;
  initialText?: string;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialText = "",
}) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isOpen) {
      setUrl("");
      setText(initialText);
    }
  }, [isOpen, initialText]);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onConfirm(url, text || url);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>插入链接</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleConfirm} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="link-text">链接文字</Label>
            <Input
              id="link-text"
              placeholder="显示文本"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus={!initialText}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-url">链接地址</Label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus={!!initialText}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
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
