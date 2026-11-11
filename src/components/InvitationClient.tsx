"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PersonInfo,
  WeddingConfig,
  WeddingEvent,
} from "../data/wedding-config";
import {
  cropStyles,
  findScrollParent,
  getVnDateParts,
} from "../lib/wedding-utils";
import { AutoScroll } from "./AutoScroll";
import { Countdown } from "./Countdown";
import { GuestbookSection } from "./GuestbookSection";
import { MusicPlayer } from "./MusicPlayer";
import { RevealOnScroll } from "./RevealOnScroll";
import { RsvpSection } from "./RsvpSection";
import { SeoulIvorySectionHeading } from "./SectionHeading";
import { SeoulIvoryAlbum } from "./SeoulIvoryAlbum";
import { SeoulIvoryGift } from "./SeoulIvoryGift";
import {
  SeoulIvoryGlints,
  SeoulIvoryPageGlints,
} from "./SeoulIvoryGlints";

/* =========================================================================
   COVER SECTION (si-editorial)
   ========================================================================= */
function CoverSection({
  config,
  guestName,
  onOpen,
}: {
  config: WeddingConfig;
  guestName?: string;
  onOpen: () => void;
}) {
  const [opening, setOpening] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const firstPerson = config.couple.brideFirst
    ? config.couple.bride
    : config.couple.groom;
  const secondPerson = config.couple.brideFirst
    ? config.couple.groom
    : config.couple.bride;

  const coverEvent = config.events[config.countdownEventId];
  const dateParts = getVnDateParts(coverEvent.startAt);
  const coverCrop = cropStyles(config.coverPhoto.crop, "center");

  function handleOpenClick() {
    if (opening) return;
    setOpening(true);
    contentRef.current?.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-30px)" },
      ],
      {
        duration: 700,
        easing: "cubic-bezier(0.5, 0, 0.2, 1)",
        fill: "forwards",
      }
    );
    onOpen();
  }

  return (
    <section className="si-cover relative min-h-screen w-full overflow-hidden">
      <span style={coverCrop.frame}>
        <Image
          src={config.coverPhoto.src}
          alt={config.coverPhoto.alt}
          fill
          priority
          sizes="640px"
          style={coverCrop.image}
        />
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(40,34,30,0.80) 0%, rgba(40,34,30,0.40) 30%, rgba(40,34,30,0.08) 58%, rgba(40,34,30,0) 100%), linear-gradient(rgba(74,64,57,0.10), rgba(74,64,57,0.10))",
        }}
      />

      <SeoulIvoryGlints variant="cover" />

      <div
        ref={contentRef}
        className="relative z-10 flex min-h-screen flex-col items-center justify-end px-7 pt-24 pb-14 text-center sm:px-9 sm:pb-16"
      >
        <p
          className="si-eyebrow si-rise mb-6 flex items-center justify-center gap-3 text-[0.62rem] sm:mb-7 sm:text-[0.7rem]"
          style={{
            color: "rgba(255,255,255,0.82)",
            letterSpacing: "0.34em",
            animationDelay: "0.15s",
          }}
        >
          <span
            aria-hidden="true"
            className="si-rule w-5 sm:w-7"
            style={{ background: "rgba(255,255,255,0.55)" }}
          />
          {config.labels.coverEyebrow}
          <span
            aria-hidden="true"
            className="si-rule w-5 sm:w-7"
            style={{ background: "rgba(255,255,255,0.55)" }}
          />
        </p>

        <p
          className="si-display si-rise accent-headroom text-[2.7rem] leading-[1.05] font-medium sm:text-[3.3rem]"
          style={{ color: "#FFFFFF", animationDelay: "0.30s" }}
        >
          {firstPerson.shortName}
        </p>

        <div
          aria-hidden="true"
          className="si-rise my-3 flex items-center justify-center gap-4 sm:my-4"
          style={{ animationDelay: "0.42s" }}
        >
          <span
            className="si-rule w-12 sm:w-16"
            style={{ background: "rgba(255,255,255,0.55)" }}
          />
          <span
            className="si-display text-xl italic sm:text-2xl"
            style={{ color: "#FFFFFF", opacity: 0.92 }}
          >
            &amp;
          </span>
          <span
            className="si-rule w-12 sm:w-16"
            style={{ background: "rgba(255,255,255,0.55)" }}
          />
        </div>

        <p
          className="si-display si-rise accent-headroom text-[2.7rem] leading-[1.05] font-medium sm:text-[3.3rem]"
          style={{ color: "#FFFFFF", animationDelay: "0.54s" }}
        >
          {secondPerson.shortName}
        </p>

        <div
          className="si-rise mt-7 sm:mt-9"
          style={{ animationDelay: "0.72s" }}
        >
          <p
            className="si-display text-[1.55rem] font-medium tabular-nums sm:text-[1.85rem]"
            style={{ color: "#FFFFFF", letterSpacing: "0.13em" }}
          >
            {dateParts.shortDateDots}
          </p>
          <p
            className="si-eyebrow mt-2.5 text-[0.62rem]"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            {dateParts.weekdayVi}
          </p>
          {coverEvent.lunarLabel && (
            <p
              className="font-display mt-1.5 text-[0.86rem] italic sm:text-[0.94rem]"
              style={{ color: "rgba(255,255,255,0.86)" }}
            >
              {coverEvent.lunarLabel}
            </p>
          )}
        </div>

        <div
          className="si-rise mt-9 sm:mt-11"
          style={{ animationDelay: "0.90s" }}
        >
          <p
            className="si-eyebrow text-[0.6rem]"
            style={{
              color: "rgba(255,255,255,0.82)",
              letterSpacing: "0.34em",
            }}
          >
            {config.labels.coverInviteUpper}
          </p>

          {guestName && (
            <div className="mx-auto mt-5 inline-block">
              <p
                className="si-hand accent-headroom px-4 pb-1 text-[2rem] leading-tight whitespace-nowrap sm:text-[2.4rem]"
                style={{ color: "#FFFFFF" }}
              >
                {guestName}
              </p>
              <span
                aria-hidden="true"
                className="block"
                style={{
                  borderBottom: "1.5px dotted rgba(255,255,255,0.55)",
                  minWidth: 220,
                }}
              />
            </div>
          )}

          <p
            className="font-display mx-auto mt-3.5 max-w-72 text-[0.9rem] leading-snug italic sm:text-[0.98rem]"
            style={{ color: "rgba(255,255,255,0.86)" }}
          >
            {config.labels.coverInviteLower}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenClick}
          className="si-open-btn si-shine-btn inline-flex cursor-pointer items-center justify-center font-semibold whitespace-nowrap uppercase"
          style={{
            marginTop: "2.3rem",
            padding: "0.85rem 2.9rem",
            borderRadius: 9999,
            fontSize: "0.84rem",
            letterSpacing: "0.18em",
            border: "1.5px solid rgba(255,255,255,0.9)",
            color: "#FFFFFF",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(2px)",
          }}
        >
          <span className="relative z-1">{config.labels.openButton}</span>
        </button>
      </div>
    </section>
  );
}

