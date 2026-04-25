export interface Manga {
  id: string;
  title: string;
  cover?: string;
}

export interface Chapter {
  id: string;
  title: string;
  number: number;
}

export interface ExtensionAPI {
  search?(query: string): Promise<Manga[]>;
  getDetails?(id: string): Promise<any>;
  getChapters?(id: string): Promise<Chapter[]>;
  getPages?(id: string): Promise<string[]>;
}
