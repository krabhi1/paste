import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = () => {
  return [{ title: "About | Paste — Minimal Text Sharing" }];
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto w-full py-20 px-6">
      <div className="space-y-8">
        {/* About Section */}
        <section className="space-y-4">
          <p className=" font-medium leading-relaxed text-foreground/90">
            A lightweight tool for minimal text sharing. Designed for speed and
            simplicity, ensuring your content is easy to share, search, and read
            without any unnecessary bloat.
          </p>
        </section>

        {/* Features Section */}
        <section className="space-y-6">
          <h2 className="text-lg text-primary/70">Features</h2>
          <ul className="space-y-4">
            {[
              "Instant search across titles and content",
              "Automatic expiration for ephemeral sharing",
              "Syntax highlighting for multiple languages",
              "Clean raw text view for simple consumption",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3  font-medium text-muted-foreground"
              >
                <span className="w-1 h-1 rounded-full bg-primary/40" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
