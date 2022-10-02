import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import type { ParsedUrlQuery } from "querystring";
import { prisma } from "../../../server/db/client";
import Head from "next/head";
import SitePreview from "../../../components/site-preview";
import { _SiteData } from "../../../types/_site";

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  stringifiedData: string;
}

const Index = (props: IndexProps) => {
  const siteData = JSON.parse(props.stringifiedData) as _SiteData;
  return (
    <>
      <Head>
        <title>{siteData.title}</title>
        {siteData.description && (
          <meta name="description" content={siteData.description} />
        )}
      </Head>
      <SitePreview data={siteData} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const [subdomains, customDomains] = await Promise.all([
    prisma.site.findMany({
      select: {
        subdomain: true,
      },
    }),
    prisma.site.findMany({
      where: {
        NOT: {
          customDomain: null,
        },
        // you can remove this if you want to generate all sites at build time
        // customDomain: "platformize.co",
      },
      select: {
        customDomain: true,
      },
    }),
  ]);

  const allPaths = [
    ...subdomains.map(({ subdomain }) => subdomain),
    ...customDomains.map(({ customDomain }) => customDomain),
  ].filter((path) => path) as Array<string>;

  return {
    paths: allPaths.map((path) => ({
      params: {
        site: path,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error("No path parameters found");

  const { site } = params;

  let filter: {
    subdomain?: string;
    customDomain?: string;
  } = {
    subdomain: site,
  };

  if (site.includes(".")) {
    filter = {
      customDomain: site,
    };
  }
  const data = await prisma.site.findUnique({
    where: filter,
    include: {
      user: true,
      links: {
        where: {
          active: true,
        },
      },
    },
  });

  if (!data)
    return {
      notFound: true,
      revalidate: 10,
    };

  return {
    props: {
      stringifiedData: JSON.stringify(data),
    },
    revalidate: 3600,
  };
};

export default Index;
