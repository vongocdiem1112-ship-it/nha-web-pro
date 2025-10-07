import { createTRPCRouter } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";
import { getAllListingsProcedure } from "./routes/listings/get-all/route";
import { getListingByIdProcedure } from "./routes/listings/get-by-id/route";
import { searchListingsProcedure } from "./routes/listings/search/route";
import { createListingProcedure } from "./routes/listings/create/route";
import { updateListingProcedure } from "./routes/listings/update/route";
import { deleteListingProcedure } from "./routes/listings/delete/route";
import { getMyListingsProcedure } from "./routes/listings/get-my-listings/route";
import { registerProcedure } from "./routes/auth/register/route";
import { loginProcedure } from "./routes/auth/login/route";
import { getProfileProcedure } from "./routes/users/get-profile/route";
import { updateProfileProcedure } from "./routes/users/update-profile/route";
import { getFavoritesProcedure } from "./routes/favorites/get-all/route";
import { addFavoriteProcedure } from "./routes/favorites/add/route";
import { removeFavoriteProcedure } from "./routes/favorites/remove/route";
import { checkFavoriteProcedure } from "./routes/favorites/check/route";
import { getAllNewsProcedure } from "./routes/news/get-all/route";
import { getNewsByIdProcedure } from "./routes/news/get-by-id/route";
import { getConversationsProcedure } from "./routes/conversations/get-all/route";
import { getOrCreateConversationProcedure } from "./routes/conversations/get-or-create/route";
import { getMessagesProcedure } from "./routes/messages/get-by-conversation/route";
import { sendMessageProcedure } from "./routes/messages/send/route";
import { createContactHistoryProcedure } from "./routes/contact-history/create/route";
import { getBrokerContactHistoryProcedure } from "./routes/contact-history/get-broker-history/route";
import { getBrokerStatisticsProcedure } from "./routes/broker/get-statistics/route";
import { getTemplateSuggestionsProcedure } from "./routes/templates/get-suggestions/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  listings: createTRPCRouter({
    getAll: getAllListingsProcedure,
    getById: getListingByIdProcedure,
    search: searchListingsProcedure,
    create: createListingProcedure,
    update: updateListingProcedure,
    delete: deleteListingProcedure,
    getMyListings: getMyListingsProcedure,
  }),
  auth: createTRPCRouter({
    register: registerProcedure,
    login: loginProcedure,
  }),
  users: createTRPCRouter({
    getProfile: getProfileProcedure,
    updateProfile: updateProfileProcedure,
  }),
  favorites: createTRPCRouter({
    getAll: getFavoritesProcedure,
    add: addFavoriteProcedure,
    remove: removeFavoriteProcedure,
    check: checkFavoriteProcedure,
  }),
  news: createTRPCRouter({
    getAll: getAllNewsProcedure,
    getById: getNewsByIdProcedure,
  }),
  conversations: createTRPCRouter({
    getAll: getConversationsProcedure,
    getOrCreate: getOrCreateConversationProcedure,
  }),
  messages: createTRPCRouter({
    getByConversation: getMessagesProcedure,
    send: sendMessageProcedure,
  }),
  contactHistory: createTRPCRouter({
    create: createContactHistoryProcedure,
    getBrokerHistory: getBrokerContactHistoryProcedure,
  }),
  broker: createTRPCRouter({
    getStatistics: getBrokerStatisticsProcedure,
  }),
  templates: createTRPCRouter({
    getSuggestions: getTemplateSuggestionsProcedure,
  }),
});

export type AppRouter = typeof appRouter;
