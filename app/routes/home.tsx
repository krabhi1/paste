import type { Route } from ".react-router/types/app/routes/+types/home";
import { redirect, useFetcher, data } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Create New Paste | Paste — Minimal Text Sharing" }];
};
import { createPaste, getLatestPastes } from "~/db/queries";
import { PasteSchema } from "~/lib/validations";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2 } from "lucide-react";

export async function action({ request, context }: Route.ActionArgs) {
  const { paste: pasteKV } = context.cloudflare.env;
  const formData = await request.formData();
  const submission = PasteSchema.safeParse(Object.fromEntries(formData));

  if (!submission.success) {
    return data(
      { errors: submission.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const paste = await createPaste(submission.data);
  const latestFromDb = await getLatestPastes(10);

  context.cloudflare.ctx.waitUntil(
    pasteKV.put("latest_pastes", JSON.stringify(latestFromDb)),
  );
  return redirect(`/${paste.id}`);
}

export default function Page({}: Route.ComponentProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="max-w-2xl mx-auto w-full py-4">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>New Paste</CardTitle>
          <CardDescription>
            Enter the details for your paste below
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <fetcher.Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Paste Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a descriptive title..."
                required
                aria-invalid={!!fetcher.data?.errors?.title}
              />
              {fetcher.data?.errors?.title && (
                <p className="text-[11px] font-medium text-destructive mt-1">
                  {fetcher.data.errors.title[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Select name="expiry" defaultValue="never">
                  <SelectTrigger id="expiry">
                    <SelectValue placeholder="Select Expiry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1hr">1 Hour</SelectItem>
                    <SelectItem value="24hr">24 Hours</SelectItem>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="syntax">Syntax Highlighting</Label>
                <Select name="syntax" defaultValue="plaintext">
                  <SelectTrigger id="syntax">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plaintext">Plain Text</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="yaml">YAML</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Content</Label>
              <Textarea
                id="text"
                name="text"
                placeholder="Paste your code or text here..."
                rows={12}
                required
                aria-invalid={!!fetcher.data?.errors?.text}
                className="font-mono text-sm resize-vertical min-h-[200px] max-h-[500px] overflow-y-auto"
              />
              {fetcher.data?.errors?.text && (
                <p className="text-[11px] font-medium text-destructive mt-1">
                  {fetcher.data.errors.text[0]}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Paste
            </Button>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
