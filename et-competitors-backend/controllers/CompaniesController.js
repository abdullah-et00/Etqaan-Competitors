import prismaClient from "../utils/prismaClient.js";
import { validationResult } from "express-validator";

/* Used APIs */

export const index = async (request, response) => {
  try {
    const companies = await prismaClient.companies.findMany({
      where: {
        id: {
          notIn: [
            "0b6e7f45-8816-405b-b45f-96b3a2b169e3",
            "0dcec4a1-d45d-4287-80c8-bb0392374d77",
          ],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return response.status(200).json({
      companies: companies,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
};

export const show = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const company = await prismaClient.companies.findUnique({
      where: {
        id: request.params.uuId,
      },
      include: {
        socialMediaAccounts: {
          select: {
            id: true,
            profileUrl: true,
            socialMediaApps: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
        posts: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            postCounts: true,
            publishDate: true,
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
            publisher: {
              select: {
                name: true,
              },
            },
            postsUrls: {
              select: {
                id: true,
                postUrl: true,
                postId: true,
                socialMediaApp: {
                  select: {
                    name: true,
                    logo: true,
                  },
                },
              },
            },

            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            publishDate: "desc",
          },
        },
      },
    });

    return response.status(200).json({
      company: company,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
};

const reportPostsStatistics = async (uuId, fromDate, toDate, type) => {
  const results = await prismaClient.posts.groupBy({
    by: ["typeId"],
    where: {
      publisherId: uuId,
      publishDate: {
        gte: fromDate ? new Date(fromDate) : undefined,
        lte: toDate ? new Date(toDate) : undefined,
      },
      typeId: type ? type : undefined,
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
  const finalResult = await Promise.all(
    results.map(async (item) => {
      const typeNameResult = await prismaClient.types.findUnique({
        where: {
          id: item.typeId,
        },
        select: {
          name: true,
          id: true,
        },
      });

      return {
        count: item._count.id,
        type: typeNameResult.name,
        id: typeNameResult.id,
      };
    })
  );

  return finalResult;
};

export const companyReport = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const company = await prismaClient.companies.findUnique({
      where: {
        id: request.params.uuId,
      },
      select: {
        name: true,
        logo: true,
        description: true,
        socialMediaAccounts: {
          select: {
            profileUrl: true,
            socialMediaApps: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    const date = new Date();
    const currentDateString = date.toISOString().split("T")[0];

    const previousYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const previousDateString = previousYear.toISOString().split("T")[0];
    const fromDate = previousDateString;
    const toDate = currentDateString;

    const postsRepo = await reportPostsStatistics(
      request.params.uuId,
      fromDate,
      toDate
    );

    const result = {
      quarter: fromDate + " / " + toDate,
      postsRepo: postsRepo,
    };
    return response.status(200).json({
      company: company,
      report: result,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
};

export const companyPosts = async (request, response) => {
  try {
    const date = new Date();
    const currentDateString = date.toISOString().split("T")[0];

    const previousYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const previousDateString = previousYear.toISOString().split("T")[0];
    const fromDate = previousDateString;
    const toDate = currentDateString;

    const posts = await prismaClient.posts.findMany({
      where: {
        publisherId: request.params.id,
        typeId: request.params.typeId,
        publishDate: {
          gte: fromDate ? new Date(fromDate) : undefined,
          lte: toDate ? new Date(toDate) : undefined,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        publishDate: true,
        publisher: {
          select: {
            name: true,
          },
        },
        postCounts: true,
        postsUrls: {
          select: {
            postUrl: true,
            socialMediaApp: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
        types: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
    });

    return response.status(200).json({
      companyPosts: posts,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
};

export const store = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const newCompany = await prismaClient.companies.create({
      data: request.body,
    });

    return response.status(200).json({
      company: newCompany,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
};

//----------------------------------------- Not Used APIs ------------------------------------------------//

/* Show Company with data 
export const show = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const company = await prismaClient.companies.findUnique({
      where: {
        id: request.params.uuId,
      },
      include: {
        posts: {
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
                logo: true,
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
          orderBy: {
            publishDate: "desc",
          },
        },
        socialMediaAccounts: {
          select: {
            id: true,
            profileUrl: true,
            socialMediaApps: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const postsStatistics = await companyPostsStatistics(
      request.params.uuId,
      3
    );
    const companySMAS = await companySocialMediaAccountsStatistics(
      request.params.uuId,
      3
    );

    return response.status(200).json({
      company: company,
      //postStatistics: postsStatistics,
      //companySMAS: companySMAS,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  } finally {
    await prismaClient.$disconnect();
  }
};

*/

/* Company Social Media Accounts Statistics 
const companySocialMediaAccountsStatistics = async (
  uuId,
  count,
  fromDate,
  toDate
) => {
  const result = await prismaClient.posts.groupBy({
    by: ["socialMediaAccountId"],
    where: {
      publisherId: uuId,
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
    take: count,
  });

  const finalResult = await Promise.all(
    result.map(async (account) => {
      const accountName = await prismaClient.social_media_accounts.findUnique({
        where: {
          id: account.socialMediaAccountId,
        },
        select: {
          socialMediaApps: {
            select: {
              name: true,
              logo: true,
            },
          },
          profileUrl: true,
        },
      });
      return { count: account._count.id, ...accountName };
    })
  );

  return finalResult;
};*/
/* Company post Statistics 
const companyPostsStatistics = async (uuId, count, fromDate, toDate) => {
  const results = await prismaClient.posts.groupBy({
    by: ["typeId", "subTypeId"],
    where: {
      publisherId: uuId,
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
    take: count,
  });

  const finalResult = await Promise.all(
    results.map(async (item) => {
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

  return finalResult;
};*/

/* Report */
/* Social Media Accounts Statistics 
const reportSocialMediaAccountsStatistics = async (
  uuId,
  fromDate,
  toDate,
  typeId,
  subTypeId
) => {
  const result = await prismaClient.posts.groupBy({
    by: ["socialMediaAccountId"],
    where: {
      publisherId: uuId,
      publishDate: {
        gte: fromDate ? new Date(fromDate) : undefined,
        lte: toDate ? new Date(toDate) : undefined,
      },
      typeId: typeId ? typeId : undefined,
      subTypeId: subTypeId ? subTypeId : undefined,
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

  const finalResult = await Promise.all(
    result.map(async (account) => {
      const accountName = await prismaClient.social_media_accounts.findUnique({
        where: {
          id: account.socialMediaAccountId,
        },
        select: {
          socialMediaApps: {
            select: {
              name: true,
              logo: true,
            },
          },
          profileUrl: true,
        },
      });
      return { count: account._count.id, ...accountName };
    })
  );

  return finalResult;
};*/
/* Post Statistics
const reportPostsStatisticsOld = async (uuId, fromDate, toDate, type) => {
  const results = await prismaClient.posts.groupBy({
    by: ["typeId"],
    where: {
      publisherId: uuId,
      publishDate: {
        gte: fromDate ? new Date(fromDate) : undefined,
        lte: toDate ? new Date(toDate) : undefined,
      },
      typeId: type ? type : undefined,
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
  const finalResult = await Promise.all(
    results.map(async (item) => {
      const typeNameResult = await prismaClient.types.findUnique({
        where: {
          id: item.typeId,
        },
        select: {
          name: true,
          id: true,
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
        id: typeNameResult.id,
      };
    })
  );

  return finalResult;
}; */

/* export const companyReportOld = async (request, response) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }

    const company = await prismaClient.companies.findUnique({
      where: {
        id: request.params.uuId,
      },
      select: {
        name: true,
        logo: true,
        description: true,
        socialMediaAccounts: {
          select: {
            profileUrl: true,
            socialMediaApps: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
    const date = new Date();
    const currentDateString = date.toISOString().split("T")[0];

    const previousYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const previousDateString = previousYear.toISOString().split("T")[0];
    const fromDate = previousDateString;
    const toDate = currentDateString;
    if (request.body.fromDate == "" && request.body.toDate == "") {
      
      request.body.fromDate = previousDateString;
      request.body.toDate = currentDateString;
    } 

    //const { fromDate, toDate, type } = request.body;
    const postsRepo = await reportPostsStatistics(
      request.params.uuId,
      fromDate,
      toDate
    );

     const accountsRepo = await reportSocialMediaAccountsStatistics(
      request.params.uuId,
      fromDate,
      toDate,
      type,
      subType
    ); 

    const result = [
      {
        quarter: fromDate + " / " + toDate,
        postsRepo: postsRepo,
        //accountsRepo: accountsRepo,
      },
    ];
    //console.log("ss", result);
    return response.status(200).json({
      company: company,
      report: result,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  } finally {
    await prismaClient.$disconnect();
  }
}; */

/* export const companyPostsOld = async (request, response) => {
  try {
    const date = new Date();
    const currentDateString = date.toISOString().split("T")[0];

    const previousYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const previousDateString = previousYear.toISOString().split("T")[0];
    const fromDate = previousDateString;
    const toDate = currentDateString;

    const posts = await prismaClient.posts.findMany({
      where: {
        publisherId: request.params.id,
        typeId: request.params.typeId,
        publishDate: {
          gte: fromDate ? new Date(fromDate) : undefined,
          lte: toDate ? new Date(toDate) : undefined,
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
        socialMediaApp: {
          select: {
            name: true,
            logo: true,
          },
        },
        types: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
    });

    return response.status(200).json({
      companyPosts: posts,
    });
  } catch (error) {
    return response.status(406).json({
      error: error,
    });
  }
}; */

/* const currentYear = new Date().getFullYear();
    let result = [];

    for (let i = 0; i < 12; i += 4) {
      const fromDate = new Date(currentYear + "-0" + (i + 1) + "-01");
      const toDate = new Date(currentYear + "-" + (i + 4) + "-31");
      result.push({
        quarter:
          fromDate.toString().split(" ").slice(1, 4).join("-") +
          " / " +
          toDate.toString().split(" ").slice(1, 4).join("-"),
        postsRepo: await companyPostsStatistics(
          request.params.uuId,
          undefined,
          fromDate,
          toDate
        ),
        accountsRepo: await companySocialMediaAccountsStatistics(
          request.params.uuId,
          undefined,
          fromDate,
          toDate
        ),
      });
    } */
