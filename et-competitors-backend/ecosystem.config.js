module.exports = {
    apps: [
      {
        name: "etqaan-competitors",
        script: "npm",
        args: "run dev",
        env: {
          NODE_ENV: "development",
          ENV_VAR1: "environment-variable",
        },
      },
    ],
  };