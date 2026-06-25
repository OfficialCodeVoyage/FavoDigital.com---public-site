import { site } from "@/lib/site";
import { GamifiedHero } from "@/components/GamifiedHero";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className="favo-hex-field flex min-h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Primary content / SEO payload */}
          <section className="favo-rise flex flex-col gap-8">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium">
              <span className="tracking-tight text-paper">{site.name}</span>
              <span aria-hidden="true" className="text-ink-border">
                /
              </span>
              <span className="text-muted">
                Web · Marketing · <span className="text-honey">AI</span> studio
              </span>
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Websites &amp; AI,{" "}
              <span className="text-honey-bright">built to perform.</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {site.description}
            </p>

            <div className="flex flex-col gap-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-honey">
                What we do
              </h2>
              <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
                {site.services.map((service) => (
                  <li key={service.title} className="flex flex-col gap-1.5">
                    <h3 className="font-medium text-paper">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {service.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey/10 px-3 py-1 text-xs font-medium text-honey">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-honey"
                />
                Launching soon
              </span>
              <span className="text-sm text-muted">{site.serviceArea}</span>
            </div>

            <p className="text-sm text-muted">
              Want to start a project?{" "}
              <a
                href={`mailto:${site.email}`}
                className="rounded-sm font-medium text-honey-bright underline decoration-honey/40 underline-offset-4 transition-colors hover:decoration-honey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
              >
                {site.email}
              </a>
            </p>
          </section>

          {/* Complementary placeholder hero */}
          <aside aria-label="Coming soon preview">
            <GamifiedHero />
          </aside>
        </div>
      </div>

      <footer className="mx-auto w-full max-w-5xl px-6 pb-10 sm:px-8">
        <p className="text-xs text-muted">
          © {year} {site.name}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
