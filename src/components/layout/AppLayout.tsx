import type { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="my-20.5 flex items-center justify-center p-4 lg:min-h-dvh lg:my-0">
      <article className="w-full max-w-5xl lg:h-[40rem] bg-White rounded-xl overflow-hidden grid gap-6 lg:grid-cols-[300px_1fr] p-4 lg:p-6 shadow-sm">
        {children}
      </article>
    </main>
  );
};

export default AppLayout;
