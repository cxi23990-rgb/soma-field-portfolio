import type { ReactNode } from "react";
import { RainGlass } from "@/components/soma/Window";
import { ThreadCue } from "@/components/soma/Thread";
import { EmbraceForm } from "@/components/soma/Rhythm";
import origin from "@/assets/field/03_personal_memory_story.jpg.asset.json";
import materials from "@/assets/field/05_personal_making_materials.jpg.asset.json";
import craftDisplay from "@/assets/field/08_resident_craft_display.jpg.asset.json";
import windowDaylight from "@/assets/field/IMG_0146.jpg.asset.json";
import windowProjection from "@/assets/field/IMG_0147.jpg.asset.json";
import windowGarden from "@/assets/field/IMG_0192.jpg.asset.json";
import clothCrop from "@/assets/field/cloth_yellow_bedding_privacy_crop_v2.jpg.asset.json";
import threadCrop from "@/assets/field/thread_work_surface_privacy_crop.jpg.asset.json";
import pencilHolder from "@/assets/field/crochet_pencil_holder.jpg.asset.json";
import ornaments from "@/assets/field/crochet_ornaments.jpg.asset.json";
import floorPlan from "@/assets/field/care_floor_plan.jpg.asset.json";
import clearance from "@/assets/field/wheelchair_clearance.jpg.asset.json";

function Sheet({ children }: { children: ReactNode }) {
  return <section className="mt-14 border-t border-hairline pt-10 first:mt-0 first:border-0 first:pt-0">{children}</section>;
}

function Caption({ children }: { children: ReactNode }) {
  return <figcaption className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">{children}</figcaption>;
}

const fragments = [
  { number: "Fragment 01", label: "The Empty Room", excerpt: "She no longer remembered herself, or the people who brought her to the window each day.", text: "She no longer remembered herself. When a caregiver called her Auntie Hua, she lifted her head slowly, her gaze as empty as an old room after every piece of furniture had been carried away. She did not recognise the face in the mirror, the faded photograph by the bed, or the people who brought her to the window each day." },
  { number: "Fragment 02", label: "The Hands", excerpt: "Her eyes were empty, but her fingers were full.", text: "But her hands recognised a crochet hook. The instant the hook entered a loop, her fingers bent into a curve practised across a lifetime. She did not look at the hook or the yarn. Her eyes were empty, but her fingers were full. Flowers, birds and small animals continued to emerge from the thread." },
  { number: "Fragment 03", label: "The Cloth", excerpt: "When her fingers touched the faded yellow cotton, the trembling stopped.", text: "A pale-blue pram arrived beside the window. Inside was a faded yellow cotton blanket. When her fingers touched its corner, the trembling stopped. She smoothed folds that were not there, folded the blanket edge to edge, held it against her chest and began to pat it slowly, once and then again." },
  { number: "Fragment 04", label: "The Rhythm", excerpt: "She did not know what she was remembering. Her body knew.", text: "She hummed a song whose melody had broken apart, but the rhythm was exact: the rhythm of a lullaby carried for decades. Her arms formed the curve of holding a child. She did not know what she was remembering. Her body knew." },
  { number: "Fragment 05", label: "The Thread", excerpt: "She had forgotten the world. Her hands had not.", text: "By night, she sat with the crochet hook beneath the window. Ivory yarn moved through her hands like a stream that had not dried up. Names, faces and places had faded, but the gesture remained. She had forgotten the world. Her hands had not." },
];

const encounterModel = [
  ["Choose", "One nearby sensory invitation"],
  ["Notice", "Stay with whatever draws attention"],
  ["Keep", "A colour and a word, or nothing"],
] as const;

