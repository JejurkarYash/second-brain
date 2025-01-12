import { BookMarked, Link2, Tags, Twitter } from "lucide-react";

const features = [
  {
    title: "Multi-content Support",
    description: "Save tweets, videos, documents, and links all in one place",
    icon: BookMarked,
  },
  {
    title: "Smart Organization",
    description: "Use tags and categories to organize your content efficiently",
    icon: Tags,
  },
  {
    title: "Social Integration",
    description:
      "Direct integration with Twitter, YouTube, and other platforms",
    icon: Twitter,
  },
  {
    title: "Quick Access",
    description: "Find any piece of content instantly with powerful search",
    icon: Link2,
  },
];

function Features() {
  return (
    <section
      id="features"
      className="container space-y-12 py-24 md:py-32 font-satoshi "
    >
      <div className="mx-auto max-w-[600px] space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Everything You Need in One Place
        </h2>
        <p className="text-gray-500">
          Organize your digital life with powerful features designed for modern
          content consumption.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative space-y-4 rounded-lg border p-6 hover:border-[#6366f1]"
          >
            <feature.icon className="size-8 text-[#6366f1]" />
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
