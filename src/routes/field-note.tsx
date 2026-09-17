import { Link, createFileRoute } from "@tanstack/react-router";
import { FieldNoteContent } from "@/components/soma/FieldNote";
import shareImage from "@/assets/field/soma-field-share-v2.jpg.asset.json";

const title = "Field Note · The Hands Remember — SOMA FIELD";
const description =
  "An anonymised composite field narrative and the care-setting documentation behind the three SOMA FIELD encounters: Listen · Window, Look · Cloth and Touch · Thread.";

export const Route = createFileRoute("/field-note")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://soma.work-jiangnan.com/field-note" },
      { property: "og:image", content: `https://soma.work-jiangnan.com${shareImage.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `https://soma.work-jiangnan.com${shareImage.url}` },
    ],
    links: [{ rel: "canonical", href: "https://soma.work-jiangnan.com/field-note" }],
  }),
  component: FieldNote,
});

function FieldNote() {
  return (
    <FieldNoteContent
      onReturn={
        <Link
          to="/"
          className="inline-flex min-h-12 items-center rounded-pill border border-hairline px-5 text-base text-foreground transition-colors duration-300 hover:border-foreground"
        >
          Back to SOMA FIELD
        </Link>
      }
    />
  );
}
