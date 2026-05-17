import CollectionChrome from "@/components/collection/CollectionChrome";

export default function CollectionLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CollectionChrome>{children}</CollectionChrome>;
}
