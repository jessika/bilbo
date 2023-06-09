import { Fragment, useEffect } from "react";
import {
  ColorScheme,
  getColorScheme,
  registerColorSchemeListener,
} from "../lib/color-schemes";

declare global {
  interface Window {
    REMARK42: any;
    remark_config: any;
  }
}

// This function will insert the usual <script> tag of
// Remark42 into the specified DOM location (parentElement)
const insertScript = (id: string, parentElement: HTMLElement) => {
  const script = window.document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.id = id;
  /* For Gatsby it's important to manually provide the URL
  and make sure it does not contain a trailing slash ("/").
  Because otherwise the comments for paths with/without 
  the trailing slash are stored separately in the BoltDB database.
  When following a Gatsby Link a page is loaded without the trailing slash,
  but when refreshing the page (F5) it is loaded with the trailing slash.
  So essentially every URL can become duplicated in the DB and you may not see
  your comments from the inverse URL at your present URL.
  Making sure url is provided without the trailing slash
  in the remark42 config solves this. */
  let url = window.location.origin + window.location.pathname;
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  const theme = getColorScheme();
  // Now the actual config and script-fetching function:
  script.innerHTML = `
    var remark_config = {
      host: "https://comments.jessgoesoutside.com",
      site_id: "jgo-comments",
      url: "${url}",
      components: ["embed"],
      theme: "${theme}",
    };
    !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);`;
  parentElement.appendChild(script);
};

/* This function removes the previously added script from the DOM.
Might be necessary when page transitions happen, to make sure a new instance 
is created, pointing to the current URL. Although this might actually 
not be necessary, please do your own testing. */
const removeScript = (id: string, parentElement: HTMLElement) => {
  const script = window.document.getElementById(id);
  if (script) {
    parentElement.removeChild(script);
  }
};

// This function will be provided to useEffect and will insert the script
// when the component is mounted and remove it when it unmounts
const manageScript = () => {
  if (!window) {
    return () => {};
  }
  const { document } = window;
  if (document.getElementById("remark42")) {
    insertScript("comments-script", document.body);
  }
  return () => removeScript("comments-script", document.body);
};

/* Another function for another useEffect - this is the most crucial part for
Gatsby compatibility. It will ensure that each page loads its own appropriate
comments, and that comments will be properly loaded */
const recreateRemark42Instance = () => {
  if (!window) {
    return;
  }
  const remark42 = window.REMARK42;
  if (remark42) {
    remark42.destroy();
    remark42.createInstance(window.remark_config);
  }
};

type CommentSectionProps = {
  /**
   * A unique value to identify this comment section.
   *
   * However, the code only uses this value to determine when to recreate the
   * Remark42 instance; the comment section identifier used by Remark42 will be
   * read directly from `window`.
   */
  location: string;
};

// The location prop is {props.location.pathname} from the parent component.
// I.e. invoke the component like this in the parent: <Comments location={props.location.pathname} />
export function CommentSection({ location }: CommentSectionProps) {
  // Insert the two useEffect hooks. Maybe you can combine them into one? Feel free if you want to.
  useEffect(manageScript, [location]);
  useEffect(recreateRemark42Instance, [location]);

  useEffect(() => {
    return registerColorSchemeListener((theme: ColorScheme) => {
      window.REMARK42 && window.REMARK42.changeTheme(theme);
    });
  }, []);

  return (
    <Fragment>
      <h2>Comments</h2>
      {/* This div is the target for actual comments insertion */}
      <div id="remark42" />
    </Fragment>
  );
}
