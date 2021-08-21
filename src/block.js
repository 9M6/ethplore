/**
 * Import External Libraries
 */
import _set from "lodash.set";
import {BigNumber} from "ethers";

/**
 * txType is a enum look-alike that represents
 * three different transactions:
 * - incoming
 * - outgoing
 * - contract
 *
 * @type {{incoming: number, outgoing: number, contract: number}}
 */
export const txType = {
  incoming: 0,
  outgoing: 1,
  contract: 2
}

/**
 * Class Block which creates a hashmap internally
 * to represent all incoming and outgoing transactions
 */
export default class Block {
  /**
   * A JavaScript Object that acts as a hashmap.
   * Has been created without inheriting anything from
   * the prototype chain.
   *
   * @type {Object}
   */
  hashmap = Object.create(null);

  /**
   * Initialize a block and map all transactions into a hashmap,
   * and append the [from, to] as a tuple mapped as [incoming, outgoing].
   *
   * Also put a true|false if the destination is a contract.
   *
   * @param block
   */
  constructor(block) {
    block.transactions.map((tx) => {
      /**
       * Assign tx.from || tx.to into the hashmap and map
       * its transaction value
       */
      _set(this.hashmap, [tx.from, txType.incoming], BigNumber.from(tx.value));
      _set(this.hashmap, [tx.to, txType.outgoing], BigNumber.from(tx.value));

      /**
       * Check if outgoing transaction is a contract call by
       * checking the tx.data payload
       */
      _set(this.hashmap, [tx.to, txType.contract], tx.data !== "0x");
    })
  }

  /**
   * incoming method filters the transaction list and creates
   * an array with a tuple like data of the incoming transactions
   * the first element of the tuple is the address and the second
   * element is the amount in the BigNumber type
   *
   * @returns {[string, BigNumber][]}
   */
  incoming() {
    return Object
    .keys(this.hashmap)
    .filter((addr) => this.hashmap[addr][txType.incoming] !== undefined)
    .map((addr) => [
      addr,
      this.hashmap[addr][txType.incoming],
      this.hashmap[addr][txType.contract]
    ])
  }

  /**
   * outgoing method filters the transaction list and creates
   * an array with a tuple like data of the outgoing transactions
   * the first element of the tuple is the address and the second
   * element is the amount in the BigNumber type
   *
   * @returns {[string, BigNumber][]}
   */
  outgoing() {
    return Object
    .keys(this.hashmap)
    .filter((addr) => this.hashmap[addr][txType.outgoing] !== undefined)
    .map((addr) => [
      addr,
      this.hashmap[addr][txType.outgoing],
      this.hashmap[addr][txType.contract]
    ])
  }

  /**
   * this.contracts method returns a filtered version of
   * this.outgoing method that singles out all addresses
   * that are contracts.
   */
  contracts() {
    return this.outgoing().filter((tx) => tx[2] && tx)
  }

  /**
   * total returns the total amount that have been transferred of
   * the current block, it will return either the incoming or outgoing
   * transactions.
   *
   * @param type
   * @returns {BigNumber}
   */
  total(type) {
    if (type !== txType.incoming &&
      type !== txType.outgoing) {
      throw Error(`Required txType to be of value ${txType.incoming} or ${txType.outgoing}`)
    }
    return Object
    .values(this.hashmap)
    .reduce((acc, value) => {
      if (!value[type]) return acc;
      return acc.add(value[type]);
    }, BigNumber.from(0))
  }

  /**
   * Return the size of the entire hashmap.
   *
   *  @returns {number}
   */
  size() {
    return Object.keys(this.hashmap).length
  }
}
