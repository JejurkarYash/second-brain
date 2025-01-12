import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "./card";
// import { Twitter } from "lucide-react";

interface FeaturesCardPorps {
  title: string;
  description: string;
  icon: "twitter";
}

// const icons = {
//   twiiter: <Twitter className=" text-purple-700 " size={40} />,
// };

const FeaturesCard = (props: FeaturesCardPorps) => {
  return (
    <div className=" flex flex-col items-center justify-center m-5 ">
      <Card className=" min-h-[5rem] w-[50vh] flex flex-col items-center justify-center ">
        <CardHeader className=" flex flex-col items-center justify-center space-y-3 ">
          <CardTitle className=" font-satoshi font-semibold ">
            {props.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{props.description}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesCard;
