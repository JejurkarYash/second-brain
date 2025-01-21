import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./Button";
import { FormEvent, useState } from "react";
import axios from "axios";

interface AddContentModalProp {
  isOpen: boolean;
  onClose: () => void;
}

const AddContentModal = ({ isOpen, onClose }: AddContentModalProp) => {
  const [title, setTitle] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [link, setLink] = useState<string>("");

  const backendUrl = `${import.meta.env.VITE_backendUrl}`;

  const handleAddContent = async (e: FormEvent) => {
    e.preventDefault(); // preventing the page reload
    const Data = {
      title,
      link,
      type: contentType,
    };
    const token = localStorage.getItem("token");
    try {
      const url = `${backendUrl}/api/v1/content`;
      console.log(url);
      await axios.post(url, Data, {
        headers: {
          Authorization: token,
        },
      });
    } catch (e) {
      // console.log(e);
    }

    setTitle("");
    setContentType("");
    setLink("");

    // closing the modal when the add content button is clicked
    onClose();
  };

  return (
    // backdrop
    <div
      className={`bg-gray-700 fixed inset-0 flex justify-center items-center z-50 font-satoshi ${
        isOpen ? "bg-opacity-60" : "invisible"
      }`}
      onClick={onClose}
    >
      {/* main modal */}
      <div
        className={`bg-white h-auto w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] rounded-lg shadow-xl transform transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg sm:text-xl font-semibold font-satoshi">
            Add New Content
          </h1>
          <X
            size={25}
            className="cursor-pointer text-gray-400 hover:text-black transition-colors duration-300"
            onClick={onClose}
          />
        </div>

        <div>
          <form onSubmit={handleAddContent} className="space-y-4 p-4">
            <div className="flex flex-col gap-2 text-left ">
              <Label className="text-sm font-medium">Title</Label>
              <Input
                className="w-full border focus-visible:ring-gray-700"
                placeholder="Enter the title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-left font-medium">Type</Label>
              <select
                className="w-full h-10 rounded-md outline-none  border border-neutral-200 p-2 focus:border-neutral-900 focus:border-2 "
                name="contentType"
                onChange={(e) => setContentType(e.target.value)}
                value={contentType}
                required
              >
                <option value="" disabled className="text-neutral-500">
                  Select Content Type
                </option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="article">Article</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-left ">Link</Label>
              <Input
                className="w-full border focus-visible:ring-gray-700"
                placeholder="Enter the link..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant={"secondary"}
                className="w-36 text-sm font-medium shadow-md hover:shadow-lg"
                type="submit"
                onClick={handleAddContent}
              >
                Add Content
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContentModal;
