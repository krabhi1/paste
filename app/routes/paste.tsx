import type { Route } from ".react-router/types/app/routes/+types/paste";
import {
  Copy,
  Calendar,
  Code,
  User,
  Clock,
  Download,
  FileText,
  Flag,
  Edit,
  GitBranch,
  Trash2,
  Check,
} from "lucide-react";
import { getPasteById } from "~/db/queries";
import { useState } from "react";
import { useFetcher, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  const paste = await getPasteById(id!);
  if (!paste) {
    throw new Response("Not Found", { status: 404 });
  }
  return { paste };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "report") {
    // In a real app, you'd save the report to a database
    console.log("Report received for paste");
    return { success: true, message: "Paste reported successfully." };
  }

  return { success: false };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { paste } = loaderData;
  const [copied, setCopied] = useState(false);
  const fetcher = useFetcher();

  const isReported = fetcher.data?.success;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([paste.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const extension =
      paste.syntax === "plaintext" ? "txt" : paste.syntax || "txt";
    a.href = url;
    a.download = `${paste.title || "paste"}-${paste.id}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full flex-grow p-3 sm:p-6 bg-background">
      <div className=" mx-auto w-full lg:h-full lg:flex lg:flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold break-all">
                {paste.title || "Untitled Paste"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                ID: {paste.id}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                variant={copied ? "default" : "secondary"}
                size="sm"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold">Created:</span>{" "}
                {formatDate(paste.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {paste.text.length} characters
              </span>
            </div>

            {paste.expiresAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold">Expires:</span>{" "}
                  {formatDate(paste.expiresAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator className="mb-6" />
        {/* Code Content */}
        <Card className="lg:flex-grow lg:flex lg:flex-col lg:min-h-0">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-0 pb-3 border-b gap-4">
            <Badge variant="secondary">{paste.syntax || "plaintext"}</Badge>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`/raw/${paste.id}`} target="_blank" rel="noreferrer">
                  <FileText className="w-4 h-4 mr-2" />
                  View Raw
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="report" />
                <Button
                  variant={isReported ? "secondary" : "destructive"}
                  size="sm"
                  disabled={isReported || fetcher.state !== "idle"}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  {isReported ? "Reported" : "Report"}
                </Button>
              </fetcher.Form>
            </div>
          </CardHeader>
          <CardContent className="lg:flex-grow p-0 lg:overflow-auto">
            <pre className="p-4 font-mono text-sm leading-relaxed whitespace-pre text-foreground bg-transparent border-none m-0 overflow-x-auto lg:overflow-auto">
              {paste.text}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
