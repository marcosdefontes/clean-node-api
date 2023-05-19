import { MongoClient, Collection } from "mongodb";

export const MongoHelper = {
  uri: null as string,
  client: null as MongoClient,
  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },
  async disconnect(): Promise<void> {
    await this.client?.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) await this.connect(this.uri);

    return this.client.db().collection(name);
  },

  map: (collection: any): any => {
    return { id: collection._id, ...collection.ops[0] };
  },
};
