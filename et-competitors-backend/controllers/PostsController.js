import prismaClient from "../utils/prismaClient.js";
import { validationResult } from "express-validator";

/* USED APIs */
export const index = async (request, response) => {
  try {
    const posts = await prismaClient.posts.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        postCounts: true,
        postsUrls: {
          select: {
            postUrl: true,
            postId: true,
            socialMediaApp: {
              select: {
                logo: true,
                name: true,
              },
            },
          },
        },
        publishDate: true,
        publisher: {
          select: {
            name: true,
          },
        },
        scoialMediaAccount: {
          select: {
            profileUrl: true,
          },
        },
        socialMediaApp: {
          select: {
            name: true,
          },
        },
        types: {
          select: {
            name: true,
          },
        },
        subType: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return response.status(200).json({
      posts: posts,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
};

export const store = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({
      errors: errors.array(),
    });
  }
  request.body.publishDate = new Date(request.body.publishDate);
  const newPost = await prismaClient.posts.create({
    data: {
      title: request.body.title,
      description: request.body.description,
      coverImage: request.body.coverImage ? request.body.coverImage : undefined,
      publishDate: request.body.publishDate,
      publisherId: request.body.publisherId,
      postCounts: request.body.postCounts,
      socialMediaAppId: request.body.socialMediaAppId,
      socialMediaAccountId: request.body.socialMediaAccountId,
      typeId: request.body.typeId,
      subTypeId: request.body.subTypeId,
      postsUrls: {
        create: request.body.postUrl,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      coverImage: true,
      //postUrl: true,
      postCounts: true,
      publishDate: true,
      publisher: {
        select: {
          name: true,
        },
      },
      scoialMediaAccount: {
        select: {
          profileUrl: true,
        },
      },
      socialMediaApp: {
        select: {
          name: true,
        },
      },
      types: {
        select: {
          name: true,
        },
      },
      subType: {
        select: {
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  return response.status(200).json({
    post: newPost,
  });
  try {
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
};

const usrls = [];

export const postsURLs = async (request, response) => {
 
    /* const postsURLs = await Promise.all(
      usrls.map(async (item) => {
        const result = await prismaClient.posts_urls.create({
          data: {
            postUrl: item.postUrl,
            postId: item.id,
            socialMediaAppId: item.socialMediaAppId,
          },
        });
        return { result: result };
      })
    ); */
    const result = await prismaClient.posts_urls.create({
      data: {
        postUrl: request.body.postUrl,
        postId: request.body.postId,
        socialMediaAppId: request.body.socialMediaAppId,
      },
    });
    return response.status(200).json({
      postsURLs: result,
    }); try {
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
};

/************************************ NOT USED APIs **************************************/

/* Companies 
async function companies(fromDate, toDate, type) {
  const result = await prismaClient.posts.groupBy({
    by: ["publisherId"],
    where: {
      typeId: type ? type : undefined,
      publishDate: {
        gte: fromDate ? new Date(fromDate) : undefined,
        lte: toDate ? new Date(toDate) : undefined,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });

  const finalResults = await Promise.all(
    result.map(async (item) => {
      const company = await prismaClient.companies.findUnique({
        where: {
          id: item.publisherId,
        },
        select: {
          id: true,
          logo: true,
          name: true,
          description: true,
        },
      });
      return { ...company, count: item._count.id };
    })
  );

  return finalResults;
}*/

/* Types 
async function categories(fromDate, toDate) {
  const result = await prismaClient.posts.groupBy({
    by: ["typeId", "subTypeId"],
    where: {
      publishDate: {
        gte: fromDate ? new Date(fromDate) : undefined,
        lte: toDate ? new Date(toDate) : undefined,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });

  const finalResults = await Promise.all(
    result.map(async (item) => {
      const typeNameResult = await prismaClient.types.findUnique({
        where: {
          id: item.typeId,
        },
        select: {
          name: true,
        },
      });

      const subTypeNameResult = await prismaClient.sub_types.findUnique({
        where: {
          id: item.subTypeId,
        },
        select: {
          name: true,
        },
      });

      return {
        count: item._count.id,
        type: typeNameResult.name,
        subType: subTypeNameResult.name,
      };
    })
  );

  return finalResults;
}*/

/* Social Media Apps
async function socialMediaApps(fromDate, toDate) {
  const result = await prismaClient.posts.groupBy({
    by: ["socialMediaAppId"],
    where: {
      publishDate: {
        gte: fromDate ? new Date(fromDate) : undefined,
        lte: toDate ? new Date(toDate) : undefined,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });

  const finalResults = await Promise.all(
    result.map(async (item) => {
      const socialApp = await prismaClient.social_media_apps.findUnique({
        where: {
          id: item.socialMediaAppId,
        },
        select: { name: true, logo: true },
      });
      return { count: item._count.id, ...socialApp };
    })
  );

  return finalResults;
} */

/* Filters on Posts 
export const filters = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const { fromDate, toDate, type } = request.body;
    return response.status(200).json({
      companies: await companies(fromDate, toDate, type),
      //categories: await categories(fromDate, toDate),
      //socialMediaApps: await socialMediaApps(fromDate, toDate),
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
};*/

/* export const showByDate = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }
    let { fromDate, toDate } = request.body;
    //  if (!fromDate && !toDate) {
    //   const currentDate = new Date();
    //   const currentYear = currentDate.getFullYear();
    //   const yearBefore = new Date(currentDate.setFullYear(currentYear - 1));
    //   fromDate = yearBefore;
    //   toDate = new Date();
    // } 
    console.log("from data: ", fromDate);
    console.log("to date: ", toDate);

    const posts = await prismaClient.posts.findMany({
      where: {
        publishDate: {
          gte: new Date("2024-10-01"),
          lte: new Date("2024-11-06"),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        postUrl: true,
        publishDate: true,
        publisher: {
          select: {
            name: true,
          },
        },
        scoialMediaAccount: {
          select: {
            profileUrl: true,
          },
        },
        socialMediaApp: {
          select: {
            name: true,
          },
        },
        types: {
          select: {
            name: true,
          },
        },
        subType: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.status(200).json({
      count: posts.length,
      posts: posts,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
}; */
