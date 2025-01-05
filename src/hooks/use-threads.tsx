import { api } from "@/trpc/react";
import { getQueryKey } from "@trpc/react-query";
import { useLocalStorage } from "usehooks-ts";

const useThreads = () => {
  const { data: accounts } = api.mail.getAccounts.useQuery();
  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage("email-sync-tab", "inbox");
  const [done] = useLocalStorage("email-sync-done", false);
  const queryKey = getQueryKey(
    api.mail.getThreads,
    { accountId, tab, done },
    "query",
  );
  const {
    data: threads,
    isFetching,
    refetch,
  } = api.mail.getThreads.useQuery(
    {
      accountId,
      done,
      tab,
    },
    {
      enabled: !!accountId && !!tab,
      placeholderData: (e) => e, // render data statically instead of flashing it out
      refetchInterval: 1000 * 5,
    },
  );

  return {
    threads,
    isFetching,
    account: accounts?.find((account) => account.id === accountId),
    refetch,
    accounts,
    queryKey,
    accountId,
  };
};

export default useThreads;
