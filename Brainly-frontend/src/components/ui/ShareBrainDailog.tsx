import { Label } from "@radix-ui/react-label";
import { Check, Copy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./input";
import axios from "axios";
import { Button } from "./Button";

interface ShareBrainDailogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareBrainDailog = ({ isOpen, onClose }: ShareBrainDailogProps) => {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    const getLink = async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_backendUrl}/api/v1/brain/share`,
        {
          share: true,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const hash = response.data.hash;
      const link = `${import.meta.env.VITE_frontendUrl}/shared-brain/${hash}`;
      setShareLink(link);
      console.log(shareLink);
    };

    getLink();
  }, []);

  const handleCopyButton = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-gray-700 fixed inset-0 flex justify-center items-center z-50 font-satoshi ${
        isOpen ? "bg-opacity-60 w-screen h-screen " : "invisible"
      }`}
      onClick={onClose}
    >
      {/* Main modal */}
      <div
        className={`bg-white h-auto w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] lg:text-left  rounded-lg shadow-xl transform transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container flex flex-col justify-center p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between">
            <Label className="text-lg sm:text-xl font-semibold">
              Share Your Second Brain
            </Label>
            <X
              size={25}
              className="cursor-pointer text-gray-400 hover:text-black transition-colors duration-300"
              onClick={onClose}
            />
          </div>
          <p className="text-sm mt-2 text-gray-400">
            Share your knowledge with others. Choose who can access your
            content.
          </p>

          {/* Share Link */}
          <div className="flex flex-col mt-4 space-y-3">
            <h1 className="text-base font-medium">Share Link</h1>
            <div className="flex items-center space-x-3">
              <Input
                className="w-[18rem] sm:w-[20rem] text-gray-600"
                readOnly
                value={shareLink}
              />
              <span
                className="bg-[#ede7ff] w-10 h-10 flex items-center justify-center rounded-md hover:cursor-pointer"
                onClick={handleCopyButton}
              >
                {copied ? <Check /> : <Copy />}
              </span>
            </div>
          </div>

          {/* Done Button */}
          <div className="flex justify-end mt-6">
            <Button
              className="w-full sm:w-20"
              variant={"secondary"}
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareBrainDailog;
