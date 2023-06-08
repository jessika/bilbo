import { PostMetadata } from "../lib/posts";
import PostListItem from "./PostListItem";
import styles from "./post-list.module.scss";

export default function PostList({
  postMetadatas,
}: {
  postMetadatas: PostMetadata[];
}) {
  return (
    <ul className={styles.postList}>
      {postMetadatas.map(
        ({ id, updated_date, thumbnail, title, visited_date }) => (
          <PostListItem
            key={id}
            id={id}
            thumbnail={thumbnail}
            title={title}
            updatedDate={updated_date}
            visitedDate={visited_date}
          />
        )
      )}
    </ul>
  );
}
