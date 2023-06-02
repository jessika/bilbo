import { NextApiRequest, NextApiResponse } from "next";
import { getPostSearchDatas } from "../../lib/posts";

/** Handles a request of the format `/search?q=SEARCH_TERM` */
export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const searchText = getSearchText(req);
  const postDatas = searchText
    ? getPostSearchDatas().filter((data) => {
        if (data.title.toLowerCase().includes(searchText)) {
          return true;
        }
        return data.fileContent.toLowerCase().includes(searchText);
      })
    : [];
  const postMetadatas = postDatas.map((postData) => ({
    id: postData.id,
    thumbnail: postData.thumbnail,
    title: postData.title,
    updated_date: postData.updated_date,
    visited_date: postData.visited_date,
  }));
  res.status(200).json({ postMetadatas });
  res.end();
}

function getSearchText(req: NextApiRequest) {
  const qValue = req.query.q;
  if (!qValue) {
    return "";
  }
  if (typeof qValue === "string") {
    return qValue.toLowerCase();
  }
  if (qValue.length) {
    return qValue[0].toLowerCase();
  }
  return "";
}
