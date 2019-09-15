import { Post } from "../entities/Post";

export function getPosts() {
  const post0 = new Post();
  post0.title = "The title";
  post0.text = "The text";
  post0.author = "The author";
  const post1 = new Post();
  post1.title = "The title";
  post1.text = "The text";
  post1.author = "Carlos";
  const post2 = new Post();
  post2.title = "The title 2";
  post2.text = "The text 2";
  post2.author = "The author";
  return [post0, post1, post2];
}
