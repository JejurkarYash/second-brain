import { Trash2 } from "lucide-react";
import { Button } from "./Button";

type objectType = {
  contentId: any;
  title: string;
};

interface deleteContentModelProps {
  isOpen: boolean;
  onClose: () => void;
  Data: objectType;
  onDelete: (contentId: any) => void;
}

const DeleteModel = ({
  isOpen,
  onClose,
  Data,
  onDelete,
}: deleteContentModelProps) => {
  return (
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
        <div>
          <div className=" flex flex-col items-center justify-center m-3  ">
            <Trash2 size={100} className=" text-primary mt-4    " />
            <h1 className="mt-3 text-lg   font-bold  ">
              Are You Sure you want to delete ?
            </h1>
            <p className=" text-gray-500 ">{Data.title}</p>
          </div>
          <div className="flex flex-row items-center justify-center space-x-6 m-3 my-8    ">
            <Button
              variant={"secondary"}
              onClick={onClose}
              className=" w-[30%]"
            >
              Cancel
            </Button>

            <Button
              className=" border-red-600 text-red-500 hover:bg-red-600 hover:text-white w-[30%]  "
              variant={"outline"}
              onClick={() => onDelete(Data.contentId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModel;
