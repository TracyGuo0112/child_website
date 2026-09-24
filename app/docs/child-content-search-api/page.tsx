import type { Metadata } from "next";
import { MarkdownDocumentPage } from "../MarkdownDocumentPage";

export const metadata: Metadata = {
  title: "儿童内容搜索 API · 喜马拉雅儿童 SDK",
  description: "儿童内容关键词搜索接口的请求参数、响应字段、示例与降级规则。",
};

export default function ChildContentSearchApiPage() {
  return <MarkdownDocumentPage sourceFile="child-content-search-api.md" />;
}
