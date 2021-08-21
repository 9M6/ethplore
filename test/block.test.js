const test = require("ava");
const { ethers } = require("ethers");
const Block = require("../src/block.js");

test.before(async (t) => {
  const eth = new ethers.getDefaultProvider(process.env.ETH_NETWORK, {
    infura: {
      projectId: process.env.INFURA_ID,
      projectSecret: process.env.INFURA_SECRET
    }
  });
  const height = await eth.getBlockNumber();
  const block = await eth.getBlockWithTransactions(height)
  t.context = { eth, height, block }
})

test("new Block(provider)", t => {
  t.is(true, true);
});

test("this.incoming()", async t => {
  t.is(true, true);
});

test("this.outgoing()", async t => {
  t.is(true, true);
});

test("this.contracts()", async t => {
  t.is(true, true);
});

test("this.total()", async t => {
  t.is(true, true);
});

test("this.size()", async t => {
  t.is(true, true);
});
