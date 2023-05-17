import Link from "next/link";
import utilStyles from "../styles/utils.module.css";
import styles from "./post-list-item.module.css";
import Date from "./date";
import Image from "next/image";

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
    <li className={styles.component}>
      <Link
        className={`${styles.hyperlink} ${styles.content} ${
          itemLayout == ItemLayout.Narrow ? styles.narrow : ""
        }`}
        href={`/posts/${id}`}
      >
        <div className={styles.thumbnailContainer}>
          <Image src={thumbnail} height={220} width={330} alt="" />
        </div>
        <div className={styles.textContainer}>
          <div className={utilStyles.headingMd}>{title}</div>
          <div className={`${utilStyles.lightText}`}>
            <Date dateString={updatedDate} />
          </div>
        </div>
      </Link>
    </li>
  );
}
