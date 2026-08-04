import { Link, createFileRoute } from "@tanstack/react-router";
import { EmbraceForm } from "@/components/soma/Rhythm";
import { Title } from "@/components/soma/Shell";

const title = "Field Note — SOMA FIELD";
const description =
  "A short note for companions and portfolio viewers: the body may still remember a colour, a texture and a rhythm after names have faded.";

export const Route = createFileRoute("/field-note")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FieldNote,
});

function FieldNote() {
  return (
    <div
      data-surface="ivory"
      className="relative flex min-h-[100dvh] w-full flex-col bg-background text-foreground"
    >
      <div aria-hidden="true" className="soma-grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-5 pb-10 pt-6 sm:px-6">
        <header>
          <Link
            to="/"
            className="-ml-2 inline-flex min-h-12 items-center rounded-pill px-2 text-base text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Back
          </Link>
        </header>

        <main className="flex flex-1 flex-col">
          <p className="pt-4 text-[0.9375rem] text-muted-foreground">
            For companions and viewers — not part of the main journey
          </p>

          <div className="mt-3">
            <Title>Field note</Title>
          </div>

          <div className="mt-8 grid place-items-center rounded-card bg-field px-4 py-6">
            <EmbraceForm className="h-44 w-full max-w-[280px]" stage={2} />
          </div>

          <blockquote className="mt-9 border-l-2 border-clay pl-5">
            <p className="font-display text-[1.4rem] leading-[1.4] text-pretty sm:text-[1.5rem]">
              I understand: you are living through a long farewell.{" "}
              <br />
              Even if you no longer remember me,{" "}
              <br />
              I will not forget loving you.
            </p>
            <footer className="mt-4 text-base text-muted-foreground">
              — Notes from My Care Design Journal
            </footer>
          </blockquote>

          <p className="mt-9 text-[1.0625rem] leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Her hands stopped trembling when they touched the blanket. She held it close and began to
            pat it in the rhythm of a lullaby.
          </p>

          <p className="mt-8 text-[1.0625rem] leading-relaxed text-pretty sm:text-lg">
            When names fade, the body may still remember a colour, a texture, a rhythm, or the shape
            of holding someone. SOMA FIELD does not treat, test or record. It only turns attention
            gently toward a real object, a room, a sound and the body&apos;s own response.
          </p>

          <div className="mt-auto pt-10">
            <Link
              to="/"
              className="block w-full rounded-pill bg-action px-6 py-5 text-center text-lg font-medium text-action-foreground transition-all duration-[400ms] hover:opacity-90 active:scale-[0.985]"
            >
              Return to the field
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
