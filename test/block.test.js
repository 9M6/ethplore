require("dotenv").config()
import test from "ava"
import { ethers } from "ethers"
import Block from "../src/block"

test.before(async (t) => {
  t.context.ether = new ethers.getDefaultProvider(process.env.ETH_NETWORK);
  t.context.height = await t.context.ether.getBlockNumber();
  t.context.block = new Block(await t.context.ether.getBlockWithTransactions(t.context.height))

  t.context.unique = {}
  for (let i = 0; i < t.context.block.transactions.length; i++) {
    t.context.unique[t.context.block.transactions[i].from] = []
    t.context.unique[t.context.block.transactions[i].to]   = []
  }
})

test("new Block(provider)", t => {
  t.assert(t.context.block instanceof Block, "is not instance of Block");
  t.assert(Object.keys(t.context.block.hashmap).length > 0, "something went wrong mapping the hashmap")
  t.assert(t.context.block.transactions.length > 0, "no transaction was mapped to the object")
  t.deepEqual(Object.keys(t.context.block.hashmap), Object.keys(t.context.unique))
});

test("this.incoming()", async t => {
  t.true(t
    .context
    .block.incoming()
    .some(
      (addr) => Object.keys(t.context.unique).indexOf(addr)
    ), 'does not include any address of the block'
  );
});

test("this.outgoing()", async t => {
  t.true(t
    .context
    .block.outgoing()
    .some(
      (addr) => Object.keys(t.context.unique).indexOf(addr)
    ), 'does not include any address of the block'
  );
});

test("this.contract()", async t => {
  t.true(t
    .context
    .block.contract()
    .some(
      (addr) => Object.keys(t.context.unique).indexOf(addr)
    ), 'does not include any address of the block'
  );
});

test("this.size()", async t => {
  t.is(t.context.block.size(), Object.keys(t.context.block.hashmap).length);
});
