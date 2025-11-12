import type { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <article className="flex flex-col items-center justify-center lg:flex-row bg-white mx-[1rem] p-[1.5rem] rounded-xl">
        {children}
      </article>
    </main>
  );
};

export default AppLayout;
