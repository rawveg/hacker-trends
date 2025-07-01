export interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number; // number of comments
  kids?: number[];
  comments?: Comment[];
}

export interface Comment {
  id: number;
  by: string;
  text: string;
  time: number;
  sentiment: number;
  kids: Comment[];
}