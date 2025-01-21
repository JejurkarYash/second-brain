import AddContentModal from "@/components/ui/AddContentModal";
import { Button } from "@/components/ui/Button";
import { ContentCard } from "@/components/ui/ContentCard";
import Sidebar from "@/components/ui/Sidebar";
import { Label } from "@radix-ui/react-label";
import { PlusIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useContents } from "@/hooks/useContents";
import ShareBrainDailog from "@/components/ui/ShareBrainDailog";
import EmptyDashboard from "@/components/EmptyDashboard";
import axios from "axios";
const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [shareBrainModal, setShareBrainModal] = useState(false);
  const { contents, fetchData } = useContents();
  const [contentType, setContentType] = useState("all");
  const [isEmpty, setIsEmpty] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
    if (contents.length !== 0) {
      setIsEmpty(false);
    }
  }, [modalOpen]);

  useEffect(() => {
    setIsEmpty(contents.length === 0);
  }, [contents]);

  const handleAddContent = () => {
    setModalOpen(true);
  };

  const handleShareBrain = () => {
    if (contents.length !== 0) {
      setShareBrainModal(true);
      setIsEmpty(false);
    }
  };

  const handleSidebarItemClick = (type: string) => {
    setContentType(type);
    setSidebarOpen(false); // Close sidebar on item click (for mobile view)
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      console.log(`${import.meta.env.VITE_backendUrl}/api/v1/content`);
      const response = await axios.delete(
        `${import.meta.env.VITE_backendUrl}/api/v1/content`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          data: {
            contentId,
          },
        }
      );

      if (response.status === 200) {
        fetchData();
      } else {
        console.log("Error in Deleting ");
      }
    } catch (e) {
      console.log(" Error in Deleting the Content ", e);
    }
  };

  return (
    <main className="fixed font-satoshi top-0 left-0 flex flex-col md:flex-row justify-between gap-4 md:gap-6 w-full h-screen bg-purple-50 overflow-y-auto">
      {/* Add content modal */}
      <AddContentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <ShareBrainDailog
        isOpen={shareBrainModal}
        onClose={() => setShareBrainModal(false)}
      />

      {/* Hamburger menu for mobile view */}
      <div className="md:hidden flex items-center p-4">
        <button
          className="text-2xl focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 bg-white h-full w-3/4 md:w-1/4 lg:w-1/5 transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar onClick={handleSidebarItemClick} />
      </div>

      <div className="flex flex-col w-full h-full p-4 md:p-6 overflow-y-scroll">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <Label className="text-2xl md:text-3xl font-bold font-satoshi mb-4 md:mb-0">
            All Notes
          </Label>
          <div className="flex gap-4">
            <Button variant={"secondary"} onClick={handleShareBrain}>
              <Share2 size={20} />
              <span>Share Brain</span>
            </Button>
            <Button onClick={handleAddContent}>
              <PlusIcon />
              <span>Add Content</span>
            </Button>
          </div>
        </div>

        {/* Content Cards */}
        {/* <div className="flex flex-col items-center justify-center   "> */}
        {isEmpty && <EmptyDashboard />}
        <div className="grid grid-cols-1 space-y-4  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 items-center   w-full">
          {contentType === "all"
            ? contents.map(({ link, type, title, _id }) => (
                <ContentCard
                  key={_id}
                  url={link}
                  type={type}
                  title={title}
                  onDelete={() => handleDeleteContent(_id)}
                />
              ))
            : contents
                .filter(({ type }) => type === contentType)
                .map(({ link, type, title, _id }) => (
                  <ContentCard
                    key={_id}
                    url={link}
                    type={type}
                    title={title}
                    onDelete={() => handleDeleteContent(_id)}
                  />
                ))}
        </div>
        {/* </div> */}
      </div>
    </main>
  );
};

export default Dashboard;
