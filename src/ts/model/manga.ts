interface Relationship {
  id: string;
  type: string;
}

interface Object {
  id: string;
  relationships: Relationship[];
  type: string;
}

interface Attributes {
  description: { en: string };
  version: number;
}

interface TagAttributes extends Attributes {
  group: string;
  name: { en: string };
}

interface Tag extends Object {
  attributes: TagAttributes;
}

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
  createdAt: string;
  lastChapter: string;
  lastVolume: string;
  links: Links;
  originalLanguage: string;
  publicationDemographic: string;
  status: string;
  tags: Tag[];
  title: string;
  updatedAt: string;
  year: string;
}

export default interface Manga extends Object {
  attributes: MangaAttributes;
}
