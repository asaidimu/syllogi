export default ({ router, validate, controller }: Route<ExampleController>) => {
  router.get("/", validate, async (_, res) => {
    res.json({
      message: await controller.sayHello(),
    });
  });
};