/* =========================================================================
   COUPLE PORTRAIT CARD (Section 01)
   ========================================================================= */
function CouplePortraitRow({
  person,
  roleLabel,
  reverse,
}: {
  person: PersonInfo;
  roleLabel: string;
  reverse?: boolean;
}) {
  const styles = cropStyles(person.photo.crop, "center");

  return (
    <div
      className={`flex items-center gap-6 sm:gap-9 ${reverse ? "flex-row-reverse" : ""
        }`}
    >
      <div
        data-reveal={reverse ? "right" : "left"}
        className="relative shrink-0"
        style={{ width: "43%", maxWidth: 208 }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            inset: "-20%",
            zIndex: -1,
            background:
              "radial-gradient(closest-side, rgba(194, 162, 106, 0.18), rgba(194, 162, 106, 0) 72%)",
          }}
        />

        {/* Gold Arch SVG Ornament */}
        <svg
          aria-hidden="true"
          className="si-ornament pointer-events-none absolute"
          style={
            {
              inset: -11,
              width: "calc(100% + 22px)",
              height: "calc(100% + 22px)",
              "--si-ornament-delay": "350ms",
            } as React.CSSProperties
          }
          viewBox="0 0 120 166"
          preserveAspectRatio="none"
          fill="none"
          stroke="var(--si-gold)"
          strokeWidth="1"
          strokeLinecap="round"
        >
          <path
            pathLength="1"
            vectorEffect="non-scaling-stroke"
            d="M 0 156 L 0 66 A 60 60 0 0 1 120 66 L 120 156"
          />
          <path
            pathLength="1"
            vectorEffect="non-scaling-stroke"
            d="M 60 0 L 64 6 L 60 12 L 56 6 Z"
          />
        </svg>

        <div
          className="si-photo-frame mx-auto"
          style={{
            maxWidth: "100%",
            borderRadius: "999px 999px 1.1rem 1.1rem",
          }}
        >
          <div
            className="si-photo-inner relative"
            style={{
              aspectRatio: "3 / 4",
              borderRadius:
                "994px 994px calc(1.1rem - 5px) calc(1.1rem - 5px)",
            }}
          >
            <span style={styles.frame}>
              <Image
                src={person.photo.src}
                alt={person.photo.alt}
                fill
                sizes="208px"
                style={styles.image}
              />
            </span>
          </div>
        </div>

        {/* Olive Branch SVG Ornament */}
        <svg
          aria-hidden="true"
          className="si-ornament pointer-events-none absolute"
          viewBox="0 0 64 40"
          width="64"
          height="40"
          fill="none"
          stroke="var(--si-gold)"
          strokeWidth="1"
          strokeLinecap="round"
          style={
            {
              bottom: -8,
              left: -16,
              "--si-ornament-delay": "600ms",
            } as React.CSSProperties
          }
        >
          <path pathLength="1" d="M 2 34 Q 22 32, 44 18 Q 52 13, 60 4" />
          <path
            pathLength="1"
            d="M 18 31 Q 21 23.5, 29 22 Q 25 29, 18 31 Z"
          />
          <path
            pathLength="1"
            d="M 33 24.5 Q 31 17, 36 11.5 Q 38.5 18.5, 33 24.5 Z"
          />
          <path
            pathLength="1"
            d="M 46 16 Q 50 9.5, 57 8 Q 52.5 14, 46 16 Z"
          />
          <circle pathLength="1" cx="8" cy="33.5" r="1.5" />
          <circle pathLength="1" cx="40" cy="20" r="1.5" />
        </svg>
      </div>

      <div
        data-reveal={reverse ? "left" : "right"}
        style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
        className="relative min-w-0 flex-1 text-left"
      >
        <p className="si-kr mb-1.5 text-[0.66rem] tracking-[0.26em] text-(--si-accent)">
          {roleLabel}
        </p>
        <p
          className="si-display si-gold-text leading-tight font-medium"
          style={{
            fontSize: "clamp(1.7rem, 7vw, 2.4rem)",
            letterSpacing: "0.02em",
          }}
        >
          {person.shortName}
        </p>
        <span aria-hidden="true" className="mt-3 flex justify-start">
          <span className="si-rule si-rule--foil si-draw w-12 sm:w-16" />
        </span>
        {person.bio && (
          <p className="font-display mt-3 text-[0.9rem] leading-relaxed text-(--si-ink-soft) italic">
            {person.bio}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   RECEPTION PARTY SECTION (Sections 04 & 05)
   ========================================================================= */
function ReceptionSection({ event }: { event: WeddingEvent }) {
  const parts = getVnDateParts(event.startAt);
  const embedMapSrc = `https://maps.google.com/maps?hl=vi&q=${event.mapLat},${event.mapLng}&z=17&output=embed`;

  return (
    <section className="si-band relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24">
      <SeoulIvorySectionHeading
        index={event.sectionNumber}
        english={event.englishSubtitle}
        title={event.title}
      />

      <div className="relative mx-auto max-w-xl text-center">
        <div data-reveal="true">
          <p className="font-display mb-7 text-[1.05rem] leading-snug text-(--si-ink) italic sm:text-[1.25rem]">
            {event.title} sẽ diễn ra vào lúc
          </p>
          <p className="si-display si-gold-text text-[2.4rem] leading-none font-medium tabular-nums sm:text-[2.8rem]">
            {parts.time}
          </p>
        </div>

        <div
          data-reveal="scale"
          style={{ "--reveal-delay": "150ms" } as React.CSSProperties}
        >
          <p
            className="si-display si-gold-text mt-4 font-medium tabular-nums"
            style={{
              fontSize: "clamp(2.3rem, 11vw, 3.5rem)",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            {parts.shortDateSpacedDots}
          </p>
          <p className="si-eyebrow mt-2 text-[0.6rem] text-(--si-accent)">
            {parts.weekdayVi}
          </p>
          {event.lunarLabel && (
            <p className="font-display mt-2 text-[0.88rem] text-(--si-ink-soft) italic sm:text-[0.95rem]">
              ({event.lunarLabel})
            </p>
          )}
        </div>

        <span
          aria-hidden="true"
          data-reveal="fade"
          className="si-rule si-rule--foil si-draw si-draw--center mx-auto my-10 block w-32 sm:my-12 sm:w-40"
        />

        <div data-reveal="true">
          <p className="si-display text-[1.3rem] font-medium text-(--si-ink) italic sm:text-[1.6rem]">
            Địa điểm tổ chức
          </p>
          <p className="si-display mt-4 text-[1.15rem] font-semibold tracking-[0.08em] whitespace-pre-line text-(--si-ink) uppercase sm:text-[1.3rem]">
            {event.venueName}
          </p>
          <p className="font-display mx-auto mt-2.5 max-w-sm text-[0.9rem] leading-relaxed whitespace-pre-line text-(--si-ink-soft) italic sm:text-[0.98rem]">
            {event.address}
          </p>
          {event.mapUrl && (
            <p className="mt-3">
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="si-eyebrow inline-flex items-center gap-1.5 text-[0.58rem] text-(--si-accent) underline underline-offset-4 transition hover:opacity-70"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="inline-block shrink-0"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Chỉ đường
              </a>
            </p>
          )}
        </div>

        <div
          data-reveal="fade"
          style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
        >
          <div className="relative mt-5 w-full overflow-hidden rounded-lg border border-(--t-primary)/40 shadow-xl">
            <iframe
              src={embedMapSrc}
              title={`Bản đồ tới ${event.venueName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block aspect-16/10 w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   MAIN INVITATION CLIENT
   ========================================================================= */
export function InvitationClient({
  config,
  guestName,
}: {
  config: WeddingConfig;
  guestName?: string;
}) {
  const [opened, setOpened] = useState(false);
  const [renderCover, setRenderCover] = useState(true);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const stageAnchorRef = useRef<HTMLSpanElement | null>(null);

  const handleOpen = useCallback(() => {
    setOpened(true);
    window.dispatchEvent(new CustomEvent("thiep-opened"));
    timersRef.current.push(
      setTimeout(() => {
        (findScrollParent(stageAnchorRef.current) ?? window).scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 50)
    );
    timersRef.current.push(setTimeout(() => setRenderCover(false), 750));
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const ceremony = config.events.ceremony;
  const ceremonyParts = getVnDateParts(ceremony.startAt);
  const ceremonyEmbedUrl = `https://maps.google.com/maps?hl=vi&q=${ceremony.mapLat},${ceremony.mapLng}&z=17&output=embed`;

  const maxFamLen = Math.max(
    config.families.groom.fatherName.length,
    config.families.groom.motherName.length,
    config.families.bride.fatherName.length,
    config.families.bride.motherName.length,
    16
  );

  const maxCoupleFullNameLen = Math.max(
    config.couple.groom.fullName.length,
    config.couple.bride.fullName.length,
    18
  );

  const countdownTarget =
    config.events[config.countdownEventId]?.startAt ?? ceremony.startAt;

  return (
    <div className="min-h-screen w-full bg-invitation-desk">
      <div
        data-thiep-root="true"
        style={
          {
            "--t-bg": "#FBF8F2",
            "--t-bg-warm": "#F1EADD",
            "--t-ink": "#4A4039",
            "--t-primary": "#B49A7E",
            "--t-secondary": "#C9B79C",
            "--t-accent": "#9C8463",
            "--t-footer-bg": "#F1EADD",
            "--t-footer-text": "#4A4039",
            "--t-footer-accent": "#B49A7E",
            "--t-font-display": "var(--font-cormorant)",
            "--t-font-body": "var(--font-be-vietnam)",
          } as React.CSSProperties
        }
        className="font-body text-(--t-ink) tpl-seoul-ivory"
      >
        <div className="relative mx-auto max-w-160 bg-[var(--t-bg)] shadow-[0_20px_60px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.05)]">
          <h1 className="sr-only">
            {config.couple.groom.shortName} &amp;{" "}
            {config.couple.bride.shortName}
          </h1>
          <span ref={stageAnchorRef} aria-hidden="true" className="hidden" />

          {/* COVER */}
          {renderCover && (
            <div
              className={`transition-all duration-700 ${opened
                ? "pointer-events-none absolute inset-x-0 top-0 z-10 -translate-y-12 opacity-0"
                : "relative opacity-100"
                }`}
            >
              <CoverSection
                config={config}
                guestName={guestName}
                onOpen={handleOpen}
              />
            </div>
          )}

          {/* MAIN INVITATION BODY */}
          {opened && (
            <div className="relative animate-[invitation-enter_1s_ease-out_both]">
              <SeoulIvoryPageGlints />

              {/* SECTION 01: THE BRIDE & GROOM */}
              <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24">
                <SeoulIvorySectionHeading
                  index={config.labels.coupleSection.index}
                  english={config.labels.coupleSection.en}
                  title={config.labels.coupleSection.vi}
                />

                <div className="relative mx-auto mt-2 flex max-w-140 flex-col gap-12 sm:gap-16">
                  <CouplePortraitRow
                    person={config.couple.groom}
                    roleLabel="THE GROOM · CHÚ RỂ"
                  />
                  <CouplePortraitRow
                    person={config.couple.bride}
                    roleLabel="THE BRIDE · CÔ DÂU"
                    reverse
                  />
                </div>
              </section>

              {/* SECTION 02: OUR BELOVED FAMILIES */}
              <section className="relative overflow-hidden px-5 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-10">
                <SeoulIvorySectionHeading
                  index={config.labels.familySection.index}
                  english={config.labels.familySection.en}
                  title={config.labels.familySection.vi}
                />

                <div
                  data-reveal="true"
                  className="fam-grid relative mx-auto mt-3 max-w-145 grid-cols-2 gap-x-2"
                  style={
                    { "--fam-name-len": maxFamLen } as React.CSSProperties
                  }
                >
                  <span
                    aria-hidden="true"
                    className="si-rule-v si-draw--v absolute inset-y-0 left-1/2"
                  />

                  {/* Nhà Trai */}
                  <div
                    data-reveal="true"
                    style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
                    className="fam-col px-0 text-center sm:px-6"
                  >
                    <p className="si-eyebrow text-[0.64rem] tracking-[0.26em] text-(--si-accent)">
                      {config.labels.familySection.groomSide}
                    </p>
                    <p className="si-kr mt-0.5 text-[0.58rem] tracking-[0.22em] text-(--si-ink-faint)">
                      GROOM&apos;S FAMILY
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-2.5 flex justify-center"
                    >
                      <span className="si-rule si-rule--foil si-draw si-draw--center w-8" />
                    </span>
                    <div className="mt-5">
                      <p
                        className="fam-name si-display si-gold-text si-fam-name leading-snug font-medium"
                        style={{ letterSpacing: "0.015em" }}
                      >
                        {config.families.groom.fatherName.replaceAll(
                          " ",
                          "\u00A0"
                        )}
                      </p>
                      <p
                        className="fam-name si-display si-gold-text si-fam-name mt-1 leading-snug font-medium"
                        style={{ letterSpacing: "0.015em" }}
                      >
                        {config.families.groom.motherName.replaceAll(
                          " ",
                          "\u00A0"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Nhà Gái */}
                  <div
                    data-reveal="true"
                    style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
                    className="fam-col px-0 text-center sm:px-6"
                  >
                    <p className="si-eyebrow text-[0.64rem] tracking-[0.26em] text-(--si-accent)">
                      {config.labels.familySection.brideSide}
                    </p>
                    <p className="si-kr mt-0.5 text-[0.58rem] tracking-[0.22em] text-(--si-ink-faint)">
                      BRIDE&apos;S FAMILY
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-2.5 flex justify-center"
                    >
                      <span className="si-rule si-rule--foil si-draw si-draw--center w-8" />
                    </span>
                    <div className="mt-5">
                      <p
                        className="fam-name si-display si-gold-text si-fam-name leading-snug font-medium"
                        style={{ letterSpacing: "0.015em" }}
                      >
                        {config.families.bride.fatherName.replaceAll(
                          " ",
                          "\u00A0"
                        )}
                      </p>
                      <p
                        className="fam-name si-display si-gold-text si-fam-name mt-1 leading-snug font-medium"
                        style={{ letterSpacing: "0.015em" }}
                      >
                        {config.families.bride.motherName.replaceAll(
                          " ",
                          "\u00A0"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* INVITATION INTRO & HANDWRITTEN COUPLE NAMES */}
              <section className="relative overflow-hidden px-5 pt-8 pb-8 sm:px-6 sm:pt-10 sm:pb-10">
                <div
                  data-reveal="fade"
                  className="relative mx-auto max-w-md text-center"
                >
                  <div
                    className="si-ornament mb-3 flex justify-center"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 140 30"
                      width="140"
                      height="30"
                      fill="none"
                      stroke="var(--si-gold)"
                      strokeWidth="1"
                      strokeLinecap="round"
                    >
                      <path
                        pathLength="1"
                        d="M10 22 Q 45 8, 70 14 Q 95 20, 130 10"
                      />
                      <path
                        pathLength="1"
                        d="M32 15.5 Q 36 8, 44 7 Q 39 14, 32 15.5 Z"
                      />
                      <path
                        pathLength="1"
                        d="M56 13.5 Q 54 21, 46 23 Q 50 15.5, 56 13.5 Z"
                      />
                      <path
                        pathLength="1"
                        d="M82 15.5 Q 86 8.5, 94 8 Q 89 14.5, 82 15.5 Z"
                      />
                      <path
                        pathLength="1"
                        d="M104 13 Q 102 20, 94 21.5 Q 98 14.5, 104 13 Z"
                      />
                    </svg>
                  </div>
                  <p
                    className="si-eyebrow text-[0.62rem] text-(--si-ink) sm:text-[0.7rem]"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {config.labels.invitationIntro.line1}
                  </p>
                  <p
                    className="si-eyebrow text-[0.62rem] text-(--si-ink) sm:text-[0.7rem]"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {config.labels.invitationIntro.line2}
                  </p>
                </div>

                <div
                  className="relative mx-auto mt-8 max-w-md text-center sm:mt-10"
                  style={
                    {
                      "--couple-name-len": maxCoupleFullNameLen,
                    } as React.CSSProperties
                  }
                >
                  <div
                    data-reveal="true"
                    className="couple-name-col px-4 sm:px-6"
                    style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
                  >
                    <p className="couple-name si-hand si-couple-name si-gold-text couple-name--foil leading-tight">
                      {config.couple.groom.fullName}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    data-reveal="scale"
                    style={{ "--reveal-delay": "380ms" } as React.CSSProperties}
                    className="my-4 flex items-center justify-center gap-3 sm:my-6"
                  >
                    <svg
                      className="si-ornament"
                      viewBox="0 0 36 16"
                      width="36"
                      height="16"
                      fill="none"
                      stroke="var(--si-gold)"
                      strokeWidth="1"
                      strokeLinecap="round"
                      style={{ transform: "scale(-1, 1)" }}
                      aria-hidden="true"
                    >
                      <path pathLength="1" d="M2 11 Q 14 4, 34 8" />
                      <path
                        pathLength="1"
                        d="M16 8 Q 19 3, 25 2.5 Q 21 7.5, 16 8 Z"
                      />
                    </svg>
                    <span
                      className="si-hand text-(--si-taupe)"
                      style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
                    >
                      &amp;
                    </span>
                    <svg
                      className="si-ornament"
                      viewBox="0 0 36 16"
                      width="36"
                      height="16"
                      fill="none"
                      stroke="var(--si-gold)"
                      strokeWidth="1"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path pathLength="1" d="M2 11 Q 14 4, 34 8" />
                      <path
                        pathLength="1"
                        d="M16 8 Q 19 3, 25 2.5 Q 21 7.5, 16 8 Z"
                      />
                    </svg>
                  </div>

                  <div
                    data-reveal="true"
                    className="couple-name-col px-4 sm:px-6"
                    style={{ "--reveal-delay": "520ms" } as React.CSSProperties}
                  >
                    <p className="couple-name si-hand si-couple-name si-gold-text couple-name--foil leading-tight">
                      {config.couple.bride.fullName}
                    </p>
                  </div>
                </div>
              </section>

              {/* CEREMONY DETAILS & MAP */}
              <section className="relative overflow-hidden px-5 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-24">
                <div className="relative mx-auto max-w-xl text-center">
                  <div data-reveal="fade">
                    <div
                      className="si-ornament mb-3 flex justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 120 26"
                        width="120"
                        height="26"
                        fill="none"
                        stroke="var(--si-gold)"
                        strokeWidth="1"
                        strokeLinecap="round"
                      >
                        <path pathLength="1" d="M18 24 Q 60 -8, 102 24" />
                        <path pathLength="1" d="M32 24 Q 60 3, 88 24" />
                        <path
                          pathLength="1"
                          d="M60 3.5 L 63 7 L 60 10.5 L 57 7 Z"
                        />
                      </svg>
                    </div>
                    <p className="si-kr mb-1.5 text-[0.66rem] tracking-[0.26em] text-(--si-accent)">
                      {ceremony.englishSubtitle}
                    </p>
                    <p
                      className="si-eyebrow text-[0.62rem] text-(--si-accent) sm:text-[0.68rem]"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      {ceremony.title}{" "}
                      {config.labels.invitationIntro.ceremonyPrefix}
                    </p>
                  </div>

                  <div
                    data-reveal="true"
                    style={{ "--reveal-delay": "150ms" } as React.CSSProperties}
                  >
                    <p
                      className="si-display mt-3 text-[1.2rem] leading-snug font-semibold whitespace-pre-line text-(--si-ink) uppercase sm:text-[1.5rem]"
                      style={{ letterSpacing: "0.06em" }}
                    >
                      {ceremony.venueName}
                    </p>
                    <p className="font-display mx-auto mt-2.5 max-w-sm text-[0.9rem] leading-relaxed whitespace-pre-line text-(--si-ink-soft) italic sm:text-[0.98rem]">
                      {ceremony.address}
                    </p>
                    <p
                      className="si-eyebrow mt-3.5 text-[0.62rem] text-(--si-ink-soft)"
                      style={{ letterSpacing: "0.18em" }}
                    >
                      {config.labels.invitationIntro.atTimePrefix}
                      <span className="font-semibold text-(--si-ink)">
                        {ceremonyParts.time}
                      </span>
                    </p>
                  </div>

                  <div
                    data-reveal="scale"
                    style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
                    className="mt-6 sm:mt-7"
                  >
                    <div className="flex items-center justify-center gap-4 sm:gap-5">
                      <span
                        className="si-eyebrow text-[0.6rem] text-(--si-ink-soft)"
                        style={{ letterSpacing: "0.18em" }}
                      >
                        {ceremonyParts.weekdayVi}
                      </span>
                      <span
                        aria-hidden="true"
                        className="si-draw--v w-px self-stretch bg-(--si-line)"
                      />
                      <span
                        className="si-display si-gold-text font-medium tabular-nums"
                        style={{
                          fontSize: "clamp(2.2rem, 10vw, 3rem)",
                          lineHeight: 1,
                        }}
                      >
                        {ceremonyParts.day}
                      </span>
                      <span
                        aria-hidden="true"
                        className="si-draw--v w-px self-stretch bg-(--si-line)"
                      />
                      <span
                        className="si-eyebrow text-[0.6rem] text-(--si-ink-soft)"
                        style={{ letterSpacing: "0.18em" }}
                      >
                        Tháng {ceremonyParts.month}
                      </span>
                    </div>

                    <p
                      className="si-display si-gold-text mt-2.5 font-medium tabular-nums"
                      style={{
                        fontSize: "clamp(1.8rem, 8vw, 2.4rem)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {ceremonyParts.year}
                    </p>

                    {ceremony.lunarLabel && (
                      <p
                        className="si-eyebrow mt-3 text-[0.56rem] text-(--si-ink-faint)"
                        style={{ letterSpacing: "0.14em" }}
                      >
                        ({ceremony.lunarLabel})
                      </p>
                    )}
                  </div>

                  <div
                    data-reveal="fade"
                    style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
                  >
                    <div className="relative mt-8 w-full overflow-hidden rounded-lg border border-(--t-primary)/40 shadow-xl">
                      <iframe
                        src={ceremonyEmbedUrl}
                        title={`Bản đồ tới ${ceremony.venueName}`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                        className="block aspect-16/10 w-full border-0"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 03: WEDDING ALBUM (Arch Mosaic + Lightbox) */}
              <SeoulIvoryAlbum
                photos={config.album}
                index={config.labels.albumSection.index}
                english={config.labels.albumSection.en}
                title={config.labels.albumSection.vi}
              />

              {/* SECTION 04: BRIDE'S RECEPTION (TIỆC NHÀ GÁI) */}
              <ReceptionSection event={config.events.brideParty} />

              {/* SECTION 05: GROOM'S RECEPTION (TIỆC NHÀ TRAI) */}
              <ReceptionSection event={config.events.groomParty} />

              {/* SECTION 06: WEDDING GUESTBOOK (SỔ LƯU BÚT) */}
              <GuestbookSection
                initialEntries={config.initialGuestbookEntries}
                defaultGuestName={guestName}
                index={config.labels.guestbookSection.index}
                english={config.labels.guestbookSection.en}
                title={config.labels.guestbookSection.vi}
                subtitle={config.labels.guestbookSection.subtitle}
                formTitle={config.labels.guestbookSection.formTitle}
              />

              {/* SECTION 07: WEDDING GIFT (MỪNG CƯỚI QR MODAL) */}
              <SeoulIvoryGift
                gifts={config.gifts}
                index={config.labels.giftSection.index}
                english={config.labels.giftSection.en}
                title={config.labels.giftSection.vi}
                buttonLabel={config.labels.giftSection.buttonLabel}
                note={config.labels.giftSection.note}
                modalSubtitle={config.labels.giftSection.modalSubtitle}
              />

              {/* SECTION 08: SAVE THE DATE COUNTDOWN */}
              <Countdown
                targetIso={countdownTarget}
                index={config.labels.countdownSection.index}
                english={config.labels.countdownSection.en}
                title={config.labels.countdownSection.vi}
                todayMessage={config.labels.countdownSection.todayMessage}
              />

              {/* SECTION 09: R.S.V.P FORM */}
              <RsvpSection
                defaultGuestName={guestName}
                english={config.labels.rsvpSection.en}
                title={config.labels.rsvpSection.vi}
              />

              {/* SECTION 10: THANK YOU */}
              <section className="si-band relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28">
                <div className="relative mx-auto max-w-xl text-center">
                  <SeoulIvorySectionHeading
                    english={config.labels.thankYouSection.en}
                    title={config.labels.thankYouSection.vi}
                    align="center"
                  />

                  {config.labels.thankYouSection.message && (
                    <p
                      data-reveal="fade"
                      style={
                        { "--reveal-delay": "150ms" } as React.CSSProperties
                      }
                      className="font-display mx-auto mt-2 max-w-md text-[0.96rem] leading-loose whitespace-pre-line text-(--si-ink-soft) italic sm:text-[1.08rem]"
                    >
                      {config.labels.thankYouSection.message}
                    </p>
                  )}

                  <div
                    data-reveal="true"
                    style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
                    className="mt-12 flex items-center justify-center gap-4 sm:mt-14 sm:gap-6"
                  >
                    <span
                      aria-hidden="true"
                      className="si-rule si-rule--foil si-draw si-draw--center w-10 sm:w-14"
                    />
                    <span className="si-display si-gold-text text-[1.6rem] leading-tight font-medium whitespace-nowrap italic sm:text-[2rem]">
                      {config.couple.groom.shortName} &amp;{" "}
                      {config.couple.bride.shortName}
                    </span>
                    <span
                      aria-hidden="true"
                      className="si-rule si-rule--foil si-draw si-draw--center w-10 sm:w-14"
                    />
                  </div>
                </div>
              </section>

              {/* FOOTER CREDIT */}
              {config.labels.footerCredit && (
                <p className="px-5 pt-2 pb-7 text-center text-[0.68rem] tracking-[0.14em] text-[var(--t-ink)]/45 uppercase">
                  {config.labels.footerCredit}
                </p>
              )}
            </div>
          )}
        </div>

        {/* FLOATING CONTROLS & EFFECTS */}
        <MusicPlayer
          src={config.music.src}
          autoplay={config.music.autoplay}
        />
        <AutoScroll />
        <RevealOnScroll />
      </div>
    </div>
  );
}
