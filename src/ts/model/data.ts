// Generic
interface Attributes {
  version: number;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

interface Relationship {
  id: string;
  type: string;
}

interface Object<T extends Attributes> {
  attributes: T;
  id: string;
  relationships: Relationship[];
  type: string;
}

// Manga
interface TagAttributes extends Attributes {
  description: { en: string };
  group: string;
  name: { en: string };
}

type Tag = Object<TagAttributes>;

interface Links {
  al: string;
  amz: string;
  ap: string;
  bw: string;
  kt: string;
  mal: string;
  mu: string;
}

interface MangaAttributes extends Attributes {
  altTitles: { en: string }[];
  contentRating: string;
  description: { en: string };
  lastChapter: string;
  lastVolume: string;
  links: Links;
  originalLanguage: string;
  publicationDemographic: string;
  status: string;
  tags: Tag[];
  title: { en: string };
  year: string;
}

export type Manga = Object<MangaAttributes>;

// Author/Artist
interface AuthorArtistAttributes extends Attributes {
  name: string;
  imageUrl: string;
  twitter: string;
  pixiv: string;
  melonBook: string;
  fanBox: string;
  booth: string;
  nicoVideo: string;
  skeb: string;
  fantia: string;
  tumblr: string;
  youtube: string;
  website: string;
}

export type AuthorArtist = Object<AuthorArtistAttributes>;

// Cover
interface CoverAttributes extends Attributes {
  volume: string;
  fileName: string;
  description: string;
}

export type Cover = Object<CoverAttributes>;
