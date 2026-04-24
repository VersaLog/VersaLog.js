import notifier from "node-notifier";

export const notifyPlugin = (log: any) => {
  log.setNotifier((title: string, message: string) => {
    notifier.notify({
      title,
      message,
      appName: "VersaLog",
    } as any);
  });
};