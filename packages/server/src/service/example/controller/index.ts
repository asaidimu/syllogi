const loginController: Controller<ExampleController> = () => {
  return {
    sayHello: () => Promise.resolve("Hello, World!"),
  };
};

export default loginController;
