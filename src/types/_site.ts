import { Link, Site } from "@prisma/client";

export interface _SiteData extends Site {
  links: Link[];
}
