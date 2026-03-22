import { NextResponse } from "next/server";

import { fetchBreedProfile, slugifyBreed } from "@/lib/data/breeds";

export async function GET(
  _request: Request,
  context: { params: Promise<{ breed: string }> },
) {
  const { breed } = await context.params;
  const breedSlug = slugifyBreed(decodeURIComponent(breed));
  const profile = await fetchBreedProfile(breedSlug);
  return NextResponse.json(profile, { status: 200 });
}
