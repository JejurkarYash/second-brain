import emptyDashboard from "../assets/empty-dashboard.png";

const EmptyDashboard = () => {
  return (
    <div className="container flex items-center justify-center font-satoshi px-4 sm:px-8">
      <div className="sub-container flex flex-col space-y-6 justify-center w-full max-w-lg sm:max-w-md lg:max-w-xl">
        <div className="flex flex-col justify-center items-center">
          <img
            src={emptyDashboard}
            alt="empty dashboard icon"
            className="h-48 sm:h-56 lg:h-72"
          />
        </div>
        <div className="flex flex-col space-y-2 text-center sm:text-left  ">
          <h2 className="font-bold text-lg sm:text-xl lg:text-2xl lg:text-center ">
            No Content Found
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base lg:text-lg lg:text-center ">
            Start building your second brain by adding your first note. You can
            add tweets, videos, documents, or links.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyDashboard;
