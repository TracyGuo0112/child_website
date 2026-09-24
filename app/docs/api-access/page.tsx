import type { Metadata } from "next";
import { MarkdownDocumentPage } from "../MarkdownDocumentPage";

export const metadata: Metadata = {
  title: "API 接入说明 · 喜马拉雅儿童 SDK",
  description: "公共参数、设备标识生成、签名算法与错误码说明。",
};

export default function ApiAccessPage() {
  return <MarkdownDocumentPage sourceFile="api-access-guide.md" />;
}
