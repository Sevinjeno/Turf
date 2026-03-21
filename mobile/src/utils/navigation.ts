let routerRef: any;

export const setRouter = (router: any) => {
  routerRef = router;
};

export const navigate = (path: string) => {
  if (routerRef) {
    routerRef.replace(path);
  }
};