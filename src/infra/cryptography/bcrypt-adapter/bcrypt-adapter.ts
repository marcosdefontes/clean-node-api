import bcrypt from "bcrypt";
import { HashComparer } from "../../../data/protocols/cryptography/hash-comparer";
import { Hasher } from "../../../data/protocols/cryptography/hasher";

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}
  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
