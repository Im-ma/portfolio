export function AskRoot({ source, children }: { source: string; children: React.ReactNode }) {
  return (
    <div data-ask-root="" data-ask-source={source}>
      {children}
    </div>
  );
}
