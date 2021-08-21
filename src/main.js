/**
 * Load .env files when the command runs
 */
require("dotenv").config();

/**
 * ethplore is a node.js cli tool
 * to explore Ethereum Network
 */
import {ethers} from 'ethers'
import {isNumber, help} from './utils'
import {txType} from "./block"
import View from "./view"


/**
 * main function that runs on execution
 */
(async function main(args) {
  /**
   * Check if any arguments have been provided
   * in case false, return help page.
   */
  if (!args.length || args.some((el) => ["help", "--help", "-h"].indexOf(el) >= 0)) {
    help()
    return
  }

  /**
   * Instantiate Ethers library
   */
  const eth = new ethers.getDefaultProvider(process.env.ETH_NETWORK, {
    infura: {
      projectId: process.env.INFURA_ID,
      projectSecret: process.env.INFURA_SECRET
    }
  });

  const blocks = {};
  const height = await eth.getBlockNumber();

  /**
   * Switch by default is true, and matches
   * any condition that returns true.
   *
   * First case tests for a number
   * Second case test for a range of numbers separated by '..'
   *
   * Note: the logic behind this comes from the Go Lang switch.
   */
  switch (true) {
    case isNumber(args[0]):
      try {
        for (let i = height; i >= (height - args[0]); i--) {
          blocks[i] = await eth.getBlockWithTransactions(i)
        }
      } catch (e) {
        console.error(e)
      }
      break
    case args[0].includes(".."):
      let [start, end] = args[0].split("..")
      if (start > end) [start, end] = [end, start]
      try {
        for (let i = (height - start); i >= (height - end); i--) {
          blocks[i] = await eth.getBlockWithTransactions(i)
        }
      } catch (e) {
        console.error(e)
      }
      break
  }

  const view = new View(blocks)
  if (args.includes("--tx-type")) {
    const param = args[args.indexOf("--tx-type") + 1]
    switch (param) {
      case "incoming":
        view.incoming()
        break
      case "outgoing":
        view.outgoing()
        break
      case "contract":
        view.contract()
        break
      case "all":
        view.all()
        break
    }
    return
  }

  /**
   * By default 'view' only the total amounts
   */
  for (const [, height] of view.blocks) {
    view.total(height)
  }

  /**
   * Exit process after completion
   */
  process.exit(1)
}(process.argv.splice(2)));
