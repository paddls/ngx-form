export class FriendModel {

  public id: number;

  public name: string;

  public age: number;

  public email: string;

  public constructor(data: Partial<FriendModel> = {}) {
    Object.assign(this, data);
  }
}
