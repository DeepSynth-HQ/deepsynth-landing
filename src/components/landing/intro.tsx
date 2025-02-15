import Logo from "../common/logo";
import { AuroraText } from "../ui/aurora-text";
import { Button } from "../ui/button";
import { Meteors } from "../ui/meteors";
import { RainbowButton } from "../ui/rainbow-button";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import { cn } from "@/libs/utils";
import Link from "next/link";

export default function Intro() {
  return (
    <section className="relative mx-auto flex h-svh items-center justify-center overflow-hidden bg-gradient-to-b from-[hsl(var(--background-secondary))] to-background">
      <Meteors number={30} />
      <div className="flex w-full max-w-7xl flex-col gap-10">
        <div className="flex items-center justify-center">
          <div
            className={cn(
              "group flex items-center space-x-2 rounded-full border border-secondary/5 bg-secondary px-4 py-1 text-base transition-all ease-in",
            )}>
            <Logo className="size-4" />
            <AnimatedShinyText className="inline-flex items-center justify-center text-secondary-foreground transition ease-out">
              Introducing DeepSynth Agent
            </AnimatedShinyText>
          </div>
        </div>
        <h1 className="mx-auto text-center text-4xl font-bold tracking-tighter text-foreground md:text-5xl lg:text-7xl">
          The{" "}
          <AuroraText className="leading-normal">
            Intelligent Assistant
          </AuroraText>{" "}
          for onchain action with{" "}
          <AuroraText className="leading-normal">Natural Language</AuroraText>
        </h1>
        <p className="text-center text-lg text-foreground/60">
          Transform complex blockchain interactions into simple conversations.
          <br />
          Our intelligent assistant makes on-chain actions as easy as chatting
          with a friend.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link href={"/conversation"}>
            <RainbowButton>Get Started</RainbowButton>
          </Link>
          <Link
            href={"https://docs.deepsynth.org"}
            target={"_blank"}>
            <Button variant={"secondary"}>Read Documentation</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
