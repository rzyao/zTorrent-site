import { Button } from "../components/ui/button";
import { useForumTheme } from "../context/ForumThemeContext";
import { Loader2, Trash2 } from "lucide-react";

export function ButtonTestPage() {
  const { colors } = useForumTheme();

  return (
    <div
      className={`space-y-8 p-8 ${colors.cardBg} min-h-screen text-slate-800 dark:text-slate-100`}
    >
      <h1 className="mb-4 text-2xl font-bold">Button Component Test Gallery</h1>

      <section className="space-y-4">
        <h2 className="border-b pb-2 text-xl font-semibold">1. Semantic Variants (New)</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary (Ripple)</Button>
          <Button variant="cancel">Cancel</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="border-b pb-2 text-xl font-semibold">2. Other Variants</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="border-b pb-2 text-xl font-semibold">4. Sizes</h2>
        <div className="flex flex-wrap items-end gap-4">
          <Button variant="primary" size="sm">
            Small (h-8)
          </Button>
          <Button variant="primary" size="default">
            Default (h-9)
          </Button>
          <Button variant="primary" size="lg">
            Large (h-10)
          </Button>
          <Button variant="primary" size="icon">
            <Trash2 className="size-4" />
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="border-b pb-2 text-xl font-semibold">6. States</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" loading>
            Loading
          </Button>
          <Button variant="cancel" loading>
            Cancel Loading
          </Button>
          <Button variant="danger" loading>
            Danger Loading
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="border-b pb-2 text-xl font-semibold">7. Animations</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="cancel" animation="ripple">
            Ripple (click me)
          </Button>
          <Button variant="cancel" animation="bounce">
            Bounce (click me)
          </Button>
          <Button variant="primary">Primary (auto ripple)</Button>
        </div>
      </section>
    </div>
  );
}

export default ButtonTestPage;
