import { InvitationClient } from "../components/InvitationClient";
import { WEDDING_CONFIG } from "../data/wedding-config";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ guest?: string; k?: string }>;
}) {
  const params = await searchParams;
  const rawGuest = (params.guest ?? params.k ?? "").trim();
  const guestName = rawGuest ? rawGuest.slice(0, 60) : undefined;

  return <InvitationClient config={WEDDING_CONFIG} guestName={guestName} />;
}
