/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import { getFooterContent } from "../services/homeService";
import { buildCitiesByZone } from "../components/footer/utils";
import { reportClientError } from "../utils/reportClientError";

import InfoSection from "./footer/InfoSection";
import SocialLinks from "./footer/SocialLinks";
import NavLinks from "./footer/NavLinks";
import DownloadApp from "./footer/DownloadApp";
import CityBadges from "./footer/CityBadges";
import TrustBadges from "./footer/TrustBadges";

const enamad = "/enamad.webp";
const kasbokar = "/kasbokar.webp";
const samandehi = "/samandehi.webp";

const fallbackTrustBadges = [samandehi, enamad, kasbokar];

export default function Footer({ zones = [], mode = "overlay" }) {
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getFooterContent()
      .then((data) => {
        setInfo(data);
        setStatus("success");
      })
      .catch((err) => {
        reportClientError("Footer content", err);
        setStatus("error");
      });
  }, []);

  const footerLocations = info?.locations?.length ? info.locations : zones;
  const citiesByZone = useMemo(
    () => buildCitiesByZone(footerLocations, 24, 8),
    [footerLocations],
  );

  const isLoading = status === "loading";
  const shellClass =
    mode === "static"
      ? "relative z-10 mt-10 flex justify-center px-0 pb-0 pt-8"
      : "absolute inset-x-0 -bottom-3 z-50 flex justify-center px-0 pb-0 pt-8";

  if (status === "error") {
    return (
      <footer dir="rtl" className={shellClass}>
        <div className="w-full rounded-t-[2rem] border-t border-red-100 bg-white/90 px-5 py-4 text-center text-sm text-red-600 shadow-sm backdrop-blur dark:border-red-500/30 dark:bg-slate-900/90 dark:text-red-300">
          خطایی در بارگذاری اطلاعات پاورقی رخ داد.
        </div>
      </footer>
    );
  }

  return (
    <footer dir="rtl" className={shellClass}>
      <div
        className={clsx(
          "w-full overflow-hidden rounded-t-[2rem] border-t border-primary-100/80",
          "bg-white/86 text-primary-900 shadow-sm backdrop-blur-xl",
          "dark:border-slate-700 dark:bg-slate-950/88 dark:text-slate-100",
        )}
      >
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-[1fr_1.15fr]">
            <div className="grid auto-rows-fr gap-5">
              <InfoSection info={info} isLoading={isLoading} />
              <NavLinks columns={info?.nav_columns} isLoading={isLoading} />
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              <DownloadApp downloads={info?.downloads} isLoading={isLoading} />
              <CityBadges citiesByZone={citiesByZone} isLoading={isLoading} />
              <div className="flex flex-col gap-4 border-t border-primary-100/70 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <TrustBadges
                  icons={info?.trust_badges?.length ? info.trust_badges : fallbackTrustBadges}
                  isLoading={isLoading}
                />
                <SocialLinks socials={info?.socials} isLoading={isLoading} />
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-primary-100/70 pt-3 text-center text-xs text-primary-700 dark:border-slate-800 dark:text-slate-400">
            © ۱۴۰۵ جات اینجاست - نمونه رابط کاربری رزرو اقامتگاه
          </div>
        </div>
      </div>
    </footer>
  );
}
