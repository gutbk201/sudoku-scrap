import { type AppType } from "next/app";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Link from "next/link";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div>
        <div className="pointer-events-auto flex divide-x divide-slate-400/20 overflow-hidden rounded-md bg-white text-[0.8125rem] font-medium leading-5 text-slate-700 shadow-sm ring-1 ring-slate-700/10">
          <Link
            href="/sudoku"
            className="px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
          >
            sudoku
          </Link>
          <Link
            href="/killer"
            className="px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
          >
            killer
          </Link>
        </div>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
