"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Paperclip, HardDrive, FilePlus, Image, Layers, MoreHorizontal } from "lucide-react";

export type ActionOption = "upload" | "drive" | "create-image" | "canvas";

interface ActionMenuProps {
  onSelect: (option: ActionOption) => void;
  // onMicToggle: () => void;
}

export default function ActionMenu({ onSelect }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Upload files", icon: <Paperclip size={20} />, action: "upload" as ActionOption },
    { label: "Add from Drive", icon: <HardDrive size={20} />, action: "drive" as ActionOption },
    { label: "Create image", icon: <Image size={20} />, action: "create-image" as ActionOption },
    { label: "Canvas", icon: <Layers size={20} />, action: "canvas" as ActionOption },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white p-2 transition-colors"
      >
        <Plus size={24} />
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="absolute bottom-12 left-0 w-64 bg-[#282a2c] rounded-2xl p-2 shadow-xl border border-gray-700 animate-in fade-in zoom-in duration-200">
          {menuItems.map((item) => (
            <button
              key={item.action}
              onClick={() => {
                onSelect(item.action);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full p-3 text-gray-200 hover:bg-[#373a3c] rounded-lg transition-colors"
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}