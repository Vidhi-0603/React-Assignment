import type { ArtWorksResponse } from "./types";

export const fetchRows = async (
  currentPage: number,
): Promise<ArtWorksResponse> => {
  try {
    const res: Response = await fetch(
      `https://api.artic.edu/api/v1/artworks?page=${currentPage}`,
    );
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);

    throw new Error("Failed to fetch artworks");
  }
};
