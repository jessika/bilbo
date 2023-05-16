import Link from "next/link";
import utilStyles from "../styles/utils.module.css";
import {
  hyperlink,
  imageAndTextContainer,
  listItem,
  subtext,
  textContainer,
  thumbnailContainer,
} from "./post-list-item.module.css";
import Date from "./date";
import Image from "next/image";

export default function PostListItem({
  id,
  updatedDate,
  thumbnail,
  title,
  visitedDate,
}: {
  id: string;
  updatedDate: string;
  thumbnail: string;
  title: string;
  visitedDate: string;
}) {
  return (
    <li className={listItem}>
      <Link
        className={`${hyperlink} ${imageAndTextContainer}`}
        href={`/posts/${id}`}
      >
        <div className={thumbnailContainer}>
          <Image src={thumbnail} height={220} width={330} alt="" />
        </div>
        <div className={textContainer}>
          <div>{title}</div>
          <div className={`${utilStyles.lightText} ${subtext}`}>
            <Date dateString={updatedDate} />
          </div>
        </div>
      </Link>
    </li>
  );
}
