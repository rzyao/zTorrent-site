import { useState } from "react";
import type { Album, Artist, ModalType, Song, TabType } from "../types";

export function useMusicEditView() {
  const [activeTab, setActiveTab] = useState<TabType>("songs");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<Song | Artist | Album | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleAdd = () => {
    setModalType("add");
    setSelectedItem(null);
    setFormData({});
  };

  const handleEdit = (item: Song | Artist | Album) => {
    setModalType("edit");
    setSelectedItem(item);
    setFormData(item);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
    setFormData({});
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    modalType,
    setModalType,
    selectedItem,
    setSelectedItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    closeModal,
  };
}