export function FieldNoteContent({ onReturn }: { onReturn: ReactNode }) {
  return (
    <div data-surface="ivory" className="relative min-h-[100dvh] w-full bg-background text-foreground">
      <div aria-hidden="true" className="soma-grain pointer-events-none absolute inset-0" />
      <article className="relative mx-auto w-full max-w-[430px] px-5 pb-16 pt-5 sm:px-6 md:max-w-[760px] md:px-10">
        <div className="sticky top-0 z-10 -mx-5 mb-6 bg-background/95 px-5 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 md:-mx-10 md:px-10">{onReturn}</div>
        <p className="text-[0.9375rem] text-muted-foreground">For companions, reviewers and caregivers</p>
        <h1 className="mt-3 font-display text-[2.15rem] leading-[1.12] text-balance sm:text-[2.45rem]">Field Note · The Hands Remember</h1>

        <nav aria-label="Sections" className="mt-7 border-t border-hairline pt-5">
          <ol className="space-y-2 text-base leading-relaxed text-muted-foreground">
            <li><a href="#field-observation" className="underline decoration-hairline underline-offset-4 hover:text-foreground">1 · Field observation</a></li>
            <li><a href="#hands-remember" className="underline decoration-hairline underline-offset-4 hover:text-foreground">2 · The Hands Remember</a></li>
            <li><a href="#evidence-to-interaction" className="underline decoration-hairline underline-offset-4 hover:text-foreground">3 · From evidence to interaction</a></li>
            <li><a href="#spatial-references" className="underline decoration-hairline underline-offset-4 hover:text-foreground">4 · Spatial and accessibility references</a></li>
          </ol>
        </nav>

        <Sheet>
          <h2 id="field-observation" className="font-display text-[1.6rem] leading-tight text-balance sm:text-[1.85rem]">1 · Field observation</h2>
          <p className="mt-5 max-w-[62ch] text-[1.125rem] leading-relaxed text-pretty">SOMA FIELD translates observed sensory and embodied responses into three quiet encounters. It does not attempt to reconstruct a biography or verify a memory.</p>
          <p className="mt-5 rounded-card border border-hairline bg-field px-5 py-5 text-[1.0625rem] leading-relaxed text-pretty">An anonymised composite field narrative, written after observation in a residential care setting. It is a literary reflection, not a verbatim interview or a clinical finding.</p>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground">Field documentation is shown with identifying details excluded. Observations are qualitative and are not clinical evidence.</p>

          <section className="mt-10"><h3 className="font-display text-[1.3rem]">Window · Light, weather and atmosphere</h3><div className="mt-4 grid gap-4 sm:grid-cols-3">{[[windowDaylight,"Diffused daylight and curtain movement."],[windowProjection,"Projected atmosphere in a sensory activity room."],[windowGarden,"Seasonal colour and outdoor orientation."]].map(([asset, caption]) => <figure key={caption as string}><img src={(asset as typeof windowDaylight).url} alt={caption as string} loading="lazy" width={1200} height={900} className="aspect-[4/3] w-full rounded-card border border-hairline object-cover" /><Caption>{caption as string}</Caption></figure>)}</div></section>

          <section className="mt-12"><h3 className="font-display text-[1.3rem]">Cloth · Soft material and holding</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><img src={clothCrop.url} alt="Privacy-cropped view of bright yellow floral bedding with a white handmade textile and crocheted edging; no person is shown." loading="lazy" width={1080} height={780} className="aspect-[4/3] w-full rounded-card border border-hairline object-cover" /><img src={materials.url} alt="Tabletop of handmade flowers, colourful activity objects, wooden pieces, glass objects and a rainbow xylophone." loading="lazy" width={1440} height={1920} className="aspect-[4/3] w-full rounded-card border border-hairline object-cover" /></div><Caption>Soft material, familiar colour and objects within reach.</Caption></section>

          <section className="mt-12"><h3 className="font-display text-[1.3rem]">Thread · Making and hand memory</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><img src={threadCrop.url} alt="Privacy-cropped care-setting work surface with yarn, crocheted objects, plants and familiar tabletop items; no person is shown." loading="lazy" width={820} height={1090} className="aspect-[4/3] w-full rounded-card border border-hairline object-cover" /><img src={craftDisplay.url} alt="Care-setting craft exhibition with paintings, textile work and handmade objects arranged on folded white display panels." loading="lazy" width={1920} height={1440} className="aspect-[4/3] w-full rounded-card border border-hairline object-cover" /><img src={pencilHolder.url} alt="Two joined crocheted cups in green and cream holding small tools on a crocheted mat." loading="lazy" width={800} height={1422} className="aspect-[4/3] w-full rounded-card border border-hairline object-cover" /><img src={ornaments.url} alt="Blue and pink looped crocheted ornaments beside yarn and tools in a making space." loading="lazy" width={700} height={526} className="aspect-[4/3] w-full rounded-card border border-hairline object-cover" /></div><Caption>Yarn, repeated hand movement and handmade traces observed in the care environment.</Caption></section>
        </Sheet>

        <Sheet>
          <h2 id="hands-remember" className="font-display text-[1.6rem] leading-tight text-balance sm:text-[1.85rem]">2 · The Hands Remember</h2>
          <figure className="mt-7">
            <img src={origin.url} alt="A care-setting field artefact combining handwritten Chinese text, a painting of an older wheelchair user reaching toward a dancer, chairs, cushions, a lamp and everyday activity objects." loading="lazy" width={1920} height={1440} className="w-full rounded-card border border-hairline" />
            <Caption>An authored field artefact in the care setting: handwritten words, painting and everyday activity objects.</Caption>
          </figure>
          <blockquote className="mt-8 border-l-2 border-clay pl-5"><p className="font-display text-[1.4rem] leading-[1.45] text-pretty sm:text-[1.55rem]">I know you are making a long farewell to life.<br />Even if you no longer remember me,<br />I will not forget how to love you.</p><footer className="mt-4 text-base text-muted-foreground">— Notes from a care design field journal</footer></blockquote>
          <div className="mt-9 grid gap-6 sm:grid-cols-2">
            {fragments.map((fragment) => <article key={fragment.number} className="border-t border-hairline pt-4"><p className="text-xs uppercase tracking-[0.1em] text-faint">{fragment.number}</p><h3 className="mt-2 font-display text-xl">{fragment.label}</h3><p className="mt-2 text-base leading-relaxed text-muted-foreground">{fragment.excerpt}</p></article>)}
          </div>
          <details className="mt-9 rounded-card border border-hairline bg-field px-5 py-4 open:pb-6"><summary className="cursor-pointer font-display text-xl">Read the complete field narrative</summary><div className="mt-7 flex flex-col gap-8">{fragments.map((fragment) => <article key={fragment.number}><h3 className="font-display text-xl">{fragment.label}</h3><p className="mt-3 text-[1.0625rem] leading-[1.75] text-pretty">{fragment.text}</p></article>)}</div></details>
          <p className="mt-10 max-w-[62ch] font-display text-[1.35rem] leading-[1.5] text-pretty sm:text-[1.45rem]">SOMA FIELD does not ask a person to retrieve the correct memory. It offers light, cloth, sound and movement, then waits to see what the body chooses.</p>
        </Sheet>

        <Sheet>
          <h2 id="evidence-to-interaction" className="font-display text-[1.6rem] leading-tight text-balance sm:text-[1.85rem]">3 · From evidence to interaction</h2>
          <dl className="mt-7 grid gap-5 sm:grid-cols-3">
            {encounterModel.map(([term, meaning]) => <div key={term} className="border-t border-hairline pt-4"><dt className="text-xs font-medium uppercase tracking-[0.1em] text-faint">{term}</dt><dd className="mt-2 text-base leading-relaxed">{meaning}</dd></div>)}
          </dl>
          <p className="mt-7 max-w-[62ch] text-base leading-relaxed text-muted-foreground">A saved trace is a preference trace, not an assessment or diagnosis. It can help a companion offer the same invitation later without asking the person to remember an earlier response.</p>
          <div className="mt-9 grid gap-7 md:grid-cols-3">
            <article className="border-t border-hairline pt-5"><h3 className="font-display text-xl">Listen · Window</h3><div className="mt-4 grid place-items-center rounded-card bg-field p-4"><RainGlass className="h-36 w-full" /></div><p className="mt-4 text-base leading-relaxed text-muted-foreground">Window turns changing light, weather and gentle movement into an invitation that can be followed without requiring recall.</p></article>
            <article className="border-t border-hairline pt-5"><h3 className="font-display text-xl">Look · Cloth</h3><div className="mt-4 grid place-items-center rounded-card bg-field p-4"><EmbraceForm className="h-36 w-full" stage={2} /></div><p className="mt-4 text-base leading-relaxed text-muted-foreground">Cloth uses smoothing, folding and holding as familiar embodied actions.</p></article>
            <article className="border-t border-hairline pt-5"><h3 className="font-display text-xl">Touch · Thread</h3><div className="mt-4 grid place-items-center rounded-card bg-field p-4"><ThreadCue className="h-36 w-full" stage={1} /></div><p className="mt-4 text-base leading-relaxed text-muted-foreground">Thread offers repetition and unfinished making without evaluating the result.</p></article>
          </div>
        </Sheet>

        <Sheet>
          <h2 id="spatial-references" className="font-display text-[1.6rem] leading-tight text-balance sm:text-[1.85rem]">4 · Spatial and accessibility references</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2"><img src={floorPlan.url} alt="Authored residential care floor-plan drawing with room labels, furniture and circular wheelchair turning clearances." loading="lazy" width={1069} height={1229} className="w-full rounded-card border border-hairline bg-field" /><img src={clearance.url} alt="Authored diagrams of wheelchair turning, bedside care and rotation clearances with metric annotations." loading="lazy" width={1288} height={812} className="w-full rounded-card border border-hairline bg-field" /></div>
          <Caption>Authored design research rather than user-interface imagery. Reach, turning radius, distance and pause informed the encounter design.</Caption>
          <h3 className="mt-10 font-display text-[1.3rem]">Ethics and privacy note</h3>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground"><p>No resident name, face, diagnosis or record appears in this material.</p><p>The narrative is an anonymised composite. It does not imply that a gesture proves a particular memory, history or diagnosis.</p><p>Saved traces remain on the current device. They are preferences for a later invitation, not clinical evidence and not a record of behaviour.</p></div>
        </Sheet>
        <div className="mt-14 border-t border-hairline pt-8">{onReturn}</div>

      </article>
    </div>
  );
}