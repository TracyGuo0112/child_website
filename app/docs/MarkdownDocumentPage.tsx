import { readFileSync } from "node:fs";
import { join } from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { surface, ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";
import { cardSurface } from "@/components/site/atoms";
import { ProtectedDocs } from "./ProtectedDocs";

type MarkdownDocumentPageProps = {
  sourceFile: string;
};

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function MarkdownDocumentPage({ sourceFile }: MarkdownDocumentPageProps) {
  const markdown = readFileSync(join(process.cwd(), "content", "docs", sourceFile), "utf8");

  return (
    <main className="min-h-screen px-5 pb-16 pt-16 sm:px-8">
      <div className="mx-auto mb-4 max-w-5xl">
        <a
          href={`${base}/docs`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: ACCENT.deep }}
        >
          <span aria-hidden>←</span>
          返回技术文档
        </a>
      </div>

      <ProtectedDocs>
        <article className="overflow-hidden rounded-2xl p-5 sm:p-8 lg:p-10" style={cardSurface}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: ink[900] }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mb-3 mt-8 text-xl font-semibold tracking-tight" style={{ color: ink[900] }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2.5 mt-7 text-lg font-semibold" style={{ color: ink[900] }}>
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="mb-2 mt-6 text-base font-semibold" style={{ color: ink[900] }}>
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="my-3 text-sm leading-7" style={{ color: ink[700] }}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="my-3 list-disc space-y-1.5 pl-6 text-sm leading-7" style={{ color: ink[700] }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="my-3 list-decimal space-y-1.5 pl-6 text-sm leading-7" style={{ color: ink[700] }}>
                  {children}
                </ol>
              ),
              a: ({ href, children }) => {
                const isExternal = href?.startsWith("http");
                return (
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="font-medium underline decoration-1 underline-offset-2"
                    style={{ color: ACCENT.deep }}
                  >
                    {children}
                  </a>
                );
              },
              blockquote: ({ children }) => (
                <blockquote
                  className="my-4 rounded-r-xl border-l-4 px-4 py-2"
                  style={{ background: ACCENT.tint, borderColor: ACCENT.deep, color: ink[700] }}
                >
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="my-5 overflow-x-auto rounded-xl border" style={{ borderColor: ink.line }}>
                  <table className="min-w-full border-collapse text-left text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead style={{ background: ACCENT.tint, color: ink[900] }}>{children}</thead>
              ),
              th: ({ children }) => (
                <th className="whitespace-nowrap border-b px-3 py-2.5 font-semibold" style={{ borderColor: ink.line }}>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="min-w-32 border-b px-3 py-2.5 align-top leading-6" style={{ borderColor: ink.line, color: ink[700] }}>
                  {children}
                </td>
              ),
              pre: ({ children }) => (
                <pre
                  className="my-4 overflow-x-auto rounded-xl p-4 text-xs leading-6 [&_code]:bg-transparent [&_code]:p-0"
                  style={{ background: ink[900], color: surface.raised }}
                >
                  {children}
                </pre>
              ),
              code: ({ children, className }) => (
                <code
                  className={`${className ?? ""} rounded px-1.5 py-0.5 font-mono text-[0.85em]`}
                  style={{ background: ACCENT.tint, color: ink[900] }}
                >
                  {children}
                </code>
              ),
              strong: ({ children }) => <strong className="font-semibold" style={{ color: ink[900] }}>{children}</strong>,
              hr: () => <hr className="my-8" style={{ borderColor: ink.line }} />,
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </ProtectedDocs>
    </main>
  );
}
