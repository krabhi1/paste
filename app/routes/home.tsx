import type { Route } from ".react-router/types/app/routes/+types/home";
import { Outlet, redirect, useFetcher } from "react-router";
import { Form } from "react-router";
import { createPaste } from "~/db/queries";
import { sleep } from "~/lib/utils";
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

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const text = formData.get("text") as string;
  const syntax = formData.get("syntax") as string;
  const expiry = formData.get("expiry") as string;

  // TODO: add validation
  const paste = await createPaste({ title, text });
  console.log("Created paste:", paste);
  return redirect(`/${paste.id}`);
}

export default function Page({}: Route.ComponentProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-3">
      <div className="w-full max-w-2xl mt-4">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 b bg-clip-text ">
            Create New Paste
          </h1>
          <p className="text-muted-foreground">
            Share your code and text with others
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Paste</CardTitle>
            <CardDescription>
              Enter the details for your paste below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <fetcher.Form method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Paste Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a descriptive title..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  className="font-mono text-sm resize-vertical min-h-[200px]"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full ">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Paste
              </Button>
            </fetcher.Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
