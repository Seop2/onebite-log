export const QUERY_KEYS = {
  profile: {
    all: ["profile"],
    list: ["profile", "list"],
    byId: (userId: string) => ["profile", "byId", userId],
  },
  post: {
    all: ["post"],
    list: ["post", "list"],
    userList: (userId: string) => ["post", "userList", userId],
    byId: (postId: number) => ["post", "byId", postId],
  },
  comment: {
    all: ["comment"],
    post: (postId: number) => ["comment", "post", postId],
    count: (postId: number) => ["comment", "count", postId],
  },
  chzzk: {
    all: ["chzzk"],
    channel: (channelId: string) => ["chzzk", "channel", channelId],
    search: (keyword: string) => ["chzzk", "search", keyword],
  },
};

export const BUCKET_NAME = "uploads";
