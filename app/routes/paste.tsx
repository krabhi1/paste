import {
  Copy,
  Calendar,
  Code,
  User,
  Download,
  FileText,
  Flag,
  Edit,
  GitBranch,
  Trash2,
} from "lucide-react";
import type { Route } from "./+types/paste";
import { getPasteById } from "~/db/queries";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { id } = params;
  const paste = await getPasteById(id!);
  if (!paste) {
    throw new Response("Not Found", { status: 404 });
  }
  return { paste };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { paste } = loaderData;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
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
    <div className="w-full flex-grow p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Created {formatDate(paste.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-muted-foreground" />
              <Badge variant="secondary">{"plaintext"}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {paste.text.length} characters
              </span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />
        {/* Code Content */}
        <Card className="flex-grow flex flex-col min-h-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
            <Badge variant="secondary">{paste.syntax || "plaintext"}</Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                View Raw
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="destructive" size="sm">
                <Flag className="w-4 h-4 mr-2" />
                Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-auto bg-muted/30">
            <pre className="p-4 font-mono text-sm leading-relaxed whitespace-pre text-foreground bg-transparent border-none m-0 overflow-auto">
              {paste.text}
            </pre>
          </CardContent>
        </Card>
        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6 gap-3">
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Paste
            </Button>
            <Button variant="secondary" size="sm">
              <GitBranch className="w-4 h-4 mr-2" />
              Fork
            </Button>
          </div>
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Paste
          </Button>
        </div>
      </div>
    </div>
  );
}
