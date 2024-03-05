import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, debitis
        quaerat adipisci nostrum nobis dolorum harum voluptate repudiandae sunt
        cum. Numquam modi debitis, non voluptatem voluptatibus earum
        reprehenderit optio amet?
      </p>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  );
}
