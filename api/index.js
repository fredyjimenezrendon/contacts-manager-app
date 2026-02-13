export default async (req, res) => {
  const { reqHandler } = await import(
    '../dist/contacts-manager/server/server.mjs'
  );
  return reqHandler(req, res);
};
