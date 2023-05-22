import { NextApiRequest, NextApiResponse } from "next";
import { getSortedPostMetadatas } from "../../lib/posts";

/** Handles a request of the format `/search?q=SEARCH_TERM` */
export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const searchText = getSearchText(req);
  const postMetadatas = searchText
    ? getSortedPostMetadatas().filter((postMetadata) =>
        postMetadata.title.toLowerCase().includes(searchText)
      )
    : [];
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ postMetadatas });
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
