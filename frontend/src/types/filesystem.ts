export type NodeKind = "file" | "folder";

export interface VirtualFile {
  id: string;
  name: string;
  type: NodeKind;
  parentId?: string;
  path: string;
  size?: number;
  mimeType?: string;
  permissions?: string;
  owner?: string;
  group?: string;
  content?: string;
  hidden?: boolean;
  createdAt?: string;
  modifiedAt?: string;
  /** UI-only hint that the file looks worth inspecting. Never reveals the answer. */
  suspicious?: boolean;
}
