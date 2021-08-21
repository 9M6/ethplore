/**
 * Import
 */
import Block, {txType} from "./block";
import {ethers} from "ethers";

/**
 * View class to render the output
 * of the Block object.
 */
export default class View {
  /**
   * A block object that's iterable
   * @type {any}
   */
  blocks = Object.create({
    [Symbol.iterator]: function* () {
      const keys = Object.keys(this)
      for (let i = 0; i < keys.length; i++) {
        yield [this[keys[i]], keys[i]]
      }
    }
  })

  /**
   * Initialize all instances of the block transactions
   * with the Block object, and assign them to the
   * this.blocks iterable object.
   * @param blocks
   */
  constructor(blocks) {
    const keys = Object.keys(blocks)
    for (let i = 0; i < keys.length; i++) {
      this.blocks[keys[i]] = new Block(blocks[keys[i]])
    }
  }

  /**
   * Render into console.table the incoming transactions and
   * their unique addresses and ether amount
   */
  incoming() {
    for (const [block, height] of this.blocks) {
      console.table(block.incoming().map(tx => {
        const [address, ether] = tx
        return {
          height,
          address,
          ether: ethers.utils.formatEther(ether)
        }
      }))
      this.total(height)
    }
  }

  /**
   * Render into console.table the outgoing transactions and
   * their unique addresses and ether amount
   */
  outgoing() {
    for (const [block, height] of this.blocks) {
      console.table(block.outgoing().map(tx => {
        const [address, ether] = tx
        return {
          height,
          address,
          ether: ethers.utils.formatEther(ether)
        }
      }))
      this.total(height)
    }
  }

  /**
   * Render into console.table the contracts transactions and
   * their unique addresses.
   */
  contracts() {
    for (const [block, height] of this.blocks) {
      console.table(block.contracts().map(tx => {
        const [address, ether] = tx
        return {
          height,
          address,
          ether: ethers.utils.formatEther(ether)
        }
      }))
    }
  }

  /**
   * Render into console.table the total of the specific block height.
   */
  total(height) {
    const block = this.blocks[height]
    console.table([{
      "Height": height,
      "Incoming Addr": block.incoming().length,
      "Outgoing Addr": block.outgoing().length,
      "Total Addr": Object.keys(block.hashmap).length,
      "Contracts Addr": block.contracts().length,
      "Total Incoming Ether": ethers.utils.formatEther(block.total(txType.incoming)),
      "Total Outgoing Ether": ethers.utils.formatEther(block.total(txType.outgoing)),
    }])
  }

  /**
   * List all combined incoming and outgoing transactions
   */
  all() {
    for (const [block, height] of this.blocks) {
      const all = [...block.incoming(), ...block.outgoing()]
      console.table(all.map(tx => {
        const [address, ether] = tx
        return {
          height,
          address,
          ether: ethers.utils.formatEther(ether)
        }
      }))
      this.total(height)
    }
  }
}
