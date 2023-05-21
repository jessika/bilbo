import Link from "next/link";
import styles from "./post-list-item.module.scss";
import Date from "./date";
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
}: {
  id: string;
  itemLayout?: ItemLayout;
  updatedDate: string;
  thumbnail: string;
  title: string;
  visitedDate: string;
}) {
  return (
    <li
      className={cx(styles.component, {
        [styles.component_narrow]: itemLayout == ItemLayout.Narrow,
      })}
    >
      <Link className={styles.content} href={`/posts/${id}`}>
        <div className={styles.thumbnailContainer}>
          <Image
            src={thumbnail}
            height={220}
            width={330}
            style={{ height: "auto", width: "300px", objectFit: "contain" }}
            alt=""
          />
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
