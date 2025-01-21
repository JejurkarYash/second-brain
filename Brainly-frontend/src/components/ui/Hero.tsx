import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import { motion } from "motion/react";

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // checking if the token is present or not
    const token = localStorage.getItem("token");

    // if the token is present then it will redirect to the dashboard
    if (token) {
      navigate("/notes");
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="container relative font-satoshi ">
      <div className="flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl space-x-2  md:text-6xl    ">
            <span>Your Digital Second Brain for</span>
            <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              Everything
            </span>
          </h1>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
            Save, organize, and access all your digital content in one place.
            From tweets to videos, documents to links - everything you need,
            instantly accessible.
          </p>
        </motion.div>
        <div className="flex flex-col gap-4 min-[400px]:flex-row">
          <Button
            size="lg"
            className="bg-[#6366f1] hover:bg-[#6366f1]/90"
            onClick={handleGetStarted}
          >
            <Brain className="mr-2 size-4 shadow-lg " />
            Start Your Brain
          </Button>
          {/* <Button size="lg" variant="outline">
            <Share2 className="mr-2 size-4" />
            Share Brainp
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
