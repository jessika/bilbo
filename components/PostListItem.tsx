import Link from "next/link";
import styles from "./post-list-item.module.scss";
import Date from "./Date";
import Image from "next/image";
import cx from "classnames";

export enum ItemLayout {
  /** Thumbnail is above text. */
  Narrow,
  /** Thumbnail and text are side-by-side unless screen is narrow. */
  Responsive,
}

export default function PostListItem({
  id,
  itemLayout = ItemLayout.Responsive,
  updatedDate,
  thumbnail,
  title,
  visitedDate,
  useLazyLoading = false,
}: {
  id: string;
  itemLayout?: ItemLayout;
  updatedDate: string;
  thumbnail: string;
  title: string;
  visitedDate: string;
  useLazyLoading?: boolean;
}) {
  return (
    <li
      className={cx(styles.component, {
        [styles.component_narrow]: itemLayout == ItemLayout.Narrow,
      })}
    >
      <Link className={styles.content} href={`/posts/${id}`}>
        <div className={styles.thumbnailContainer}>
          <img
            className={styles.thumbnail}
            src={thumbnail}
            alt=""
            loading={useLazyLoading ? "lazy" : undefined}
          ></img>
        </div>
        <div>
          <h3 className={styles.heading}>{title}</h3>
          <div className={styles.date}>
            <Date dateString={updatedDate} />
          </div>
        </div>
      </Link>
    </li>
  );
}
