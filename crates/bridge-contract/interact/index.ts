import { Command } from "commander";
import { e, envChain, World } from "xsuite";
import data from "./data.json";

const world = World.new({
  proxyUrl: envChain.publicProxyUrl(),
  chainId: envChain.id(),
  gasPrice: 1000000000,
});

const loadWallet = () => world.newWalletFromFile("wallet.json");

const program = new Command();

program.command("deploy").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.deployContract({
    code: data.code,
    codeMetadata: ["upgradeable", "readable", "payable", "payableBySc"],
    gasLimit: 20_000_0000,
  });
  console.log("Result:", result);
});

program.command("upgrade").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.upgradeContract({
    callee: envChain.select(data.address),
    code: data.code,
    codeMetadata: ["upgradeable"],
    gasLimit: 20_000_0000,
  });
  console.log("Result:", result);
});

program.command("issue").action(async () => {
  const wallet = await loadWallet();
  const result1 = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "issueToken1",
    gasLimit: 20_000_0000,
    value: 50_000_000_000_000_000,
  });
  console.log("Result1:", result1);
  const result2 = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "issueToken2",
    gasLimit: 20_000_0000,
    value: 50_000_000_000_000_000,
  });
  console.log("Result2:", result2);
  const result3 = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "issueToken3",
    gasLimit: 20_000_0000,
    value: 50_000_000_000_000_000,
  });
  console.log("Result3:", result3);
  const result4 = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "issueToken4",
    gasLimit: 20_000_0000,
    value: 50_000_000_000_000_000,
  });
  console.log("Result4:", result4);
});

program.command("mint").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "mint",
    gasLimit: 20_000_0000,
    funcArgs: [
      e.Str("WEGLD-4505c8"),
      e.U32(1000),
      e.Addr("erd16khr9p5g9d4xvuvdlnchzqym4va04uhxus7rqsagledkjxcurq0qv2re6q"),
    ],
  });
  console.log("Result:", result);
});

program.command("getTokens").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "getTokenIds",
    gasLimit: 20_000_0000,
  });
  console.log("Result:", result);
});

program.command("ClaimDeveloperRewards").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "ClaimDeveloperRewards",
    gasLimit: 10_000_000,
  });
  console.log("Result:", result);
});

program.parse(process.argv);
